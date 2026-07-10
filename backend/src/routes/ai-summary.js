const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI (free tier: 60 req/min, 1M tokens/day)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to call Gemini and parse JSON response
async function callGemini(prompt, temperature = 0.7) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { temperature }
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text;
}

// Helper function to extract JSON from response
function extractJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return null;
  }
}

// Generate summary options based on job title and description
router.post('/generate-summaries', async (req, res) => {
  console.log('🚀 Generate summaries request received');
  console.log('📝 Request body:', req.body);

  try {
    const { jobTitle, jobDescription } = req.body;
    console.log('🎯 Job Title:', jobTitle);
    console.log('📋 Job Description length:', jobDescription?.length);

    if (!jobTitle || !jobDescription) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Job title and description are required' });
    }

    const prompt = `Generate 5-6 professional resume summary options for a ${jobTitle} position. 

Job Description: ${jobDescription}

Requirements:
- Each summary should be 2-3 sentences
- Tailor to the specific job requirements
- Use action words and quantifiable achievements where possible
- Make each option unique in tone and focus
- Return ONLY valid JSON, no other text

Output format (strict JSON):
{"summaries": [{"text": "summary 1"}, {"text": "summary 2"}, ...]}`;

    console.log('🤖 Sending request to Gemini...');
    console.log('📤 Prompt length:', prompt.length);

    const content = await callGemini(prompt, 0.7);
    console.log('✅ Gemini response received');
    console.log('📥 Raw response:', content);

    const result = extractJSON(content);
    console.log('🔍 JSON parsed:', !!result);

    if (!result || !result.summaries) {
      console.log('❌ No valid JSON found in response');
      throw new Error('Invalid response format');
    }

    console.log('📊 Number of summaries:', result.summaries?.length);
    res.json(result);

  } catch (error) {
    console.error('❌ Generate summaries error:', error.message);
    console.error('🔍 Full error:', error);
    res.status(500).json({ error: 'Failed to generate summaries', details: error.message });
  }
});

// Generate relevant skills based on job context
router.post('/generate-skills', async (req, res) => {
  console.log('🎯 Generate skills request received');
  console.log('📝 Request body:', req.body);

  try {
    const { jobTitle, jobDescription } = req.body;
    console.log('🎯 Job Title:', jobTitle);
    console.log('📋 Job Description provided:', !!jobDescription);

    if (!jobTitle) {
      console.log('❌ Missing job title');
      return res.status(400).json({ error: 'Job title is required' });
    }

    const prompt = `Generate relevant skills for a ${jobTitle} position based on this job description:

${jobDescription || 'General ' + jobTitle + ' role'}

Requirements:
- Categorize skills into Technical Skills, Soft Skills, and Tools/Technologies
- Provide 6-8 skills per category that are most relevant
- Focus on skills mentioned in job description or commonly required
- Return ONLY valid JSON, no other text

Output format (strict JSON):
{
  "Technical Skills": ["skill1", "skill2", ...],
  "Soft Skills": ["skill1", "skill2", ...],
  "Tools/Technologies": ["tool1", "tool2", ...]
}`;

    console.log('🤖 Sending skills request to Gemini...');

    const content = await callGemini(prompt, 0.6);
    console.log('✅ Gemini skills response received');
    console.log('📥 Raw response:', content);

    const result = extractJSON(content);

    if (!result) {
      console.log('❌ No JSON found in skills response');
      throw new Error('Invalid response format');
    }

    console.log('✅ Parsed skills result:', result);
    res.json({ skills: result });

  } catch (error) {
    console.error('❌ Generate skills error:', error.message);
    console.error('🔍 Full error:', error);
    res.status(500).json({ error: 'Failed to generate skills', details: error.message });
  }
});

// Enhance existing summary
router.post('/enhance-summary', async (req, res) => {
  console.log('✨ Enhance summary request received');
  console.log('📝 Request body:', req.body);

  try {
    const { summary, jobTitle, jobDescription } = req.body;
    console.log('📝 Original summary:', summary);
    console.log('🎯 Job Title:', jobTitle);
    console.log('📋 Job Description provided:', !!jobDescription);

    if (!summary) {
      console.log('❌ Missing summary');
      return res.status(400).json({ error: 'Summary is required' });
    }

    const prompt = `Enhance this resume summary to make it more professional and impactful:

Original Summary: "${summary}"

${jobTitle ? `Job Title: ${jobTitle}` : ''}
${jobDescription ? `Job Context: ${jobDescription}` : ''}

Requirements:
- Improve clarity and impact
- Add relevant keywords if missing
- Ensure proper grammar and flow
- Keep it concise (2-3 sentences)
- Make it more compelling to recruiters

Return ONLY the enhanced summary text, no additional formatting or explanation.`;

    console.log('🤖 Sending enhance request to Gemini...');

    const enhancedSummary = await callGemini(prompt, 0.5);
    console.log('✅ Gemini enhance response received');
    console.log('✨ Enhanced summary:', enhancedSummary.trim());

    res.json({ enhancedSummary: enhancedSummary.trim() });

  } catch (error) {
    console.error('❌ Enhance summary error:', error.message);
    console.error('🔍 Full error:', error);
    res.status(500).json({ error: 'Failed to enhance summary', details: error.message });
  }
});

// Enhance existing skills content
router.post('/enhance-skills', async (req, res) => {
  console.log('✨ Enhance skills request received');
  console.log('📝 Request body:', req.body);

  try {
    const { skillsContent, jobTitle, jobDescription, enhancementDescription } = req.body;
    console.log('📝 Original skills:', skillsContent);
    console.log('🎯 Job Title:', jobTitle);
    console.log('📝 Enhancement description:', enhancementDescription);

    if (!skillsContent) {
      console.log('❌ Missing skills content');
      return res.status(400).json({ error: 'Skills content is required' });
    }

    const prompt = `Enhance and improve this skills section for a ${jobTitle || 'professional'} resume:

Current Skills:
${skillsContent}

${jobTitle ? `Job Title: ${jobTitle}` : ''}
${jobDescription ? `Job Context: ${jobDescription}` : ''}
${enhancementDescription ? `User Instructions: ${enhancementDescription}` : ''}

Requirements:
- Improve skill descriptions and organization
- Add relevant technical keywords if missing
- Ensure proper categorization
- Make skills more impactful and specific
- Keep the same format but enhance content
- Focus on skills relevant to the target role
- Return ONLY plain text, no HTML entities, no markdown formatting, no special characters
- Use simple line breaks and colons for formatting
${enhancementDescription ? `- Follow the user's specific instructions: ${enhancementDescription}` : ''}

Return the enhanced skills content in plain text format only.`;

    console.log('🤖 Sending enhance skills request to Gemini...');

    let enhancedSkills = await callGemini(prompt, 0.5);
    console.log('✅ Gemini enhance skills response received');

    // Clean up HTML entities and markdown formatting
    enhancedSkills = enhancedSkills
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/- \*\*(.*?)\*\*:/g, '$1:')
      .replace(/^- /gm, '')
      .trim();

    console.log('✨ Enhanced skills (cleaned):', enhancedSkills);
    res.json({ enhancedSkills });

  } catch (error) {
    console.error('❌ Enhance skills error:', error.message);
    console.error('🔍 Full error:', error);
    res.status(500).json({ error: 'Failed to enhance skills', details: error.message });
  }
});

// Generate experience description points
router.post('/generate-experience', async (req, res) => {
  console.log('💼 Generate experience request received');
  console.log('📝 Request body:', req.body);

  try {
    const { jobTitle, employer, startMonth, startYear, endMonth, endYear, currentlyWorkHere, targetJobTitle, targetJobDescription, existingDescription } = req.body;
    console.log('🎯 Experience Job Title:', jobTitle);
    console.log('🏢 Employer:', employer);
    console.log('📝 Target Job Title:', targetJobTitle);

    if (!jobTitle || !employer) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Job title and employer are required' });
    }

    if (!targetJobTitle) {
      console.log('❌ Missing target job context');
      return res.status(400).json({ error: 'Please complete the summary section first to provide job context' });
    }

    const duration = currentlyWorkHere ? 'Present' : `${startMonth} ${startYear} - ${endMonth} ${endYear}`;

    const prompt = `Generate 2-3 ATS-friendly bullet points for this work experience:

Role: ${jobTitle} at ${employer}
Duration: ${duration}
Target Role: ${targetJobTitle}
${targetJobDescription ? `Target Job Description: ${targetJobDescription}` : ''}
${existingDescription ? `Existing Description (avoid repeating): ${existingDescription}` : ''}

Requirements:
- Create 2-3 bullet points that highlight achievements and responsibilities
- Use action verbs and quantifiable results where possible
- Tailor content to be relevant for the target ${targetJobTitle} role
- Make it ATS-friendly with relevant keywords
- Each point should be 1-2 lines maximum
- Focus on impact and results, not just duties
- Avoid repeating any existing content
- Return as plain text, one bullet point per line
- Start each line with a strong action verb

Return only the bullet points, no additional text or formatting.`;

    console.log('🤖 Sending experience request to Gemini...');

    let experiencePoints = await callGemini(prompt, 0.7);
    console.log('✅ Gemini experience response received');

    // Clean up the response
    experiencePoints = experiencePoints
      .replace(/^[•\-\*]\s*/gm, '')
      .replace(/^\d+\.\s*/gm, '')
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim())
      .join('\n');

    console.log('💼 Generated experience points:', experiencePoints);
    res.json({ experienceDescription: experiencePoints });

  } catch (error) {
    console.error('❌ Generate experience error:', error.message);
    console.error('🔍 Full error:', error);
    res.status(500).json({ error: 'Failed to generate experience description', details: error.message });
  }
});

// Generate project description points
router.post('/generate-project', async (req, res) => {
  console.log('💻 Generate project request received');
  console.log('📝 Request body:', req.body);

  try {
    const { projectName, projectRole, projectLink, startMonth, startYear, endMonth, endYear, currentProject, targetJobTitle, targetJobDescription, existingDescription } = req.body;
    console.log('💻 Project Name:', projectName);
    console.log('👥 Project Role:', projectRole);
    console.log('🎯 Target Job Title:', targetJobTitle);

    if (!projectName || !projectRole) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Project name and role are required' });
    }

    if (!targetJobTitle) {
      console.log('❌ Missing target job context');
      return res.status(400).json({ error: 'Please complete the summary section first to provide job context' });
    }

    const duration = currentProject ? 'Present' : `${startMonth} ${startYear} - ${endMonth} ${endYear}`;

    const prompt = `Generate 2-3 ATS-friendly bullet points for this project experience:

Project: ${projectName}
Role: ${projectRole}
Duration: ${duration}
${projectLink ? `Link: ${projectLink}` : ''}
Target Role: ${targetJobTitle}
${targetJobDescription ? `Target Job Description: ${targetJobDescription}` : ''}
${existingDescription ? `Existing Description (avoid repeating): ${existingDescription}` : ''}

Requirements:
- Analyze the project name "${projectName}" and infer specific technologies, frameworks, or domain keywords
- Use project-specific terminology and technical stack based on the project name
- If it's an e-commerce project, mention payment systems, inventory, user authentication
- If it's a social media project, mention real-time features, user engagement, content management
- If it's a data/analytics project, mention data processing, visualization, machine learning
- If it's a mobile app, mention platform-specific technologies, app store optimization
- Include specific technical keywords that would be relevant to this type of project
- Focus on technologies and skills that someone working on "${projectName}" would actually use
- Avoid generic statements - be specific to the project domain and type
- Use quantifiable results where possible (performance improvements, user metrics, etc.)
- Make it relevant for the target ${targetJobTitle} role
- Each point should be 1-2 lines maximum
- Start each line with a strong action verb
- Avoid repeating any existing content

Return only the bullet points, no additional text or formatting.`;

    console.log('🤖 Sending project request to Gemini...');

    let projectPoints = await callGemini(prompt, 0.7);
    console.log('✅ Gemini project response received');

    // Clean up the response
    projectPoints = projectPoints
      .replace(/^[•\-\*]\s*/gm, '')
      .replace(/^\d+\.\s*/gm, '')
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim())
      .join('\n');

    console.log('💻 Generated project points:', projectPoints);
    res.json({ projectDescription: projectPoints });

  } catch (error) {
    console.error('❌ Generate project error:', error.message);
    console.error('🔍 Full error:', error);
    res.status(500).json({ error: 'Failed to generate project description', details: error.message });
  }
});

// Generate education suggestions
router.post('/generate-education-suggestions', async (req, res) => {
  console.log('🎓 Generate education suggestions request received');
  console.log('📝 Request body:', req.body);

  try {
    const { degree, fieldOfStudy, schoolName, gpa, targetJobTitle, targetJobDescription } = req.body;
    console.log('🎓 Education:', { degree, fieldOfStudy, schoolName, gpa });
    console.log('🎯 Target Job Title:', targetJobTitle);

    if (!degree || !fieldOfStudy || !targetJobTitle) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Degree, field of study, and target job title are required' });
    }

    const prompt = `Generate 5-6 relevant education detail suggestions for someone with this background applying for a ${targetJobTitle} role:

Education Background:
- Degree: ${degree}
- Field of Study: ${fieldOfStudy}
${schoolName ? `- Institution: ${schoolName}` : ''}
${gpa ? `- GPA: ${gpa}` : ''}

Target Role: ${targetJobTitle}
${targetJobDescription ? `Target Job Description: ${targetJobDescription}` : ''}

Requirements:
- Generate specific, relevant education details that would be valuable for the target role
- Include relevant coursework, projects, research, or academic achievements
- Focus on aspects that align with the ${targetJobTitle} position requirements
- Make suggestions specific to the ${fieldOfStudy} field
- Include honors, scholarships, or academic recognition if relevant
- Mention relevant extracurricular activities or leadership roles
- Keep each suggestion concise (1-2 lines)
- Make them actionable and specific to this education background

Return suggestions one per line, like:
Relevant Coursework: Data Structures, Algorithms, Database Systems
Capstone Project: Developed a machine learning model for...
Dean's List: Fall 2022, Spring 2023`;

    console.log('🤖 Sending education suggestions request to Gemini...');

    const suggestionsText = await callGemini(prompt, 0.6);
    console.log('✅ Gemini education suggestions response received');

    // Parse suggestions from response
    const suggestions = suggestionsText
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim())
      .slice(0, 6);

    console.log('🎓 Generated education suggestions:', suggestions);
    res.json({ suggestions });

  } catch (error) {
    console.error('❌ Generate education suggestions error:', error.message);
    console.error('🔍 Full error:', error);
    res.status(500).json({ error: 'Failed to generate education suggestions', details: error.message });
  }
});

module.exports = router;