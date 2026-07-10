import React from 'react'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListIcon,
  TypeIcon,
  Undo2Icon,
  Redo2Icon,
} from 'lucide-react'
type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}
export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-1 pb-3 border-b border-gray-200">
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Bold"
        >
          <BoldIcon className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Italic"
        >
          <ItalicIcon className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Underline"
        >
          <UnderlineIcon className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="List"
        >
          <ListIcon className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors relative"
          aria-label="Font size"
        >
          <TypeIcon className="w-4 h-4 text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 text-[8px] text-gray-500 font-medium">
            AB
          </span>
        </button>
        <div className="flex-1" />
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Undo"
        >
          <Undo2Icon className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Redo"
        >
          <Redo2Icon className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 w-full mt-3 resize-none outline-none text-gray-700 text-sm min-h-[200px]"
      />
    </div>
  )
}