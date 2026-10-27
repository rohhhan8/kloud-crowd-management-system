import { useId, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface GoToPageFormProps {
  totalPages: number
  onGo: (page: number) => void
}

/** Parses user input; returns an error message instead of silently clamping. */
function validate(value: string, totalPages: number): { page: number } | { error: string } {
  const trimmed = value.trim()
  if (!trimmed) return { error: 'Enter a page number.' }
  if (!/^\d+$/.test(trimmed)) return { error: 'Enter a whole number.' }
  const page = Number(trimmed)
  if (page < 1 || page > totalPages) return { error: `Enter a number from 1 to ${totalPages}.` }
  return { page }
}

export function GoToPageForm({ totalPages, onGo }: GoToPageFormProps) {
  const id = useId()
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const result = validate(value, totalPages)
    if ('error' in result) setError(result.error)
    else {
      setError(null)
      onGo(result.page)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-2">
      <Label htmlFor={id}>Go to page</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-24"
        />
        <Button type="submit">Go</Button>
      </div>
      <div role="alert" id={`${id}-error`}>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </form>
  )
}
