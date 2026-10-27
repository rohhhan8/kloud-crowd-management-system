interface GenderIconProps {
  gender: 'male' | 'female'
  color: string
  className?: string
}

/** Small standing-figure icon (decorative; the label next to it carries the meaning). */
export function GenderIcon({ gender, color, className = 'h-8 w-4' }: GenderIconProps) {
  return (
    <svg viewBox="0 0 16 32" fill={color} className={className} aria-hidden="true">
      <circle cx="8" cy="4" r="3.2" />
      {gender === 'male' ? (
        <path d="M3 9h10a2 2 0 0 1 2 2v9h-2.6V30a1.4 1.4 0 0 1-2.8 0V21.5h-1.2V30a1.4 1.4 0 0 1-2.8 0V20H1v-9a2 2 0 0 1 2-2Z" />
      ) : (
        <path d="M8 9c2.3 0 3.4 1 4 2.6L15.5 22H11v8a1.4 1.4 0 0 1-2.8 0v-8H7.8v8A1.4 1.4 0 0 1 5 30v-8H.5L4 11.6C4.6 10 5.7 9 8 9Z" />
      )}
    </svg>
  )
}
