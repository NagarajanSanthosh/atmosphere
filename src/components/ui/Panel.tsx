import type { ReactNode } from 'react'

type PanelProps = {
  children: ReactNode
  className?: string
}

export function Panel({ children, className = '' }: PanelProps) {
  return <div className={`instrument-panel ${className}`}>{children}</div>
}
