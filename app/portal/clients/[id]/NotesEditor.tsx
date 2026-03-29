'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  clientId: string
}

export default function NotesEditor({ clientId }: Props) {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [noteId, setNoteId] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('practitioner_notes')
        .select('*')
        .eq('client_id', clientId)
        .single()
      if (data) {
        setContent(data.content ?? '')
        setNoteId(data.id)
      }
    }
    load()
  }, [clientId])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
    setSaved(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => save(e.target.value), 30000)
  }

  async function save(text = content) {
    setSaving(true)
    if (noteId) {
      await supabase.from('practitioner_notes').update({ content: text }).eq('id', noteId)
    } else {
      const { data } = await supabase
        .from('practitioner_notes')
        .insert({ client_id: clientId, content: text })
        .select()
        .single()
      if (data) setNoteId(data.id)
    }
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#1C1C1A] text-sm">Private notes</h3>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs text-[#6B6B65]">Saving...</span>}
          {saved && !saving && <span className="text-xs text-[#2D4A3E]">Saved</span>}
          <button
            onClick={() => save()}
            className="text-xs bg-[#2D4A3E] text-white px-3 py-1.5 rounded-full hover:bg-[#7A9E8E] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
      <p className="text-xs text-[#6B6B65] mb-4 italic">These notes are private and not visible to the client.</p>
      <textarea
        value={content}
        onChange={handleChange}
        rows={16}
        className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm text-[#1C1C1A] leading-[1.8] outline-none focus:border-[#2D4A3E] transition-colors resize-none"
        placeholder="Write your private session notes here..."
      />
    </div>
  )
}
