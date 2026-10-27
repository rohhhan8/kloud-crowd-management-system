import type { EntryRecord } from '../schemas'
import type { EntryRow } from '../types'

const GENDER_LABELS: Record<string, string> = { male: 'Male', female: 'Female' }

export function mapEntry(record: EntryRecord): EntryRow {
  return {
    key: `${record.personId}-${record.entryUtc}-${record.zoneId}`,
    name: record.personName,
    genderLabel: GENDER_LABELS[record.gender.toLowerCase()] ?? '—',
    zoneName: record.zoneName,
    severity: record.severity,
    entryUtc: record.entryUtc,
    exitUtc: record.exitUtc,
    dwellMinutes: record.dwellMinutes,
  }
}
