const express = require('express');
const router = express.Router();
const Resume = require('../../models/Resume');
const FigmaTemplate = require('../../models/ResumeTemplate');
const { authenticateToken } = require('../middleware/auth');
const { enhanceResumeWithGrok, fillFigmaTemplateWithData } = require('../../services/resumeGenerationService');
const { generateKeywords } = require('../../services/grokService');

// Generate resume with AI enhancement using Grok
router.post('/generate', async (req, res) => {
  try {
    const { templateId, templateJson, resumeData, aiPrompt, enhanceContent } = req.body;
    // Handle guest users - don't set userId for guests
    const userId = req.user?.id || null;
    
    console.log('🚀 Resume generation request:', {
      userId: userId || 'guest',
      templateId,
      hasTemplateJson: !!templateJson,
      hasResumeData: !!resumeData,
      enhanceContent
    });

    if (!templateId || !resumeData) {
      return res.status(400).json({ 
        success: false,
        message: 'Template ID and resume data are required' 
      });
    }

    // Get Figma template if not provided
    let template = templateJson;
    if (!template) {
      const figmaTemplate = await FigmaTemplate.findById(templateId);
      if (!figmaTemplate) {
        return res.status(404).json({ 
          success: false,
          message: 'Template not found' 
        });
      }
      template = figmaTemplate;
    }

    console.log('📋 Template found:', template.name);

    // Enhance resume data with Grok AI
    console.log('🤖 Enhancing resume with Grok AI...');
    const enhancedData = await enhanceResumeWithGrok(resumeData, template, aiPrompt);
    
    console.log('🎨 Filling template with enhanced data...');
    const filledTemplate = await fillFigmaTemplateWithData(template, enhancedData);
    
    // Create new resume record
    const resumeDoc = {
      templateId: templateId,
      originalData: resumeData,
      enhancedData: enhancedData,
      filledTemplate: filledTemplate,
      status: 'completed',
      aiPrompt: aiPrompt
    };
    
    // Only add userId if user is authenticated
    if (userId) {
      resumeDoc.userId = userId;
    }
    
    const newResume = new Resume(resumeDoc);
    
    const savedResume = await newResume.save();
    
    console.log('✅ Resume generated successfully:', savedResume._id);

    res.json({
      success: true,
      message: 'Resume generated successfully with AI enhancement',
      resumeId: savedResume._id,
      enhancedData: enhancedData,
      filledTemplate: filledTemplate
    });
    
  } catch (error) {
    console.error('❌ Resume Generation Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate resume', 
      error: error.message 
    });
  }
});

// Get resume by ID
router.get('/resumes/:resumeId', async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });

  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      error: error.message
    });
  }
});

// Generate AI keywords and summary for AIGeneratorSlide
router.post('/ai/generate', async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    
    if (!jobTitle) {
      return res.status(400).json({ 
        success: false,
        message: 'Job title is required' 
      });
    }

    console.log('🤖 Generating AI content for:', jobTitle);
    const result = await generateKeywords(jobTitle, jobDescription);
    
    res.json({
      success: true,
      summary: result.summary,
      keywords: result.keywords
    });
  } catch (error) {
    console.error('❌ AI Generation Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate AI content',
      error: error.message
    });
  }
});

module.exports = router;