export function taskCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'task' : 'tasks'}`
}
