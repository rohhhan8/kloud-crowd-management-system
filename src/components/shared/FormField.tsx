import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

interface AriaProps {
  id: string
  'aria-invalid': true | undefined
  'aria-describedby': string | undefined
}

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  /** Render the control with the id/aria attributes that tie it to its label and error. */
  children: (controlProps: AriaProps) => ReactNode
}

/** Outlined field with the label sitting on its top border (as in the design). */
export function FormField({ id, label, required, error, children }: FormFieldProps) {
  const errorId = `${id}-error`
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Label
          htmlFor={id}
          className="absolute -top-1.5 left-2.5 z-10 bg-white px-1 text-[0.625rem] leading-3 text-neutral-600"
        >
          {label}

          {required && (
            <span aria-hidden="true" className="ml-0.5">
              *
            </span>
          )}
        </Label>
        {children({
          id,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? errorId : undefined,
        })}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
