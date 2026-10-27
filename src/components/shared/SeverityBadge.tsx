import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      severity: {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-amber-100 text-amber-900',
        low: 'bg-green-100 text-green-800',
      },
    },
    defaultVariants: { severity: 'low' },
  },
)

type Severity = NonNullable<VariantProps<typeof badgeVariants>['severity']>

const LABELS: Record<Severity, string> = { high: 'High', medium: 'Medium', low: 'Low' }

/** Always shows a text label; colour is never the only signal. */
export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={badgeVariants({ severity })}>{LABELS[severity]}</span>
}
