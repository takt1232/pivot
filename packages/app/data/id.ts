/**
 * IDs only need to be unique on this device, not globally.
 *
 * `crypto.randomUUID` is missing on some React Native runtimes, so use a
 * time-ordered base36 value plus entropy instead.
 */
export function createId(): string {
  const time = Date.now().toString(36)
  const entropy = Math.random().toString(36).slice(2, 10)

  return `${time}${entropy}`
}
