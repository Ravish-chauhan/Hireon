const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Extract sections and headings from template structure
function extractTemplateSections(template) {
  const sections = new Set();
  
  function traverseNodes(node) {
    if (node.type === 'TEXT' && node.name) {
      const name = node.name.toLowerCase();
      if (name.includes('heading') || name.includes('title') || name.includes('section')) {
        sections.add(node.name);
      }
      // Common section keywords
      ['experience', 'education', 'skills', 'projects', 'achievements', 'summary', 'objective', 'certifications', 'awards'].forEach(keyword => {
        if (name.includes(keyword)) sections.add(keyword);
      });
    }
    if (node.children) {
      node.children.forEach(traverseNodes);
    }
  }
  
  if (template.structure) traverseNodes(template.structure);
  return Array.from(sections);
}

// Enhanced AI resume generation using Grok
async function enhanceResumeWithGrok(resumeData, template, aiPrompt) {
  try {
    console.log('🤖 Starting Grok AI enhancement...');
    
    // Extract template sections and headings
    const templateSections = extractTemplateSections(template);
    console.log('📋 Template sections found:', templateSections);
    
    const enhancementPrompt = `PRESERVE TEMPLATE STRUCTURE - ONLY CHANGE TEXT:
Template sections: ${JSON.stringify(templateSections)}
User data: ${JSON.stringify(resumeData, null, 2)}

IMPORTANT: The template's visual design, colors, images, and layout must remain EXACTLY the same.
Only replace text content with user's information.

TASK: Generate professional text content for ${resumeData.aiJobTitle || 'Professional'} role.

GUIDELINES:
- Keep text concise and professional
- Match the tone of the original template
- Preserve text length similar to original placeholders
- Don't change any visual elements

Return JSON with enhanced text content:
{
  "basicInfo": ${JSON.stringify(resumeData.basicInfo)},
  "templateMapping": {
    ${templateSections.map(section => `"${section}": "Professional content for ${section}"`).join(',\n    ')}
  },
  "sections": {
    "summary": "Professional summary matching user's background",
    "experience": [{"company": "", "position": "", "bullets": ["achievement1", "achievement2"]}],
    "education": [{"degree": "", "institution": "", "year": ""}],
    "skills": ["relevant skills from user data"],
    "projects": [{"name": "", "description": ""}],
    "achievements": ["key achievements"],
    "certifications": ["relevant certifications"]
  }
}`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer and ATS optimization specialist. You analyze template structures and enhance resume content to be professional, impactful, and ATS-friendly. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: enhancementPrompt
          }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    console.log('📝 Grok response received, length:', content.length);
    
    // Clean and parse JSON response
    let cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
    
    // Additional cleaning for common JSON issues
    cleanContent = cleanContent.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    
    let enhancedData;
    try {
      enhancedData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.warn('⚠️ JSON parse failed, trying to extract valid JSON...');
      // Try to extract JSON from response
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          enhancedData = JSON.parse(jsonMatch[0]);
        } catch (secondError) {
          console.error('❌ Second JSON parse failed, using fallback');
          throw new Error('Invalid JSON response from AI');
        }
      } else {
        throw new Error('No JSON found in AI response');
      }
    }
    
    console.log('✅ Resume enhancement completed');
    return enhancedData;
    
  } catch (error) {
    console.error('❌ Grok AI Enhancement Error:', error.response?.data || error.message);
    
    // Return structured fallback with template mapping
    const templateSections = extractTemplateSections(template);
    const fallbackMapping = {};
    templateSections.forEach(section => {
      fallbackMapping[section] = `Add ${section} details here`;
    });
    
    return {
      ...resumeData,
      templateMapping: fallbackMapping,
      sections: {
        summary: `Experienced ${resumeData.aiJobTitle || 'Professional'} with proven track record.`,
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
        projects: resumeData.projects || [],
        achievements: resumeData.achievements || [],
        certifications: []
      }
    };
  }
}

// Fill Figma template with enhanced resume data while preserving structure
async function fillFigmaTemplateWithData(template, enhancedData) {
  try {
    console.log('🎨 Filling template with data while preserving structure...');
    
    // Deep clone to preserve original template structure completely
    const filledTemplate = JSON.parse(JSON.stringify(template.structure));
    
    // Only modify TEXT nodes, preserve all visual elements
    function fillTextNodes(node) {
      // PRESERVE: Skip all non-text elements (images, shapes, colors, layouts)
      if (node.type !== 'TEXT') {
        // Recursively process children but don't modify the node itself
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(fillTextNodes);
        }
        return; // Keep original node unchanged
      }
      
      // Only modify text content, preserve all styling
      const nodeName = (node.name || '').toLowerCase();
      const originalText = node.characters || node.text || '';
      let newText = originalText;
      
      // Smart text replacement based on content context
      if (enhancedData.templateMapping) {
        for (const [section, content] of Object.entries(enhancedData.templateMapping)) {
          if (nodeName.includes(section.toLowerCase())) {
            newText = typeof content === 'string' ? content : String(content);
            break;
          }
        }
      }
      
      // Fallback mapping for common fields
      if (newText === originalText) {
        if (nodeName.includes('name') && !nodeName.includes('company')) {
          newText = enhancedData.basicInfo?.fullName || originalText;
        } else if (nodeName.includes('email')) {
          newText = enhancedData.basicInfo?.email || originalText;
        } else if (nodeName.includes('phone')) {
          newText = enhancedData.basicInfo?.phone || originalText;
        } else if (nodeName.includes('location') || nodeName.includes('address')) {
          newText = enhancedData.basicInfo?.location || originalText;
        } else if (nodeName.includes('summary') || nodeName.includes('objective')) {
          newText = enhancedData.sections?.summary || originalText;
        } else if (nodeName.includes('skill') && enhancedData.sections?.skills) {
          newText = Array.isArray(enhancedData.sections.skills) 
            ? enhancedData.sections.skills.join(' • ') 
            : originalText;
        }
      }
      
      // PRESERVE: Keep original formatting and styling
      node.characters = newText;
      if (node.text !== undefined) node.text = newText;
      
      // PRESERVE: Don't modify any style properties
      // Keep original fontSize, fontFamily, color, etc.
      
      // Process children while preserving structure
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(fillTextNodes);
      }
    }
    
    fillTextNodes(filledTemplate);
    
    console.log('✅ Template filled with preserved structure');
    return {
      ...template, // Keep all original template properties
      structure: filledTemplate,
      filledData: enhancedData,
      // Preserve original metadata
      preservedStructure: true
    };
    
  } catch (error) {
    console.error('❌ Template Filling Error:', error.message);
    return {
      ...template, // Return completely original template on error
      filledData: enhancedData
    };
  }
}

module.exports = {
  enhanceResumeWithGrok,
  fillFigmaTemplateWithData
};