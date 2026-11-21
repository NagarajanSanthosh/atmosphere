import { Panel } from '@/components/ui/Panel'

type FeatureTeaserProps = {
  eyebrow: string
  title: string
  body: string
  week: string
}

export function FeatureTeaser({ eyebrow, title, body, week }: FeatureTeaserProps) {
  return (
    <Panel className="mx-auto max-w-2xl p-8 text-center sm:p-10">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 font-display text-3xl text-mist-50 sm:text-4xl">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-mist-300 sm:text-base">{body}</p>
      <p className="mt-6 inline-flex rounded-full border border-sun-500/25 bg-sun-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-sun-300 uppercase">
        Coming {week}
      </p>
    </Panel>
  )
}
