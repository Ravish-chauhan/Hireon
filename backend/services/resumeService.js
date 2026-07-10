// ===============================
// 📌 resumeService.js (PRODUCTION)
// ===============================

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Analysis = require("../models/Analysis");
const AnalyseResume = require("../models/AnalyseResume");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -----------------------------
// Utility: Extract clean JSON
// -----------------------------
function extractJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return null;
  }
}

// =========================================================
// 1️⃣ ANALYZE RESUME (CORE FEATURE) – Uses Gemini 2.5 Pro
// =========================================================
module.exports.analyzeResume = async ({ resumeText, jobDescription, jobRole, resumeId, userId }) => {
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are an advanced ATS engine, Senior Hiring Manager, Technical Recruiter, and Resume Optimization Expert.

Your job is to evaluate and improve the resume across ALL major dimensions used by:
- FAANG-style ATS filters  
- HR hiring heuristics  
- Recruiter keyword scanning  
- Industry-standard resume scoring models  

You must analyze the resume deeply *even if the user does NOT provide JD or job role*.

If JOB ROLE or JOB DESCRIPTION is provided, perform targeted skill-matching and give personalized suggestions.

You MUST output *STRICT JSON ONLY*, following EXACTLY this structure:
{
 "overallScore": 0,

 "toneStyleScore": 0,
 "contentScore": 0,
 "structureScore": 0,
 "skillsScore": 0,

  "atsScore": 0,
  "readabilityScore": 0,
  "keywordMatchScore": 0,

  "summary": "",

  "strengths": [],
  "weaknesses": [],

  "suggestedImprovements": [],
  "skillsToAdd": [],
  "missingKeywords": [],
  "criticalFixes": [],

  "sectionWiseFeedback": {
      "summary": "",
      "experience": "",
      "projects": "",
      "skills": "",
      "education": ""
  },

  "optimizedSummary": ""
}
===========================
RESUME:
${resumeText}

JOB ROLE (optional):
${jobRole || "None"}

JOB DESCRIPTION (optional):
${jobDescription || "None"}
===========================
ANALYSIS RULES:
- Always give a *full resume evaluation*, not just JD-based feedback.
- If Job Role exists → include skills, tools, keywords, frameworks, responsibilities relevant to that role.
- If JD exists → identify keyword gaps, required responsibilities, missing ATS phrases.
- Identify grammar issues, weak action verbs, missing metrics, formatting inconsistencies.
- Improve clarity, conciseness, and impact of bullet points.
- Prioritize quantifiable achievements.
- Detect missing sections that are standard for modern resumes (Summary, Skills, Experience, Projects).
- Detect outdated technologies or irrelevant details.
- Evaluate ATS compatibility:
  - keyword density  
  - section headings  
  - bullet clarity  
  - readability grade level  
  - action word usage  
  - hard skills vs soft skills balance  
- Produce optimized summary that is concise, role-targeted, and ATS-friendly.

OUTPUT STRICT JSON ONLY.
`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();

  const json = extractJSON(text);
  if (!json) throw new Error("AI returned invalid JSON");

  // Save analysis
  const analysis = await Analysis.create({
    userId,
    resumeId,
    rawResume: resumeText,
    jobDescription: jobDescription || null,
    jobRole: jobRole || null,

    ...json
  });

  return analysis;
};


// =========================================================
// 2️⃣ IMPROVE ONE RESUME SECTION – Uses Gemini Flash
// =========================================================
module.exports.improveSection = async (sectionName, sectionText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
Rewrite the following resume section with:
- Strong, crisp, ATS-friendly points  
- Action verbs  
- No exaggeration  
- No JSON  
- Return ONLY the improved section text

SECTION: ${sectionName}

TEXT:
${sectionText}
`;

  const response = await model.generateContent(prompt);
  return response.response.text().trim();
};


// =========================================================
// 3️⃣ FULL RESUME REWRITE (AI-GENERATED) – Gemini 2.5 Pro
// =========================================================
module.exports.rewriteResume = async ({ resumeText, analysis }) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const prompt = `
Rewrite the entire resume in ATS-friendly, clean, modern language.

RULES:
- Retain correct facts from original resume  
- Fix grammar & flow  
- Add suggested improvements from analysis  
- Integrate optimized summary  
- Do NOT add unrealistic achievements  
- Return TEXT ONLY (no JSON)

Original Resume:
${resumeText}

AI Analysis Suggested Improvements:
${JSON.stringify(analysis.suggestedImprovements)}

Optimized Summary:
${analysis.optimizedSummary}
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};




// =========================================================
// 7️⃣ EXTRACT TEXT FROM UPLOADED PDF/IMAGE (Future Feature)
// =========================================================
module.exports.extractTextFromResume = async (fileUrl) => {
  return "PDF-to-text extraction will be added here.";
};