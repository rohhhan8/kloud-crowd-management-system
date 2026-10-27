import { postValidated } from '@/lib/http/validated'
import {
  demographicsSchema,
  dwellSchema,
  footfallSchema,
  occupancySchema,
  type DemographicsResponse,
  type DwellResponse,
  type FootfallResponse,
  type OccupancyResponse,
} from '../schemas'
import type { AnalyticsParams } from '../types'

export const getFootfall = (params: AnalyticsParams): Promise<FootfallResponse> =>
  postValidated('/api/analytics/footfall', footfallSchema, params)

export const getDwell = (params: AnalyticsParams): Promise<DwellResponse> =>
  postValidated('/api/analytics/dwell', dwellSchema, params)

export const getOccupancy = (params: AnalyticsParams): Promise<OccupancyResponse> =>
  postValidated('/api/analytics/occupancy', occupancySchema, params)

export const getDemographics = (params: AnalyticsParams): Promise<DemographicsResponse> =>
  postValidated('/api/analytics/demographics', demographicsSchema, params)
