const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk-your-key-here';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function convertImageToHTML(imageUrl) {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        messages: [
          {
            role: 'system',
            content: 'You are an expert at converting resume images to HTML/CSS. Generate clean, editable HTML with inline styles that exactly matches the visual layout of the resume image.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Convert this resume image to HTML/CSS. Make all text contenteditable. Use inline styles. Return ONLY the HTML code, no explanations.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        model: 'llama-3.2-90b-vision-preview',
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw error;
  }
}

async function generateKeywords(jobTitle, jobDescription = '') {
  try {
    const prompt = `Generate 20 relevant keywords and a professional summary for a ${jobTitle} position.
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Return ONLY a JSON object with this exact format:
{
  "summary": "Professional summary here",
  "keywords": ["keyword1", "keyword2", ...]
}`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Generate relevant keywords and professional summaries for job positions. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    // Clean markdown code blocks if present
    const cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
    return JSON.parse(cleanContent);
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { convertImageToHTML, generateKeywords };