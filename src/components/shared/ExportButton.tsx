import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExportButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function ExportButton({ label, onClick, disabled }: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      title={label}
      aria-disabled={disabled || undefined}
      className="aria-disabled:opacity-50"
      onClick={() => {
        if (!disabled) onClick()
      }}
    >
      <Download aria-hidden="true" />
    </Button>
  )
}
