import { Panel } from '@/components/ui/Panel'
import type { ShootabilityNote as Note } from '@/features/weather/utils/shootability'

type ShootabilityNoteProps = {
  note: Note
}

const TONE_CLASS: Record<Note['tone'], string> = {
  good: 'border-sun-500/25 bg-sun-500/10 text-sun-300',
  mixed: 'border-dusk-500/25 bg-dusk-500/10 text-dusk-500',
  poor: 'border-twilight-500/25 bg-twilight-500/10 text-twilight-300',
  neutral: 'border-white/[0.08] bg-night-950/45 text-mist-300',
}

export function ShootabilityNote({ note }: ShootabilityNoteProps) {
  return (
    <Panel className="p-5 sm:p-6">
      <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
        Shootability
      </p>
      <div className={`mt-3 rounded-xl border px-3.5 py-3 ${TONE_CLASS[note.tone]}`}>
        <p className="font-display text-lg text-mist-50">{note.headline}</p>
        <p className="mt-1 text-sm text-mist-300">{note.detail}</p>
      </div>
    </Panel>
  )
}
