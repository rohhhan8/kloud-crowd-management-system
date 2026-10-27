import type { LucideIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
  /** Secondary text shown after the label, e.g. a city. */
  description?: string
}

interface FilterSelectProps {
  value: string | undefined
  options: readonly FilterOption[]
  onChange: (value: string) => void
  icon: LucideIcon
  'aria-label': string
  placeholder?: string
  disabled?: boolean
  className?: string
}

/** Icon + select used by every header/page filter (site, date range, ...). */
export function FilterSelect({
  value,
  options,
  onChange,
  icon: Icon,
  placeholder,
  disabled,
  className,
  'aria-label': ariaLabel,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger aria-label={ariaLabel} className={cn('min-w-40 bg-white', className)}>
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" align="start" sideOffset={6}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
            {option.description && (
              <span className="ml-1 text-xs text-muted-foreground">{option.description}</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
