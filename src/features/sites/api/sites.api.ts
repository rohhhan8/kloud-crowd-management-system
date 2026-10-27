import { http } from '@/lib/http/client'
import type { Site } from '../types'
import { normalizeSitesResponse } from './normalizers'

export async function getSites(): Promise<Site[]> {
  const { data } = await http.get<unknown>('/api/sites')
  return normalizeSitesResponse(data)
}
