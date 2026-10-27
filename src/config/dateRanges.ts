export const DATE_RANGE_PRESETS = [
  { value: 'today', label: 'Today', comparedTo: 'yesterday' },
  {
    value: 'yesterday',
    label: 'Yesterday',
    comparedTo: 'the day before',
  },
  {
    value: 'last7days',
    label: 'Last 7 days',
    comparedTo: 'the previous 7 days',
  },
] as const

export type DateRangePreset = (typeof DATE_RANGE_PRESETS)[number]['value']

export const DEFAULT_DATE_RANGE: DateRangePreset = 'today'

export function isDateRangePreset(value: string | null): value is DateRangePreset {
  return DATE_RANGE_PRESETS.some((preset) => preset.value === value)
}

export function getPresetConfig(value: DateRangePreset) {
  return DATE_RANGE_PRESETS.find((preset) => preset.value === value) ?? DATE_RANGE_PRESETS[0]
}
