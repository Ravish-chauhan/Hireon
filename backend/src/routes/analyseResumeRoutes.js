const express = require("express");
const router = express.Router();

const { uploadResume } = require("../middleware/multer");
const AnalyseResume = require("../../models/AnalyseResume");
const Analysis = require("../../models/Analysis");
const Resume = require("../../models/Resume");
const ResumeDraft = require("../../models/ResumeDraft");
const resumeService = require("../../services/resumeService");
const { extractTextFromPDF } = require("../../services/pdfExtractor");

const DUMMY_USER_ID = "guest_user";

// ========================================================
// 📌 1. Upload Resume + Extract Text + Save Resume
// ========================================================
router.post(
  "/upload",
  uploadResume.single("resume"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "Resume file missing" });

      const fileUrl = req.file.path;

      // Extract text
      const extractedText = await extractTextFromPDF(fileUrl);
      if (!extractedText)
        return res.status(400).json({ error: "Text extraction failed" });

      // Save resume to DB
      const resume = await AnalyseResume.create({
        userId: DUMMY_USER_ID,
        fileUrl,
        extractedText,
      });

      res.json({
        success: true,
        resumeId: resume._id,
        message: "Resume uploaded & extracted successfully",
      });
    } catch (err) {
      console.error("Resume upload error:", err);
      res.status(500).json({ error: "Server error during upload" });
    }
  }
);

// ========================================================
// 📌 2. Run AI Analysis (with optional JD)
// ========================================================
router.post("/analyze/:resumeId", async (req, res) => {
  try {
    const { jobDescription, jobRole } = req.body;
    const resumeId = req.params.resumeId;

    const resume = await AnalyseResume.findById(resumeId);
    if (!resume)
      return res.status(404).json({ error: "Resume not found" });

    const analysis = await resumeService.analyzeResume({
      resumeText: resume.extractedText,
      jobDescription,
      jobRole,
      resumeId,
      userId: DUMMY_USER_ID,
    });

    // Link analysis to resume
    resume.lastAnalysisId = analysis._id;
    await resume.save();

    analysis.fileUrl = resume.fileUrl;
    res.json({
      success: true,
      analysis,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

// ========================================================
// 📌 3. Rewrite Resume Based on Analysis
// ========================================================
router.post("/rewrite/:analysisId", async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.analysisId);
    if (!analysis)
      return res.status(404).json({ error: "Analysis not found" });

    const rewritten = await resumeService.rewriteResume({
      resumeText: analysis.rawResume,
      analysis,
    });

    analysis.rewrittenResume = rewritten;
    await analysis.save();

    res.json({
      success: true,
      rewrittenResume: rewritten,
    });
  } catch (err) {
    console.error("Rewrite error:", err);
    res.status(500).json({ error: "Rewrite failed" });
  }
});

router.get("/analysis/:id", async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis)
      return res.status(404).json({ error: "Analysis not found" });

    const resume = await AnalyseResume.findById(analysis.resumeId);

    res.json({
      success: true,
      analysis: {
        ...analysis.toObject(),
        fileUrl: resume?.fileUrl || null,
      }
    });
  } catch (err) {
    console.error("Get analysis error:", err);
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
});

// ========================================================
// 📌 Get User's Resume Analysis History
// ========================================================
router.get("/history", async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: DUMMY_USER_ID })
      .sort({ createdAt: -1 })
      .select('_id overallScore createdAt rawResume jobDescription resumeId');

    res.json({
      success: true,
      analyses,
    });
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// ========================================================
// 📌 Get Individual Resume Data
// ========================================================
router.get("/:resumeId", async (req, res) => {
  try {
    const resume = await AnalyseResume.findById(req.params.resumeId);
    if (!resume)
      return res.status(404).json({ error: "Resume not found" });

    res.json({
      success: true,
      resume,
    });
  } catch (err) {
    console.error("Get resume error:", err);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

// ========================================================
// 📌 7. Improve a Single Section (optional)
// ========================================================
router.post("/improve-section", async (req, res) => {
  try {
    const { sectionName, sectionText } = req.body;

    if (!sectionName || !sectionText)
      return res.status(400).json({ error: "Missing section data" });

    const improved = await resumeService.improveSection(
      sectionName,
      sectionText
    );

    res.json({
      success: true,
      improved,
    });
  } catch (err) {
    console.error("Section rewrite error:", err);
    res.status(500).json({ error: "Section improvement failed" });
  }
});

// ========================================================
// 📌 Draft Management Endpoints
// ========================================================

// Save or update a resume draft
router.post('/drafts', async (req, res) => {
  try {
    const { id, userId, name, template, data } = req.body;
    const effectiveUserId = userId || DUMMY_USER_ID;

    let draft;
    if (id) {
      draft = await ResumeDraft.findByIdAndUpdate(id, {
        name,
        template,
        data,
        updatedAt: new Date()
      }, { new: true });
    } else {
      draft = new ResumeDraft({
        userId: effectiveUserId,
        name,
        template,
        data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await draft.save();
    }

    res.json(draft);
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({ error: 'Failed to save draft' });
  }
});

// Get all drafts for a user
router.get('/drafts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId || DUMMY_USER_ID;
    const drafts = await ResumeDraft.find({ userId }).sort({ updatedAt: -1 });
    res.json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
});

// Get a specific draft by ID
router.get('/drafts/single/:draftId', async (req, res) => {
  try {
    const { draftId } = req.params;
    const draft = await ResumeDraft.findById(draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    res.json(draft);
  } catch (error) {
    console.error('Error fetching draft:', error);
    res.status(500).json({ error: 'Failed to fetch draft' });
  }
});

// Delete a draft
router.delete('/drafts/:draftId', async (req, res) => {
  try {
    const { draftId } = req.params;
    await ResumeDraft.findByIdAndDelete(draftId);
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Error deleting draft:', error);
    res.status(500).json({ error: 'Failed to delete draft' });
  }
});

// Get resume templates
router.get('/templates', async (req, res) => {
  try {
    const templates = [
      { id: 1, name: 'Professional', preview: '/template1.jpg' },
      { id: 2, name: 'Modern', preview: '/template2.jpg' },
      { id: 3, name: 'Creative', preview: '/template3.jpg' },
      { id: 4, name: 'Executive', preview: '/template4.jpg' },
      { id: 5, name: 'Minimalist', preview: '/template5.jpg' },
      { id: 6, name: 'Classic', preview: '/template6.jpg' }
    ];
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

module.exports = router;