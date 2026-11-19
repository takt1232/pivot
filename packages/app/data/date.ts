const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Parse `YYYY-MM-DD` as a local calendar date, not a UTC instant. */
export function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())

  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function toDateInput(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

/** Normalise a typed date, returning `null` when it is not a real date. */
export function normalizeDateInput(value: string): string | null {
  if (!value.trim()) return null

  const date = parseISODate(value)

  return date ? toDateInput(date) : null
}

export function startOfToday(): Date {
  const now = new Date()

  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function isOverdue(due: string | undefined, done: boolean): boolean {
  if (!due || done) return false

  const date = parseISODate(due)

  return date ? date.getTime() < startOfToday().getTime() : false
}

/** `19 Nov` — adds the year only when it is not the current one. */
export function formatDue(due: string): string {
  const date = parseISODate(due)

  if (!date) return due

  const label = `${date.getDate()} ${MONTHS[date.getMonth()]}`
  const currentYear = new Date().getFullYear()

  return date.getFullYear() === currentYear
    ? label
    : `${label} ${String(date.getFullYear()).slice(-2)}`
}

/** Timestamps are stored as ISO instants; show the local calendar date. */
export function formatStamp(iso: string): string {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return '—'

  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** `19 Nov · 14:32` — used for comments written today or earlier. */
export function formatMoment(iso: string): string {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return '—'

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${date.getDate()} ${MONTHS[date.getMonth()]} · ${hours}:${minutes}`
}

export function formatToday(): string {
  const date = new Date()

  return `${WEEKDAYS[date.getDay()]} · ${date.getDate()} ${MONTHS[date.getMonth()]}`
}
