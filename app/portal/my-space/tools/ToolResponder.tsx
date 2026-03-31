'use client'

import Link from 'next/link'

const TOOL_TYPE_ICONS: Record<string, string> = {
  onboarding_questionnaire: '📋',
  self_discovery_questionnaire: '🔍',
  values_exercise: '💎',
  wheel_of_life: '🎯',
  belief_mapping: '🧠',
  mood_tracker: '📈',
  reflection_journal: '📓',
  gamified_challenge: '🏆',
}

interface Props {
  assignment: any
  clientId: string
}

export default function ToolResponder({ assignment }: Props) {
  const tool = assignment.tools
  const status: string = assignment.status
  const isCompleted = status === 'completed'

  const statusCls =
    isCompleted ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]' :
    status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
    'bg-[#6B6B65]/10 text-[#6B6B65]'

  const icon = TOOL_TYPE_ICONS[tool?.type] ?? '🔧'

  return (
    <Link
      href={`/portal/my-space/tools/${assignment.id}`}
      className={`block bg-white rounded-2xl p-6 hover:shadow-md transition-all ${isCompleted ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3
              className="font-semibold text-[#1C1C1A]"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {tool?.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusCls}`}>
              {status.replace('_', ' ')}
            </span>
          </div>
          {tool?.description && (
            <p className="text-sm text-[#6B6B65] truncate">{tool.description}</p>
          )}
          {assignment.note && (
            <p className="text-xs text-[#7A9E8E] mt-1 italic">"{assignment.note}"</p>
          )}
          {assignment.due_date && !isCompleted && (
            <p className="text-xs text-[#6B6B65] mt-1">
              Due {new Date(assignment.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </p>
          )}
        </div>
        {!isCompleted && (
          <span className="text-[#2D4A3E] shrink-0 text-sm">→</span>
        )}
      </div>
    </Link>
  )
}
