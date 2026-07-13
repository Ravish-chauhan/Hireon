const express = require('express');
const axios = require('axios');
const router = express.Router();
const { uploadResume } = require("../middleware/multer");
const { extractTextFromPDF } = require("../../services/pdfExtractor");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// AI Resume Enhancement Endpoint
router.post('/enhance-resume', async (req, res) => {
  try {
    const { prompt, currentResumeData } = req.body;
    
    console.log('🤖 AI Enhancement Request:', prompt);
    
    // Build context from current resume data
    const resumeContext = {
      template: currentResumeData.template?.name || 'Unknown Template',
      currentText: currentResumeData.editableNodes || {},
      resumeData: currentResumeData.resumeData?.data || {}
    };
    
    const enhancementPrompt = `You are an expert resume writer and ATS optimization specialist. 
    
CURRENT RESUME CONTEXT:
Template: ${resumeContext.template}
Current Text Content: ${JSON.stringify(resumeContext.currentText, null, 2)}
Resume Data: ${JSON.stringify(resumeContext.resumeData, null, 2)}

USER REQUEST: "${prompt}"

TASK: Based on the user's request, provide specific improvements to the resume content. 

RESPONSE FORMAT (JSON only):
{
  "message": "Brief explanation of changes made",
  "updatedNodes": {
    "nodeId1": "improved text content",
    "nodeId2": "enhanced text content"
  },
  "suggestions": ["suggestion1", "suggestion2"]
}

GUIDELINES:
- Make text ATS-friendly with relevant keywords
- Keep content professional and impactful
- Maintain original formatting and length constraints
- Focus on quantifiable achievements
- Use action verbs and industry-specific terms
- Only modify text that relates to the user's request`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: enhancementPrompt
          }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Clean and parse JSON response
    let cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
    cleanContent = cleanContent.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    
    let aiResponse;
    try {
      aiResponse = JSON.parse(cleanContent);
    } catch (parseError) {
      // Fallback response
      aiResponse = {
        message: "I've analyzed your request. Here are some general improvements you can make to enhance your resume.",
        updatedNodes: {},
        suggestions: [
          "Add quantifiable achievements with numbers and percentages",
          "Use strong action verbs to start bullet points",
          "Include relevant keywords for ATS optimization",
          "Tailor content to match job requirements"
        ]
      };
    }
    
    console.log('✅ AI Enhancement completed');
    res.json(aiResponse);
    
  } catch (error) {
    console.error('❌ AI Enhancement Error:', error.response?.data || error.message);
    res.status(500).json({
      message: "I'm having trouble processing your request right now. Please try again.",
      updatedNodes: {},
      suggestions: ["Try rephrasing your request", "Check your internet connection"]
    });
  }
});

// AI Resume Parsing Endpoint
router.post('/parse-resume', uploadResume.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file missing" });
    }

    const fileUrl = req.file.path;
    console.log('📄 Extracting text from PDF...', fileUrl);
    
    // Extract text
    const extractedText = await extractTextFromPDF(fileUrl);
    if (!extractedText) {
      return res.status(400).json({ error: "Text extraction failed or PDF is empty" });
    }

    console.log('🤖 Parsing extracted text with AI...');
    
    const parsingPrompt = `You are an expert resume parser. Extract the information from the following resume text and map it STRICTLY to the provided JSON schema. 
If information for a field is missing, leave it as an empty string "" or empty array []. Do not add any new fields not present in the schema (except for the keys inside the "skills" object, which must use the actual category names found in the resume).

RESUME TEXT:
"""
${extractedText.substring(0, 8000)}
"""

JSON SCHEMA TO RETURN (Return ONLY valid JSON):
{
  "bio": {
    "firstName": "", "surname": "", "city": "", "country": "",
    "phone": "", "email": "", "linkedin": "", "github": "", "website": ""
  },
  "summary": { "jobTitle": "The person's main title", "content": "Professional summary" },
  "experience": [{
    "id": "exp-1", "jobTitle": "", "employer": "", "city": "", "country": "", 
    "startMonth": "", "startYear": "", "endMonth": "", "endYear": "", 
    "currentlyWorkHere": false, "description": "Bullet points joined by newlines"
  }],
  "education": [{
    "id": "edu-1", "schoolName": "", "schoolLocation": "", "degree": "", "fieldOfStudy": "", 
    "startMonth": "", "startYear": "", "gradMonth": "", "gradYear": "", "gpa": ""
  }],
  "skills": {
    "Extract category name from resume (e.g., Languages, Frameworks)": ["skill1", "skill2"],
    "Extract another category (e.g., Tools, Soft Skills)": ["skill3", "skill4"]
  },
  "projects": [{
    "id": "proj-1", "projectName": "", "projectRole": "", 
    "startMonth": "", "startYear": "", "endMonth": "", "endYear": "", 
    "currentProject": false, "description": "Description of project"
  }]
}
`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume parser. Always respond with valid JSON only, exactly matching the provided schema.'
          },
          {
            role: 'user',
            content: parsingPrompt
          }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    let cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, cleanContent);
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }

    console.log('✅ AI Resume Parsing completed');
    res.json({ success: true, data: parsedData });
    
  } catch (error) {
    console.error('❌ Resume Parsing Error:', error.response?.data || error.message);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});

module.exports = router;