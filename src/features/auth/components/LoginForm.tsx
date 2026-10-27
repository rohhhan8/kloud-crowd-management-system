import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { FormField } from '@/components/shared/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { normalizeError } from '@/lib/http/errors'
import { login } from '../api/auth.api'
import { useAuth } from '../hooks/useAuth'
import { resolveRedirect } from '../utils/redirect'
import { PasswordInput } from './PasswordInput'

const loginSchema = z.object({
  email: z.string().min(1, 'Login ID is required.').pipe(z.email('Enter a valid email address.')),
  password: z.string().min(1, 'Password is required.'),
})

type LoginValues = z.infer<typeof loginSchema>

function getSubmitError(error: unknown): string | null {
  if (!error) return null
  const apiError = normalizeError(error)
  return apiError.status === 401 ? 'Invalid email or password.' : apiError.message
}

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: storeLogin } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    shouldFocusError: true,
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (token) => {
      storeLogin(token)
      void navigate(resolveRedirect(location.state), { replace: true })
    },
  })
  const submitError = getSubmitError(mutation.error)

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      noValidate
      className="space-y-4"
    >
      <FormField id="email" label="Log In" required error={errors.email?.message}>
        {(controlProps) => (
          <Input
            {...controlProps}
            className="h-9 rounded border-neutral-200 px-3 text-xs md:text-xs"
            type="email"
            autoComplete="username"
            // eslint-disable-next-line jsx-a11y/no-autofocus -- first field of a login screen
            autoFocus
            {...register('email')}
          />
        )}
      </FormField>

      <FormField id="password" label="Password" required error={errors.password?.message}>
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            autoComplete="current-password"
            {...register('password')}
          />
        )}
      </FormField>

      <div role="alert">
        {submitError && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {submitError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-[2.125rem] w-full rounded-md bg-brand-dark text-[0.8125rem] font-normal hover:bg-brand-dark"
        disabled={mutation.isPending}
        aria-busy={mutation.isPending}
      >
        {mutation.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
        Login
      </Button>
    </form>
  )
}
