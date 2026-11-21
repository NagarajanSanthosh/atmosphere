import type { ReactNode } from 'react'

type WeatherHeroProps = {
  search: ReactNode
}

export function WeatherHero({ search }: WeatherHeroProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0 max-w-xl">
        <p className="eyebrow mb-1.5">UV & Weather</p>
        <h1 className="font-display text-2xl leading-tight text-mist-50 sm:text-3xl">
          Know when the sky is{' '}
          <span className="bg-gradient-to-r from-sun-300 via-sun-500 to-dusk-500 bg-clip-text text-transparent">
            kind
          </span>
        </h1>
        <p className="mt-2 max-w-md text-sm text-mist-400">
          Live UV, temperature, and cloud cover from Open-Meteo — paired with today&apos;s light
          windows.
        </p>
      </div>
      <div className="w-full sm:max-w-md sm:shrink-0">{search}</div>
    </div>
  )
}
