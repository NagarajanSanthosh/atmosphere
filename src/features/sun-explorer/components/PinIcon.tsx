type PinIconProps = {
  className?: string
}

export function PinIcon({ className = 'size-4' }: PinIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  )
}
