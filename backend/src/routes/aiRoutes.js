const express = require('express');
const axios = require('axios');
const router = express.Router();

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

module.exports = router;