import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileTextIcon, Edit2Icon, TrashIcon, PlusIcon, CalendarIcon } from 'lucide-react'
import { resumeService, ResumeDraft } from '../services/resumeService'

export function SavedDraftsPage() {
  const navigate = useNavigate()
  const [drafts, setDrafts] = useState<ResumeDraft[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDrafts()
  }, [])

  const loadDrafts = async () => {
    try {
      const userId = 'current-user-id'
      const userDrafts = await resumeService.getDrafts(userId)
      setDrafts(userDrafts)
    } catch (error) {
      console.error('Failed to load drafts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditDraft = (draft: ResumeDraft) => {
    navigate(`/resume-form?template=${draft.template}&draft=${draft.id}`)
  }

  const handleDeleteDraft = async (draftId: string) => {
    try {
      await resumeService.deleteDraft(draftId)
      setDrafts(drafts.filter(draft => draft.id !== draftId))
    } catch (error) {
      console.error('Failed to delete draft:', error)
      alert('Failed to delete draft. Please try again.')
    }
  }

  const handleCreateNew = () => {
    navigate('/resume-form')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Resume Drafts</h1>
            <p className="text-lg text-gray-600">Manage and edit your saved resume drafts</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-[#4169FF] text-white rounded-lg font-medium hover:bg-[#3158E8] transition-all shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
            Create New Resume
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4169FF] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading drafts...</p>
          </div>
        ) : drafts.length === 0 ? (
          <div className="text-center py-16">
            <FileTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No drafts saved yet</h3>
            <p className="text-gray-500 mb-6">Create your first resume to get started</p>
            <button
              onClick={handleCreateNew}
              className="px-8 py-3 bg-[#4169FF] text-white rounded-lg font-medium hover:bg-[#3158E8] transition-all"
            >
              Create Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => (
              <div key={draft.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4169FF] rounded-lg flex items-center justify-center">
                      <FileTextIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{draft.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{draft.template.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Last modified: {new Date(draft.updatedAt || draft.createdAt || '').toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditDraft(draft)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4169FF] text-white rounded-lg font-medium hover:bg-[#3158E8] transition-all"
                  >
                    <Edit2Icon className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}