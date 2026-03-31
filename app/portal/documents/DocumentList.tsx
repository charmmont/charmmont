'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Doc {
  id: string
  file_name: string
  file_url: string
  file_type: string | null
  file_size: number | null
  label: string | null
  description: string | null
  category: string | null
  is_shared: boolean
  created_at: string
  clients?: { id: string; profiles?: { full_name: string } | null } | null
}

interface Props {
  documents: Doc[]
  clients: { id: string; full_name: string }[]
}

const CATEGORY_LABELS: Record<string, string> = {
  consent_form:       'Consent form',
  agreement:          'Agreement',
  resource:           'Resource',
  programme_material: 'Programme material',
  other:              'Other',
}

const FILE_ICONS: Record<string, string> = {
  'application/pdf':                                                   '📄',
  'application/msword':                                                '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'image/jpeg':  '🖼',
  'image/png':   '🖼',
  'image/webp':  '🖼',
}

function fileIcon(type: string | null) {
  return FILE_ICONS[type ?? ''] ?? '📎'
}

function fileSize(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentList({ documents, clients }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<string>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = filter === 'all'
    ? documents
    : filter === 'shared'
    ? documents.filter((d) => !d.clients)
    : documents.filter((d) => d.clients?.id === filter)

  async function deleteDoc(doc: Doc) {
    if (!confirm(`Delete "${doc.label ?? doc.file_name}"? This cannot be undone.`)) return
    setDeleting(doc.id)
    const supabase = createClient()

    // Extract storage path from URL
    const urlParts = doc.file_url.split('/storage/v1/object/public/documents/')
    if (urlParts[1]) {
      await supabase.storage.from('documents').remove([urlParts[1]])
    }

    await supabase.from('documents').delete().eq('id', doc.id)
    setDeleting(null)
    router.refresh()
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center">
        <div className="w-12 h-12 bg-[#FAF7F2] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">📎</div>
        <p className="font-semibold text-[#1C1C1A] text-sm mb-2">No documents yet</p>
        <p className="text-sm text-[#6B6B65]">Upload consent forms, resources, and materials using the button above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 w-fit overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#2D4A3E] text-white' : 'text-[#6B6B65] hover:text-[#1C1C1A]'}`}
        >
          All ({documents.length})
        </button>
        <button
          onClick={() => setFilter('shared')}
          className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${filter === 'shared' ? 'bg-[#2D4A3E] text-white' : 'text-[#6B6B65] hover:text-[#1C1C1A]'}`}
        >
          Shared resources
        </button>
        {clients.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${filter === c.id ? 'bg-[#2D4A3E] text-white' : 'text-[#6B6B65] hover:text-[#1C1C1A]'}`}
          >
            {c.full_name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Document grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-sm text-[#6B6B65] italic">
          No documents in this filter.
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="divide-y divide-[#2D4A3E]/10">
            {filtered.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-5">
                <span className="text-2xl shrink-0">{fileIcon(doc.file_type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-medium text-[#1C1C1A] truncate">{doc.label ?? doc.file_name}</p>
                    {doc.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#2D4A3E]/8 text-[#2D4A3E]">
                        {CATEGORY_LABELS[doc.category] ?? doc.category}
                      </span>
                    )}
                    {doc.is_shared ? (
                      <span className="text-xs text-[#7A9E8E]">Visible to client</span>
                    ) : (
                      <span className="text-xs text-[#6B6B65]">Internal only</span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B6B65]">
                    {doc.clients?.profiles?.full_name ?? 'Shared resource'}
                    {doc.file_size && ` · ${fileSize(doc.file_size)}`}
                    {' · '}{new Date(doc.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {doc.description && (
                    <p className="text-xs text-[#6B6B65] mt-0.5 italic">{doc.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => deleteDoc(doc)}
                    disabled={deleting === doc.id}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                  >
                    {deleting === doc.id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
