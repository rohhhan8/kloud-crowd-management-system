const integerFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export const formatInteger = (value: number) => integerFormat.format(value)

/** 22.2 -> "22min 12sec", 8.5 -> "08min 30sec", 0 -> "00min 00sec". */
export function formatDuration(minutes: number): string {
  const totalSeconds = Math.round(Math.max(0, minutes) * 60)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${formatInteger(mins).padStart(2, '0')}min ${String(secs).padStart(2, '0')}sec`
}
