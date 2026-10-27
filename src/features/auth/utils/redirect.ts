import { ROUTES } from '@/config/routes'

interface LocationState {
  from?: { pathname?: string; search?: string; hash?: string }
}

function isSafePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.includes('\\')
}

/** Where to go after login: the remembered location if it is a safe in-app path. */
export function resolveRedirect(state: unknown): string {
  const from = (state as LocationState | null)?.from
  if (!from?.pathname) return ROUTES.overview
  const target = `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
  return isSafePath(target) ? target : ROUTES.overview
}
