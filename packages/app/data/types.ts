export type TaskState = 'in progress' | 'review' | 'queued' | 'someday'

/** Sections are written in this order on every sheet. */
export const taskStates: TaskState[] = [
  'in progress',
  'review',
  'queued',
  'someday',
]

export type Subitem = {
  id: string
  title: string
  done: boolean
}

export type Comment = {
  id: string
  body: string
  createdAt: string
  /** Set when the comment has been edited. */
  updatedAt?: string
}

export type Project = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type Task = {
  id: string
  projectId: string
  title: string
  state: TaskState
  done: boolean
  /** ISO calendar date, `YYYY-MM-DD`. */
  due?: string
  note?: string
  subitems?: Subitem[]
  comments?: Comment[]
  createdAt: string
  updatedAt: string
}
