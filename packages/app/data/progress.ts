import type { Task } from './types'

export type TaskProgress = {
  done: number
  total: number
  percent: number
}

/**
 * Progress only exists once a task has subtasks. The task sheet renders a
 * blank progress cell for everything else.
 */
export function getTaskProgress(task: Task): TaskProgress | null {
  const total = task.subitems?.length ?? 0

  if (total === 0) return null

  const done = task.subitems?.filter((subitem) => subitem.done).length ?? 0

  return {
    done,
    total,
    percent: Math.round((done / total) * 100),
  }
}
