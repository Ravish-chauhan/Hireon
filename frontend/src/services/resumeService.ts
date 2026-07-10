import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

export interface ResumeDraft {
  id?: string
  userId: string
  name: string
  template: string
  data: any
  createdAt?: string
  updatedAt?: string
}

const resumeService = {
  // Save or update a resume draft
  saveDraft: async (draft: ResumeDraft): Promise<ResumeDraft> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/resumes/drafts`, draft)
      return response.data
    } catch (error) {
      console.error('Error saving draft:', error)
      throw error
    }
  },

  // Get all drafts for a user
  getDrafts: async (userId: string): Promise<ResumeDraft[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resumes/drafts/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching drafts:', error)
      throw error
    }
  },

  // Get a specific draft by ID
  getDraft: async (draftId: string): Promise<ResumeDraft> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resumes/drafts/single/${draftId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching draft:', error)
      throw error
    }
  },

  // Delete a draft
  deleteDraft: async (draftId: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/resumes/drafts/${draftId}`)
    } catch (error) {
      console.error('Error deleting draft:', error)
      throw error
    }
  },

  // Get resume templates
  getTemplates: async (): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resumes/templates`)
      return response.data
    } catch (error) {
      console.error('Error fetching templates:', error)
      // Return mock data as fallback
      return [
        { id: 1, name: 'Professional', preview: '/template1.jpg' },
        { id: 2, name: 'Modern', preview: '/template2.jpg' },
        { id: 3, name: 'Creative', preview: '/template3.jpg' },
        { id: 4, name: 'Executive', preview: '/template4.jpg' },
        { id: 5, name: 'Minimalist', preview: '/template5.jpg' },
        { id: 6, name: 'Classic', preview: '/template6.jpg' }
      ]
    }
  }
}

export default resumeService
export { resumeService }