'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  clientId?: string  // if set, scoped to that client; else a shared resource
  clients?: { id: string; full_name: string }[]
  onUploaded?: () => void
}

const CATEGORIES = [
  { value: 'consent_form',         label: 'Consent form' },
  { value: 'agreement',            label: 'Programme agreement' },
  { value: 'resource',             label: 'Resource / handout' },
  { value: 'programme_material',   label: 'Programme material' },
  { value: 'other',                label: 'Other' },
]

export default function DocumentUpload({ clientId: defaultClientId, clients, onUploaded }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [isShared, setIsShared] = useState(true)
  const [selectedClientId, setSelectedClientId] = useState(defaultClientId ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    if (!label) setLabel(f.name.replace(/\.[^/.]+$/, ''))
  }

  async function handleUpload() {
    if (!file) { setError('Please choose a file.'); return }
    if (!label.trim()) { setError('Please enter a name for this document.'); return }
    setError('')
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = selectedClientId
      ? `${selectedClientId}/${Date.now()}.${ext}`
      : `shared/${Date.now()}.${ext}`

    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(path, file, { contentType: file.type })

    if (storageError) {
      setError(storageError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)

    const { error: dbError } = await supabase.from('documents').insert({
      client_id: selectedClientId || null,
      file_name: file.name,
      file_url: publicUrl,
      file_type: file.type,
      file_size: file.size,
      label: label.trim(),
      description: description.trim() || null,
      category,
      is_shared: isShared,
    })

    if (dbError) {
      setError(dbError.message)
      setUploading(false)
      return
    }

    setFile(null)
    setLabel('')
    setDescription('')
    setCategory('other')
    setIsShared(true)
    setOpen(false)
    if (fileRef.current) fileRef.current.value = ''
    setUploading(false)
    onUploaded?.()
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-[#2D4A3E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
      >
        + Upload document
      </button>
    )
  }

  const inputCls = 'w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors'

  return (
    <div className="bg-white rounded-2xl p-6 space-y-4 border border-[#2D4A3E]/10">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#1C1C1A] text-sm">Upload document</h3>
        <button onClick={() => setOpen(false)} className="text-[#6B6B65] hover:text-[#1C1C1A] text-sm">✕</button>
      </div>

      {/* File picker */}
      <div
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          file ? 'border-[#2D4A3E] bg-[#2D4A3E]/5' : 'border-[#2D4A3E]/20 hover:border-[#2D4A3E]/40'
        }`}
      >
        <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
        {file ? (
          <div>
            <p className="text-sm font-medium text-[#2D4A3E]">{file.name}</p>
            <p className="text-xs text-[#6B6B65] mt-1">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        ) : (
          <div>
            <p className="text-2xl mb-2">📎</p>
            <p className="text-sm text-[#6B6B65]">Click to choose a file</p>
            <p className="text-xs text-[#6B6B65]/60 mt-1">PDF, DOCX, images up to 10MB</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Document name</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={inputCls}
            placeholder="e.g. Welcome Pack 2026"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputCls} bg-white`}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        {clients && clients.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Assign to client</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className={`${inputCls} bg-white`}
            >
              <option value="">Shared resource (all clients)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Description <span className="font-normal">(optional)</span></label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputCls}
          placeholder="Brief note about this document…"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isShared}
          onChange={(e) => setIsShared(e.target.checked)}
          className="accent-[#2D4A3E] w-4 h-4"
        />
        <div>
          <p className="text-sm text-[#1C1C1A]">Visible to client</p>
          <p className="text-xs text-[#6B6B65]">Client can see and download this document in their portal.</p>
        </div>
      </label>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setOpen(false)}
          className="flex-1 border border-[#2D4A3E]/20 text-[#6B6B65] py-2.5 rounded-full text-sm hover:bg-[#FAF7F2] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="flex-1 bg-[#2D4A3E] text-white py-2.5 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </div>
  )
}
