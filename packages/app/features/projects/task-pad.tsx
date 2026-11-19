'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Platform,
  Text,
  type TextInput as TextInputInstance,
  View,
} from 'react-native'

import { Pressable } from '../../components/pressable'
import { TextInput } from '../../components/text-input'
import { formatStamp, formatToday, normalizeDateInput } from '../../data/date'
import { taskCountLabel } from '../../data/labels'
import {
  taskStates,
  type Project,
  type TaskState,
  type Task,
} from '../../data/types'
import { useTheme } from '../../provider/theme'
import type { NewTaskInput } from '../../provider/store'
import { TaskHeader, TaskRow } from './task-row'

type TaskPadProps = {
  project: Project
  tasks: Task[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreateTask: (input: NewTaskInput) => void
  onToggleSubtask: (taskId: string, subtaskId: string) => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null

  return Boolean(
    element &&
    (element.tagName === 'INPUT' ||
      element.tagName === 'TEXTAREA' ||
      element.isContentEditable),
  )
}

export function TaskPad({
  project,
  tasks,
  selectedId,
  onSelect,
  onCreateTask,
  onToggleSubtask,
}: TaskPadProps) {
  const { colors } = useTheme()

  const [title, setTitle] = useState('')
  const [state, setState] = useState<TaskState>('queued')
  const [due, setDue] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<TextInputInstance>(null)

  const done = tasks.filter((task) => task.done).length
  const open = tasks.length - done
  const sections = taskStates
    .map((section) => ({
      state: section,
      items: tasks.filter((task) => task.state === section),
    }))
    .filter((section) => section.items.length > 0)

  useEffect(() => {
    if (Platform.OS !== 'web') return

    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'n' || isTypingTarget(event.target)) return

      event.preventDefault()
      inputRef.current?.focus()
    }

    window.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [])

  const cycleState = () => {
    const index = taskStates.indexOf(state)
    const next = taskStates[(index + 1) % taskStates.length]

    if (next) setState(next)
  }

  const submit = () => {
    if (!title.trim()) {
      setError('Name the task first.')
      inputRef.current?.focus()
      return
    }

    const dueText = due.trim()
    let normalizedDue: string | undefined

    if (dueText) {
      const parsed = normalizeDateInput(dueText)

      if (!parsed) {
        setError('Use yyyy-mm-dd for the due date.')
        return
      }

      normalizedDue = parsed
    }

    onCreateTask({ title, state, due: normalizedDue })
    setTitle('')
    setDue('')
    setError('')
    inputRef.current?.focus()
  }

  return (
    <View className="w-full flex-1 px-4 pt-3 lg:px-7 lg:pt-5">
      <View
        className={`flex-row items-baseline justify-between border-b pb-2 ${colors.strong}`}
      >
        <Text
          className={`font-sans text-[9.5px] font-semibold uppercase tracking-[0.15em] ${colors.faint}`}
        >
          Task sheet — one project
        </Text>
        <Text
          className={`hidden font-mono text-[10px] lg:block ${colors.faint}`}
        >
          {taskCountLabel(tasks.length)} · {open} open
        </Text>
      </View>

      <Text
        numberOfLines={2}
        className={`mt-2 font-sans text-[27px] font-medium leading-tight tracking-[-0.02em] lg:text-[30px] ${colors.text}`}
      >
        {project.name}
      </Text>

      <View
        className={`mt-1 flex-row items-center gap-5 border-b-[2.5px] pb-3 ${colors.strong}`}
      >
        <View className="flex-row items-center gap-2">
          <View className={`h-[11px] w-[11px] ${colors.ink}`} />
          <Text className={`font-mono text-[11.5px] ${colors.muted}`}>
            {done} done
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className={`h-[11px] w-[11px] border ${colors.strong}`} />
          <Text className={`font-mono text-[11.5px] ${colors.muted}`}>
            {open} open
          </Text>
        </View>
        <Text
          className={`ml-auto hidden font-mono text-[11px] lg:block ${colors.faint}`}
        >
          created {formatStamp(project.createdAt)}
        </Text>
      </View>

      <View className="mt-4">
        <Text
          className={`font-sans text-[9px] uppercase tracking-[0.16em] ${colors.faint}`}
        >
          New task
        </Text>

        <View className="mt-2 gap-2">
          <TextInput
            ref={inputRef}
            value={title}
            onChangeText={(value) => {
              setTitle(value)
              if (error) setError('')
            }}
            onSubmitEditing={submit}
            accessibilityLabel="Task title"
            placeholder="What needs doing?"
            returnKeyType="done"
            testID="new-task-title"
            className="w-full"
          />

          <View className="flex-row flex-wrap items-stretch gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Task state: ${state}. Tap to change.`}
              onPress={cycleState}
              className={`min-h-[44px] justify-center border px-3 active:opacity-70 lg:min-h-[38px] ${colors.strong}`}
            >
              <Text className={`font-mono text-[11px] ${colors.text}`}>
                state · {state}
              </Text>
            </Pressable>

            <TextInput
              value={due}
              onChangeText={(value) => {
                setDue(value)
                if (error) setError('')
              }}
              onSubmitEditing={submit}
              accessibilityLabel="Due date, year month day"
              placeholder="due yyyy-mm-dd"
              returnKeyType="done"
              testID="new-task-due"
              className="w-[148px]"
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add task"
              onPress={submit}
              className={`min-h-[44px] justify-center border px-4 active:opacity-70 lg:min-h-[38px] ${colors.strong}`}
            >
              <Text
                className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
              >
                Add task
              </Text>
            </Pressable>
          </View>
        </View>

        {error ? (
          <Text className={`mt-2 font-mono text-[11.5px] ${colors.accent}`}>
            {error}
          </Text>
        ) : null}
      </View>

      <View className="mt-4">
        <TaskHeader />
      </View>

      {tasks.length === 0 ? (
        <View className={`mt-4 border-y border-dashed py-6 ${colors.border}`}>
          <Text className={`font-mono text-[12.5px] ${colors.text}`}>
            No tasks on this sheet yet.
          </Text>
          <Text
            className={`mt-1 font-mono text-[11.5px] leading-[1.7] ${colors.muted}`}
          >
            Add the first one above. Tasks stay inside this project.
          </Text>
        </View>
      ) : null}

      {sections.map((section) => {
        const sectionDone = section.items.filter((task) => task.done).length

        return (
          <View key={section.state} className="mt-4">
            <View className="flex-row items-baseline gap-2 pb-1">
              <Text
                className={`font-sans text-[12px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
              >
                {section.state}
              </Text>
              <Text
                className={`ml-auto hidden font-mono text-[10px] lg:block ${colors.faint}`}
              >
                {taskCountLabel(section.items.length)} · {sectionDone} done
              </Text>
              <Text
                className={`ml-auto font-mono text-[10px] lg:hidden ${colors.faint}`}
              >
                {sectionDone}/{section.items.length}
              </Text>
            </View>

            {section.items.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                index={tasks.findIndex((entry) => entry.id === task.id) + 1}
                selected={selectedId === task.id}
                onSelect={onSelect}
                onToggleSubtask={onToggleSubtask}
              />
            ))}
          </View>
        )
      })}

      <View
        className={`mt-auto flex-row items-end gap-5 border-t-[2.5px] pt-2 ${colors.strong}`}
      >
        <View className="flex-1">
          <Text className={`font-mono text-[26px] leading-none ${colors.text}`}>
            {String(done).padStart(2, '0')}
            <Text className={`text-[11px] tracking-[0.12em] ${colors.faint}`}>
              {' '}
              / {String(tasks.length).padStart(2, '0')} done
            </Text>
          </Text>
          <Text
            className={`mt-2 hidden font-mono text-[10.5px] lg:block ${colors.faint}`}
          >
            annotations: ✗ overdue · ✓ done
          </Text>
        </View>

        <View className={`hidden border px-3 py-1.5 lg:flex ${colors.strong}`}>
          <Text
            className={`font-mono text-[10.5px] font-bold tracking-[0.1em] ${colors.text}`}
          >
            LOCAL SHEET
          </Text>
          <Text className={`font-mono text-[10px] ${colors.faint}`}>
            {formatToday()}
          </Text>
          <Text className={`font-mono text-[10px] ${colors.faint}`}>
            {open} open
          </Text>
        </View>
      </View>

      {Platform.OS === 'web' ? (
        <Text
          className={`mb-4 mt-4 hidden font-mono text-[10px] lg:block ${colors.faint}`}
        >
          ↑↓ select · space done · n new task · esc close
        </Text>
      ) : null}
    </View>
  )
}
