import api from './api';

export interface SummaryOption {
  text: string;
}

export interface GenerateSummariesResponse {
  summaries: SummaryOption[];
}

export interface EnhanceSummaryResponse {
  enhancedSummary: string;
}

export interface GenerateSkillsResponse {
  skills: { [category: string]: string[] };
}

export interface EnhanceSkillsResponse {
  enhancedSkills: string;
}

export interface GenerateExperienceResponse {
  experienceDescription: string;
}

export interface GenerateProjectResponse {
  projectDescription: string;
}

export interface GenerateEducationSuggestionsResponse {
  suggestions: string[];
}

export const aiSummaryService = {
  async generateSummaries(jobTitle: string, jobDescription: string): Promise<GenerateSummariesResponse> {
    console.log('🚀 Frontend: Generating summaries...');
    console.log('🎯 Job Title:', jobTitle);
    console.log('📋 Job Description length:', jobDescription.length);
    
    try {
      const response = await api.post('/ai-summary/generate-summaries', {
        jobTitle,
        jobDescription
      });
      
      console.log('✅ Frontend: Summaries generated successfully');
      console.log('📊 Number of summaries:', response.data.summaries?.length);
      
      return response.data;
    } catch (error) {
      console.error('❌ Frontend: Generate summaries failed:', error);
      throw error;
    }
  },

  async enhanceSummary(summary: string, jobTitle?: string, jobDescription?: string): Promise<EnhanceSummaryResponse> {
    console.log('✨ Frontend: Enhancing summary...');
    console.log('📝 Original summary:', summary);
    console.log('🎯 Job Title:', jobTitle);
    
    try {
      const response = await api.post('/ai-summary/enhance-summary', {
        summary,
        jobTitle,
        jobDescription
      });
      
      console.log('✅ Frontend: Summary enhanced successfully');
      console.log('✨ Enhanced summary:', response.data.enhancedSummary);
      
      return response.data;
    } catch (error) {
      console.error('❌ Frontend: Enhance summary failed:', error);
      throw error;
    }
  },

  async generateSkills(jobTitle: string, jobDescription?: string): Promise<GenerateSkillsResponse> {
    console.log('🎯 Frontend: Generating skills...');
    console.log('🎯 Job Title:', jobTitle);
    console.log('📋 Job Description provided:', !!jobDescription);
    
    try {
      const response = await api.post('/ai-summary/generate-skills', {
        jobTitle,
        jobDescription
      });
      
      console.log('✅ Frontend: Skills generated successfully');
      console.log('📊 Generated skills:', response.data.skills);
      
      return response.data;
    } catch (error) {
      console.error('❌ Frontend: Generate skills failed:', error);
      throw error;
    }
  },

  async enhanceSkills(skillsContent: string, jobTitle?: string, jobDescription?: string, enhancementDescription?: string): Promise<EnhanceSkillsResponse> {
    console.log('✨ Frontend: Enhancing skills...');
    console.log('📝 Original skills content:', skillsContent);
    console.log('🎯 Job Title:', jobTitle);
    console.log('📝 Enhancement description:', enhancementDescription);
    
    try {
      const response = await api.post('/ai-summary/enhance-skills', {
        skillsContent,
        jobTitle,
        jobDescription,
        enhancementDescription
      });
      
      console.log('✅ Frontend: Skills enhanced successfully');
      console.log('✨ Enhanced skills:', response.data.enhancedSkills);
      
      return response.data;
    } catch (error) {
      console.error('❌ Frontend: Enhance skills failed:', error);
      throw error;
    }
  },

  async generateExperience(experienceData: any, targetJobTitle?: string, targetJobDescription?: string): Promise<GenerateExperienceResponse> {
    console.log('💼 Frontend: Generating experience description...');
    console.log('📝 Experience data:', experienceData);
    console.log('🎯 Target job:', targetJobTitle);
    
    try {
      const response = await api.post('/ai-summary/generate-experience', {
        ...experienceData,
        targetJobTitle,
        targetJobDescription
      });
      
      console.log('✅ Frontend: Experience generated successfully');
      console.log('💼 Generated experience:', response.data.experienceDescription);
      
      return response.data;
    } catch (error) {
      console.error('❌ Frontend: Generate experience failed:', error);
      throw error;
    }
  },

  async generateProject(projectData: any, targetJobTitle?: string, targetJobDescription?: string): Promise<GenerateProjectResponse> {
    console.log('💻 Frontend: Generating project description...');
    console.log('📝 Project data:', projectData);
    console.log('🎯 Target job:', targetJobTitle);
    
    try {
      const response = await api.post('/ai-summary/generate-project', {
        ...projectData,
        targetJobTitle,
        targetJobDescription
      });
      
      console.log('✅ Frontend: Project generated successfully');
      console.log('💻 Generated project:', response.data.projectDescription);
      
      return response.data;
    } catch (error) {
      console.error('❌ Frontend: Generate project failed:', error);
      throw error;
    }
  },

  async generateEducationSuggestions(educationData: any, targetJobTitle?: string, targetJobDescription?: string): Promise<GenerateEducationSuggestionsResponse> {
    console.log('🎓 Frontend: Generating education suggestions...');
    console.log('📝 Education data:', educationData);
    console.log('🎯 Target job:', targetJobTitle);
    
    try {
      const response = await api.post('/ai-summary/generate-education-suggestions', {
        ...educationData,
        targetJobTitle,
        targetJobDescription
      });
      
      console.log('✅ Frontend: Education suggestions generated successfully');
      console.log('🎓 Generated suggestions:', response.data.suggestions);
      
      return response.data;
    } catch (error) {
      console.error('❌ Frontend: Generate education suggestions failed:', error);
      throw error;
    }
  }
};