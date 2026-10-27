export const ROUTES = {
  login: '/login',
  overview: '/',
  entries: '/entries',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
