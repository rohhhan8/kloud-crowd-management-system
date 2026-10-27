import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { ApiError, normalizeError } from './errors'

export const LOGIN_PATH = '/api/auth/login'

interface InterceptorDeps {
  getToken: () => string | null
}

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null
let handlingUnauthorized = false

/** Registered from app/providers so http never imports the auth store's consumers. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler
  handlingUnauthorized = false
}

function isLoginRequest(config?: InternalAxiosRequestConfig | AxiosError['config']): boolean {
  return (config?.url ?? '').split('?')[0]?.endsWith(LOGIN_PATH) ?? false
}

function notifyUnauthorized() {
  if (handlingUnauthorized || !unauthorizedHandler) return
  handlingUnauthorized = true
  unauthorizedHandler()
  // Re-arm after the current tick so in-flight parallel 401s are deduped.
  setTimeout(() => {
    handlingUnauthorized = false
  }, 0)
}

export function attachInterceptors(client: AxiosInstance, { getToken }: InterceptorDeps) {
  client.interceptors.request.use((config) => {
    if (isLoginRequest(config)) return config

    const token = getToken()
    if (!token) {
      // Rejections here still flow through the response interceptor below.
      return Promise.reject(new ApiError(401, 'Your session has expired. Please sign in again.'))
    }
    config.headers.set('Authorization', `Bearer ${token}`)
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      const apiError = normalizeError(error)
      const config = (error as AxiosError | undefined)?.config
      if (apiError.status === 401 && !isLoginRequest(config)) notifyUnauthorized()
      return Promise.reject(apiError)
    },
  )
}
