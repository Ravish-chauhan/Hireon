import React, { useRef, useCallback, useState, useEffect } from 'react'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListIcon,
  TypeIcon,
  Undo2Icon,
  Redo2Icon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

type FormatButton = {
  icon: React.ReactNode
  command: string
  label: string
  value?: string
  isActive?: () => boolean
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = '200px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  const [isEmpty, setIsEmpty] = useState(true)
  const isInitializing = useRef(false)

  // Initialize content
  useEffect(() => {
    if (editorRef.current && !isInitializing.current) {
      isInitializing.current = true
      if (value) {
        editorRef.current.innerHTML = value
        setIsEmpty(false)
      } else {
        editorRef.current.innerHTML = ''
        setIsEmpty(true)
      }
      isInitializing.current = false
    }
  }, [])

  // Sync external value changes
  useEffect(() => {
    if (editorRef.current && !isInitializing.current) {
      const currentHTML = editorRef.current.innerHTML
      if (value !== currentHTML && value !== undefined) {
        isInitializing.current = true
        const selection = window.getSelection()
        const range = selection?.rangeCount ? selection.getRangeAt(0) : null
        editorRef.current.innerHTML = value || ''
        setIsEmpty(!value)
        // Restore cursor position if possible
        if (range && editorRef.current.contains(range.startContainer)) {
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
        isInitializing.current = false
      }
    }
  }, [value])

  // Check active formatting state
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>()
    if (document.queryCommandState('bold')) formats.add('bold')
    if (document.queryCommandState('italic')) formats.add('italic')
    if (document.queryCommandState('underline')) formats.add('underline')
    if (document.queryCommandState('insertUnorderedList')) formats.add('list')
    setActiveFormats(formats)
  }, [])

  // Handle content change
  const handleInput = useCallback(() => {
    if (editorRef.current && !isInitializing.current) {
      const html = editorRef.current.innerHTML
      setIsEmpty(!html || html === '<br>' || html === '<div><br></div>')
      onChange(html)
      updateActiveFormats()
    }
  }, [onChange, updateActiveFormats])

  // Execute formatting command
  const execCommand = useCallback((command: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    handleInput()
    updateActiveFormats()
  }, [handleInput, updateActiveFormats])

  // Handle selection change for active state
  useEffect(() => {
    const handleSelectionChange = () => {
      if (editorRef.current?.contains(document.activeElement)) {
        updateActiveFormats()
      }
    }
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [updateActiveFormats])

  // Format buttons configuration
  const formatButtons: FormatButton[] = [
    { icon: <BoldIcon className="w-4 h-4" />, command: 'bold', label: 'Bold (Ctrl+B)' },
    { icon: <ItalicIcon className="w-4 h-4" />, command: 'italic', label: 'Italic (Ctrl+I)' },
    { icon: <UnderlineIcon className="w-4 h-4" />, command: 'underline', label: 'Underline (Ctrl+U)' },
    { icon: <ListIcon className="w-4 h-4" />, command: 'insertUnorderedList', label: 'Bullet List' },
  ]

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault()
          execCommand('bold')
          break
        case 'i':
          e.preventDefault()
          execCommand('italic')
          break
        case 'u':
          e.preventDefault()
          execCommand('underline')
          break
        case 'z':
          e.preventDefault()
          if (e.shiftKey) {
            execCommand('redo')
          } else {
            execCommand('undo')
          }
          break
      }
    }
  }, [execCommand])

  const buttonBaseClass = `p-2.5 rounded-lg transition-all duration-200 relative group`
  const buttonActiveClass = `bg-blue-100 text-blue-600 shadow-sm`
  const buttonInactiveClass = `text-slate-500 hover:bg-slate-100 hover:text-slate-700`

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 p-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-0.5 pr-3 border-r border-slate-200">
          {formatButtons.map((btn) => {
            const isActive = activeFormats.has(btn.command === 'insertUnorderedList' ? 'list' : btn.command)
            return (
              <button
                key={btn.command}
                onClick={() => execCommand(btn.command, btn.value)}
                className={`${buttonBaseClass} ${isActive ? buttonActiveClass : buttonInactiveClass}`}
                title={btn.label}
                type="button"
              >
                {btn.icon}
                {/* Tooltip */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {btn.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Text alignment group */}
        <div className="flex items-center gap-0.5 px-3 border-r border-slate-200">
          <button
            onClick={() => execCommand('justifyLeft')}
            className={`${buttonBaseClass} ${buttonInactiveClass}`}
            title="Align Left"
            type="button"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand('justifyCenter')}
            className={`${buttonBaseClass} ${buttonInactiveClass}`}
            title="Align Center"
            type="button"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand('justifyRight')}
            className={`${buttonBaseClass} ${buttonInactiveClass}`}
            title="Align Right"
            type="button"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Font size */}
        <div className="px-3 border-r border-slate-200">
          <select
            onChange={(e) => execCommand('fontSize', e.target.value)}
            className="text-sm bg-transparent border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer"
            defaultValue="3"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => execCommand('undo')}
            className={`${buttonBaseClass} ${buttonInactiveClass}`}
            title="Undo (Ctrl+Z)"
            type="button"
          >
            <Undo2Icon className="w-4 h-4" />
          </button>
          <button
            onClick={() => execCommand('redo')}
            className={`${buttonBaseClass} ${buttonInactiveClass}`}
            title="Redo (Ctrl+Shift+Z)"
            type="button"
          >
            <Redo2Icon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={updateActiveFormats}
          onBlur={() => setActiveFormats(new Set())}
          className={`w-full h-full p-4 outline-none text-slate-700 text-sm leading-relaxed overflow-y-auto
            [&:focus]:ring-0 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5
            ${isEmpty ? 'before:content-[attr(data-placeholder)] before:text-slate-400 before:absolute before:top-4 before:left-4 before:pointer-events-none' : ''}
          `}
          style={{ minHeight }}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
      </div>

      {/* Character count */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          💡 Pro tip: Use Ctrl+B for bold, Ctrl+I for italic
        </span>
        <span className="text-xs text-slate-400">
          {editorRef.current?.textContent?.length || 0} characters
        </span>
      </div>
    </div>
  )
}

export default RichTextEditor