import type { ReactNode } from 'react'

type ExplorerHeroProps = {
  search: ReactNode
}

export function ExplorerHero({ search }: ExplorerHeroProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0 max-w-xl">
        <p className="eyebrow mb-1.5">Sun Explorer</p>
        <h1 className="font-display text-2xl leading-tight text-mist-50 sm:text-3xl">
          See where the sun is{' '}
          <span className="bg-gradient-to-r from-sun-300 via-sun-500 to-dusk-500 bg-clip-text text-transparent">
            right now
          </span>
        </h1>
      </div>
      <div className="w-full sm:max-w-md sm:shrink-0">{search}</div>
    </div>
  )
}
