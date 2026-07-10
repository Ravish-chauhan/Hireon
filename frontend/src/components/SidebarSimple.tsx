import React from 'react'
import { FileTextIcon } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="w-20 min-h-screen bg-[#2C3E5F] flex flex-col items-center pt-8">
      <div className="w-10 h-12 flex items-center justify-center">
        <FileTextIcon className="w-8 h-10 text-white" strokeWidth={1.5} />
      </div>
    </aside>
  )
}