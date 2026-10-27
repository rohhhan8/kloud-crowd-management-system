import type { DemographicsPoint, GenderShare } from '../types'

/** Share of males vs females over the period; percentages are rounded to sum to 100. */
export function getGenderShare(points: readonly DemographicsPoint[]): GenderShare {
  const male = points.reduce((sum, p) => sum + p.male, 0)
  const female = points.reduce((sum, p) => sum + p.female, 0)
  const total = male + female
  if (total === 0) return { malePct: 0, femalePct: 0, total: 0 }

  const malePct = Math.round((male / total) * 100)
  return { malePct, femalePct: 100 - malePct, total }
}
