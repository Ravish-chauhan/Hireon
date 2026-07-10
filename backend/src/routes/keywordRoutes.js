const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-keywords', async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;

    if (!jobTitle || !jobDescription) {
      return res.status(400).json({ error: 'Job title and description are required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Based on this job title: "${jobTitle}" and job description: "${jobDescription}", generate 15-20 relevant keywords that would be important for a resume. Focus on technical skills, soft skills, industry terms, and key qualifications. Return only the keywords separated by commas, no explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const keywords = text.split(',').map(k => k.trim()).filter(k => k.length > 0);

    res.json({ keywords });
  } catch (error) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ error: 'Failed to generate keywords' });
  }
});

module.exports = router;