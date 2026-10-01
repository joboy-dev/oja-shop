'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clsx from 'clsx'
import { Undo2, X } from 'lucide-react'
import { useEffect } from 'react'
import Button from './button/Button'

interface TipTapProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}


const Tiptap = ({ value, onChange, placeholder, className }: TipTapProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: clsx(
          'w-full min-h-[100px] max-h-[400px] border border-border rounded-md p-2',
          'focus:outline-none focus:ring-0 focus:border-primary',
          className
        ),
        placeholder: placeholder || 'Write something...',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Keep editor content in sync with value (for reset, etc.)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])


  return (
    <div className=''>
      <div className='flex items-center flex-wrap'>
        {/* <Button variant='ghost' size='sm' onClick={() => editor?.commands.setContent('')}>
          <X className='w-4 h-4' />
        </Button> */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <b className={editor?.isActive('bold') ? 'text-primary' : ''}>B</b>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <i className={editor?.isActive('italic') ? 'text-primary' : ''}>I</i>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          aria-label="Strike"
        >
          <s className={editor?.isActive('strike') ? 'text-primary' : ''}>S</s>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleCode().run()}
          aria-label="Code"
        >
          <code className={editor?.isActive('code') ? 'text-primary' : ''}>{"<>"}</code>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          aria-label="Blockquote"
        >
          <span className={editor?.isActive('blockquote') ? 'text-primary' : ''}>&quot;</span>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
        >
          <span className={editor?.isActive('bulletList') ? 'text-primary' : ''}>• List</span>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
        >
          <span className={editor?.isActive('orderedList') ? 'text-primary' : ''}>1. List</span>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().setParagraph().run()}
          aria-label="Paragraph"
        >
          <span className={editor?.isActive('paragraph') ? 'text-primary' : ''}>¶</span>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Heading 1"
        >
          <span className={editor?.isActive('heading', { level: 1 }) ? 'text-primary' : ''}>H1</span>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
        >
          <span className={editor?.isActive('heading', { level: 2 }) ? 'text-primary' : ''}>H2</span>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Heading 3"
        >
          <span className={editor?.isActive('heading', { level: 3 }) ? 'text-primary' : ''}>H3</span>
        </Button>
        
      </div>
      <EditorContent 
        editor={editor} 
      />
    </div>
  )
}

export default Tiptap