const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate SOP
router.post('/generate-sop', async (req, res) => {
  try {
    const { resumeData, sopDetails } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are an expert academic writer specializing in compelling Statements of Purpose for graduate admissions.

APPLICANT PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${resumeData.personalInfo?.name || 'N/A'}
Professional Summary: ${resumeData.summary || 'N/A'}

Educational Background:
${resumeData.education?.map(edu => `• ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n') || '• N/A'}

Work Experience:
${resumeData.experience?.map(exp => `• ${exp.position} at ${exp.company} (${exp.duration})\n  ${exp.description || 'N/A'}`).join('\n') || '• N/A'}

Technical Skills: ${resumeData.skills?.join(', ') || 'N/A'}

Notable Projects:
${resumeData.projects?.map(proj => `• ${proj.name}: ${proj.description}`).join('\n') || '• N/A'}

TARGET PROGRAM:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
University: ${sopDetails.university}
Program: ${sopDetails.program}
Degree Level: ${sopDetails.degree}
Specialization: ${sopDetails.specialization || 'General'}
Start Date: ${sopDetails.startDate || 'Not specified'}
Research Interests: ${sopDetails.researchInterest || 'To be derived from experience'}
Career Goals: ${sopDetails.careerGoals || 'To be inferred from background'}
Why This Program: ${sopDetails.whyProgram}
Why This University: ${sopDetails.whyUniversity}
Additional Context: ${sopDetails.additionalInfo || 'None'}

TASK: Write an exceptional Statement of Purpose (900-1100 words) following this EXACT structure:

PARAGRAPH 1 - COMPELLING OPENING (120-150 words):
• Start with a captivating hook - a defining moment, challenge, or realization that sparked interest in this field
• Avoid clichés like "Since childhood" or "I have always been passionate"
• Connect this moment to the applicant's current academic/professional trajectory
• End with a clear thesis statement about pursuing this specific program

PARAGRAPH 2 - ACADEMIC FOUNDATION (150-180 words):
• Discuss educational background with specific achievements, coursework, or research
• Highlight GPA, honors, awards, or academic distinctions (if mentioned)
• Connect academic experiences to skills developed and interests formed
• Use concrete examples: "During my coursework in [subject], I developed expertise in [skill]"
• Show intellectual curiosity and depth of understanding

PARAGRAPH 3 - PROFESSIONAL EXPERIENCE & PROJECTS (200-250 words):
• Detail most relevant work experience with QUANTIFIABLE achievements
• Use the STAR method: Situation, Task, Action, Result
• Example: "At [Company], I led [project] which resulted in [specific outcome/metric]"
• Discuss 1-2 key projects that demonstrate technical competency and problem-solving
• Connect professional experience to program goals
• Show progression and increasing responsibility

PARAGRAPH 4 - RESEARCH INTERESTS & PROGRAM FIT (180-220 words):
• Articulate specific research interests aligned with the program
• Mention specific faculty members, labs, or research centers at the university (if applicable)
• Explain why THIS program at THIS university is the perfect fit
• Reference unique courses, resources, or opportunities the program offers
• Show you've done thorough research about the program
• Demonstrate how your background aligns with program strengths

PARAGRAPH 5 - CAREER VISION & GOALS (150-180 words):
• Outline clear, realistic short-term goals (immediately after graduation)
• Describe long-term career aspirations (5-10 years)
• Explain how this program is essential to achieving these goals
• Show ambition balanced with practicality
• Connect goals back to initial motivation and experiences

PARAGRAPH 6 - POWERFUL CONCLUSION (100-120 words):
• Synthesize key themes from the SOP
• Reaffirm commitment and readiness for the program's rigor
• Express genuine enthusiasm without being overly emotional
• End with confidence and forward-looking perspective
• Leave a memorable final impression

CRITICAL WRITING GUIDELINES:
✓ Use sophisticated, varied sentence structures (mix simple, compound, complex)
✓ Employ strong action verbs: developed, spearheaded, engineered, analyzed, pioneered
✓ Include specific examples and quantifiable achievements wherever possible
✓ Maintain formal academic tone while showing personality and passion
✓ Use transition phrases for smooth flow: "Building on this foundation...", "This experience reinforced...", "Consequently..."
✓ Avoid repetition - each paragraph should add new information
✓ Show, don't tell: Instead of "I am passionate", demonstrate it through actions and achievements
✓ Be authentic and personal while remaining professional
✓ Proofread for clarity, concision, and impact

✗ AVOID:
✗ Generic statements that could apply to any applicant
✗ Excessive humility or arrogance
✗ Listing information without context or reflection
✗ Grammatical errors or awkward phrasing
✗ Overly casual language or contractions
✗ Negative statements about past experiences
✗ Unsubstantiated claims without evidence

OUTPUT FORMAT: Return ONLY the Statement of Purpose text as clean, well-formatted paragraphs. No titles, no markdown formatting, no "Dear Admissions Committee". Just the body paragraphs flowing naturally from introduction to conclusion.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sopContent = response.text();

    res.json({
      success: true,
      sopContent: sopContent.trim()
    });

  } catch (error) {
    console.error('SOP generation error:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to generate SOP',
      details: error.message
    });
  }
});

// Generate Cover Letter
router.post('/generate-cover-letter', async (req, res) => {
  try {
    const { resumeData, jobDetails } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are an expert career coach and professional writer specializing in compelling cover letters that get interviews.

CANDIDATE PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${resumeData.personalInfo?.name || 'N/A'}
Email: ${resumeData.personalInfo?.email || 'N/A'}
Phone: ${resumeData.personalInfo?.phone || 'N/A'}
Professional Summary: ${resumeData.summary || 'N/A'}

Educational Background:
${resumeData.education?.map(edu => `• ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n') || '• N/A'}

Work Experience:
${resumeData.experience?.map(exp => `• ${exp.position} at ${exp.company} (${exp.duration})\n  ${exp.description || 'N/A'}`).join('\n') || '• N/A'}

Technical Skills: ${resumeData.skills?.join(', ') || 'N/A'}

Notable Projects:
${resumeData.projects?.map(proj => `• ${proj.name}: ${proj.description}`).join('\n') || '• N/A'}

TARGET POSITION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Company: ${jobDetails.company}
Position: ${jobDetails.position}
Department: ${jobDetails.department || 'Not specified'}
Job Type: ${jobDetails.jobType || 'Not specified'}
Application Source: ${jobDetails.applicationSource || 'Not specified'}
Availability: ${jobDetails.availabilityDate || 'Flexible'}
Salary Expectation: ${jobDetails.salaryExpectation || 'Negotiable'}
Key Requirements: ${jobDetails.keyRequirements}
Why This Company: ${jobDetails.whyCompany}
Why This Role: ${jobDetails.whyRole}
Additional Context: ${jobDetails.additionalInfo || 'None'}

TASK: Write an exceptional cover letter (450-550 words) following this EXACT structure:

OPENING SALUTATION:
• Use "Dear Hiring Manager," or "Dear [Department] Team," (professional and safe)
• If specific hiring manager name is known, use it

PARAGRAPH 1 - POWERFUL OPENING (80-100 words):
• Start with an attention-grabbing first sentence that shows genuine interest
• Mention the specific position title and how you discovered it (if provided in application source)
• Include a compelling "hook" - a relevant achievement, shared value, or unique qualification
• Example: "When I learned that [Company] is seeking a [Position], I was immediately drawn to the opportunity to contribute my [X years] of experience in [field] to a company renowned for [specific achievement/value]."
• Show you've researched the company - reference recent news, products, or initiatives
• Establish credibility immediately

PARAGRAPH 2 - RELEVANT EXPERIENCE & ACHIEVEMENTS (150-180 words):
• Focus on 2-3 most relevant experiences that directly match job requirements
• Use QUANTIFIABLE achievements with metrics, percentages, or specific outcomes
• Structure: "In my role as [Position] at [Company], I [action verb] [what you did], resulting in [specific measurable outcome]"
• Example: "At XYZ Corp, I spearheaded a team of 5 developers to launch a mobile app that achieved 50,000+ downloads in the first month and increased user engagement by 35%"
• Connect each achievement to how it prepares you for THIS specific role
• Use strong action verbs: spearheaded, engineered, optimized, transformed, delivered
• Show progression and increasing responsibility

PARAGRAPH 3 - SKILLS ALIGNMENT & VALUE PROPOSITION (120-150 words):
• Directly address the key requirements mentioned in the job details
• Match your technical skills and soft skills to what they're seeking
• Explain your unique value proposition - what sets you apart from other candidates
• Reference specific projects or experiences that demonstrate required competencies
• Show cultural fit by aligning with company values or mission (based on "Why This Company")
• Example: "My expertise in [specific skills] combined with my passion for [relevant area] aligns perfectly with your team's focus on [company initiative]"

PARAGRAPH 4 - ENTHUSIASM & CLOSING (100-120 words):
• Express genuine enthusiasm for the role and company (use "Why This Role" and "Why This Company")
• Mention availability if provided (e.g., "I am available to start immediately" or specific date)
• Address salary expectations ONLY if explicitly provided and appropriate
• Include a confident call to action: "I would welcome the opportunity to discuss how my background in [area] can contribute to [specific company goal]"
• Thank them for their consideration
• Express eagerness for next steps: "I look forward to the possibility of discussing this exciting opportunity with you"

PROFESSIONAL CLOSING:
• Use "Sincerely," or "Best regards,"
• Include candidate's full name

CRITICAL WRITING GUIDELINES:
✓ Tailor every sentence to THIS specific job and company - avoid generic statements
✓ Use confident, assertive language without arrogance
✓ Employ varied sentence structures for engaging readability
✓ Include specific numbers, metrics, and quantifiable achievements
✓ Show personality while maintaining professionalism
✓ Use industry-specific terminology relevant to the position
✓ Demonstrate knowledge of the company's products, services, or recent achievements
✓ Mirror keywords from the job requirements naturally
✓ Use active voice throughout
✓ Create smooth transitions between paragraphs

✗ AVOID:
✗ Starting with "I am writing to apply for..." (too generic)
✗ Repeating resume content without adding context or achievements
✗ Excessive humility: "I think I might be qualified..."
✗ Desperation: "I really need this job..."
✗ Negative language about current/past employers
✗ Typos, grammatical errors, or awkward phrasing
✗ Overly long paragraphs (keep to 4-6 sentences max)
✗ Generic praise: "Your company is great..."
✗ Discussing salary unless specifically requested
✗ Using clichés: "team player," "hard worker," "think outside the box"

OUTPUT FORMAT: Return the complete cover letter including salutation, body paragraphs, closing, and signature. Format as a professional business letter with proper spacing between paragraphs.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const coverContent = response.text();

    res.json({
      success: true,
      coverContent: coverContent.trim()
    });

  } catch (error) {
    console.error('Cover letter generation error:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to generate cover letter',
      details: error.message
    });
  }
});

module.exports = router;