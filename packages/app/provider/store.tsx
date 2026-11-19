'use client'

import type { PropsWithChildren } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { createId } from '../data/id'
import { storage } from '../data/storage'
import type { Comment, Project, Subitem, Task, TaskState } from '../data/types'

const STORAGE_KEY = 'pivot.store.v1'

type StoreData = {
  version: 1
  projects: Project[]
  tasks: Task[]
}

const EMPTY: StoreData = { version: 1, projects: [], tasks: [] }

export type NewTaskInput = {
  title: string
  state?: TaskState
  /** Normalised `YYYY-MM-DD`, or undefined. */
  due?: string
}

type StoreValue = {
  /** False until the local sheet has been read. */
  ready: boolean
  projects: Project[]
  tasks: Task[]
  createProject: (name: string) => Project | null
  createTask: (projectId: string, input: NewTaskInput) => Task | null
  toggleTask: (id: string) => void
  addSubtask: (taskId: string, title: string) => Subitem | null
  toggleSubtask: (taskId: string, subtaskId: string) => void
  renameSubtask: (taskId: string, subtaskId: string, title: string) => void
  deleteSubtask: (taskId: string, subtaskId: string) => void
  addComment: (taskId: string, body: string) => Comment | null
  updateComment: (taskId: string, commentId: string, body: string) => void
  deleteComment: (taskId: string, commentId: string) => void
  getProject: (id: string) => Project | undefined
  getProjectTasks: (id: string) => Task[]
}

const StoreContext = createContext<StoreValue | null>(null)

function isStoreData(value: unknown): value is StoreData {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<StoreData>

  return (
    candidate.version === 1 &&
    Array.isArray(candidate.projects) &&
    Array.isArray(candidate.tasks)
  )
}

/** Update one task, and the project that owns it, in a single immutable pass. */
function updateTaskInStore(
  current: StoreData,
  taskId: string,
  mutate: (task: Task) => Task,
): StoreData {
  const target = current.tasks.find((task) => task.id === taskId)

  if (!target) return current

  const now = new Date().toISOString()

  return {
    ...current,
    tasks: current.tasks.map((task) =>
      task.id === taskId ? { ...mutate(task), updatedAt: now } : task,
    ),
    projects: current.projects.map((project) =>
      project.id === target.projectId
        ? { ...project, updatedAt: now }
        : project,
    ),
  }
}

export function StoreProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<StoreData>(EMPTY)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const raw = await storage.getItem(STORAGE_KEY)

        if (cancelled || !raw) return

        const parsed: unknown = JSON.parse(raw)

        if (isStoreData(parsed)) setData(parsed)
      } catch (error) {
        console.warn('Pivot: could not read the local sheet.', error)
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    // Never write before hydration, or the first render's empty state would
    // erase an existing sheet.
    if (!ready) return

    storage.setItem(STORAGE_KEY, JSON.stringify(data)).catch((error) => {
      console.warn('Pivot: could not save the local sheet.', error)
    })
  }, [data, ready])

  const createProject = useCallback((name: string): Project | null => {
    const trimmed = name.trim()

    if (!trimmed) return null

    const now = new Date().toISOString()
    const project: Project = {
      id: createId(),
      name: trimmed,
      createdAt: now,
      updatedAt: now,
    }

    setData((current) => ({
      ...current,
      projects: [...current.projects, project],
    }))

    return project
  }, [])

  const createTask = useCallback(
    (projectId: string, input: NewTaskInput): Task | null => {
      const title = input.title.trim()

      if (!title) return null

      const now = new Date().toISOString()
      const task: Task = {
        id: createId(),
        projectId,
        title,
        state: input.state ?? 'queued',
        done: false,
        due: input.due,
        createdAt: now,
        updatedAt: now,
      }

      setData((current) => {
        const projectExists = current.projects.some(
          (project) => project.id === projectId,
        )

        if (!projectExists) return current

        return {
          ...current,
          tasks: [...current.tasks, task],
          projects: current.projects.map((project) =>
            project.id === projectId ? { ...project, updatedAt: now } : project,
          ),
        }
      })

      return task
    },
    [],
  )

  const toggleTask = useCallback((id: string) => {
    setData((current) =>
      updateTaskInStore(current, id, (task) => {
        const nextDone = !task.done

        return {
          ...task,
          done: nextDone,
          // Done completes the continuation; Reopen resets it.
          subitems: task.subitems?.map((subitem) => ({
            ...subitem,
            done: nextDone,
          })),
        }
      }),
    )
  }, [])

  const addSubtask = useCallback(
    (taskId: string, title: string): Subitem | null => {
      const trimmed = title.trim()

      if (!trimmed) return null

      const subtask: Subitem = {
        id: createId(),
        title: trimmed,
        done: false,
      }

      setData((current) =>
        updateTaskInStore(current, taskId, (task) => ({
          ...task,
          // A new continuation means the task is no longer complete.
          done: false,
          subitems: [...(task.subitems ?? []), subtask],
        })),
      )

      return subtask
    },
    [],
  )

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setData((current) =>
      updateTaskInStore(current, taskId, (task) => {
        const subitems = (task.subitems ?? []).map((subitem) =>
          subitem.id === subtaskId
            ? { ...subitem, done: !subitem.done }
            : subitem,
        )
        const completed =
          subitems.length > 0 && subitems.every((item) => item.done)

        return {
          ...task,
          subitems,
          done: subitems.length > 0 ? completed : task.done,
        }
      }),
    )
  }, [])

  const renameSubtask = useCallback(
    (taskId: string, subtaskId: string, title: string) => {
      const trimmed = title.trim()

      if (!trimmed) return

      setData((current) =>
        updateTaskInStore(current, taskId, (task) => ({
          ...task,
          subitems: (task.subitems ?? []).map((subitem) =>
            subitem.id === subtaskId ? { ...subitem, title: trimmed } : subitem,
          ),
        })),
      )
    },
    [],
  )

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setData((current) =>
      updateTaskInStore(current, taskId, (task) => {
        const subitems = (task.subitems ?? []).filter(
          (subitem) => subitem.id !== subtaskId,
        )
        const completed =
          subitems.length > 0 && subitems.every((item) => item.done)

        return {
          ...task,
          subitems,
          done: subitems.length > 0 ? completed : task.done,
        }
      }),
    )
  }, [])

  const addComment = useCallback(
    (taskId: string, body: string): Comment | null => {
      const trimmed = body.trim()

      if (!trimmed) return null

      const comment: Comment = {
        id: createId(),
        body: trimmed,
        createdAt: new Date().toISOString(),
      }

      setData((current) =>
        updateTaskInStore(current, taskId, (task) => ({
          ...task,
          comments: [...(task.comments ?? []), comment],
        })),
      )

      return comment
    },
    [],
  )

  const updateComment = useCallback(
    (taskId: string, commentId: string, body: string) => {
      const trimmed = body.trim()

      if (!trimmed) return

      const now = new Date().toISOString()

      setData((current) =>
        updateTaskInStore(current, taskId, (task) => ({
          ...task,
          comments: (task.comments ?? []).map((comment) =>
            comment.id === commentId
              ? { ...comment, body: trimmed, updatedAt: now }
              : comment,
          ),
        })),
      )
    },
    [],
  )

  const deleteComment = useCallback((taskId: string, commentId: string) => {
    setData((current) =>
      updateTaskInStore(current, taskId, (task) => ({
        ...task,
        comments: (task.comments ?? []).filter(
          (comment) => comment.id !== commentId,
        ),
      })),
    )
  }, [])

  const getProject = useCallback(
    (id: string) => data.projects.find((project) => project.id === id),
    [data.projects],
  )

  const getProjectTasks = useCallback(
    (id: string) =>
      data.tasks
        .filter((task) => task.projectId === id)
        .sort(
          (a, b) =>
            a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
        ),
    [data.tasks],
  )

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      projects: data.projects,
      tasks: data.tasks,
      createProject,
      createTask,
      toggleTask,
      addSubtask,
      toggleSubtask,
      renameSubtask,
      deleteSubtask,
      addComment,
      updateComment,
      deleteComment,
      getProject,
      getProjectTasks,
    }),
    [
      ready,
      data.projects,
      data.tasks,
      createProject,
      createTask,
      toggleTask,
      addSubtask,
      toggleSubtask,
      renameSubtask,
      deleteSubtask,
      addComment,
      updateComment,
      deleteComment,
      getProject,
      getProjectTasks,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const value = useContext(StoreContext)

  if (!value) {
    throw new Error('useStore must be used inside <StoreProvider>')
  }

  return value
}
