'use client'

import { useEffect, useRef, useState } from 'react'
import { Text, type TextInput as TextInputInstance, View } from 'react-native'

import { Pressable } from '../../components/pressable'
import { TextInput } from '../../components/text-input'
import { getTaskProgress } from '../../data/progress'
import type { Task } from '../../data/types'
import { useTheme } from '../../provider/theme'
import { useStore } from '../../provider/store'

type TaskSubtasksProps = {
  task: Task
}

export function TaskSubtasks({ task }: TaskSubtasksProps) {
  const { colors } = useTheme()
  const { addSubtask, toggleSubtask, renameSubtask, deleteSubtask } = useStore()

  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<TextInputInstance>(null)

  const subtasks = task.subitems ?? []
  const progress = getTaskProgress(task)

  useEffect(() => {
    setTitle('')
    setError('')
    setEditingId(null)
    setDraft('')
  }, [task.id])

  const submitAdd = () => {
    if (!title.trim()) {
      setError('Name the subtask first.')
      inputRef.current?.focus()
      return
    }

    addSubtask(task.id, title)
    setTitle('')
    setError('')
    inputRef.current?.focus()
  }

  const startEdit = (id: string, value: string) => {
    setEditingId(id)
    setDraft(value)
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft('')
    setError('')
  }

  const saveEdit = () => {
    if (!editingId) return

    if (!draft.trim()) {
      setError('Name the subtask first.')
      return
    }

    renameSubtask(task.id, editingId, draft)
    cancelEdit()
  }

  return (
    <View className="mt-4 border-t pt-2.5">
      <View className="flex-row items-baseline justify-between">
        <Text
          className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
        >
          Subtasks — {subtasks.length}
        </Text>
        <Text
          className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
        >
          {progress
            ? `${progress.done} / ${progress.total} · ${progress.percent}%`
            : 'no progress'}
        </Text>
      </View>

      {subtasks.length === 0 ? (
        <Text className={`mt-1.5 font-mono text-[11.5px] ${colors.faint}`}>
          No subtasks yet. Add one to start a progress count.
        </Text>
      ) : null}

      {subtasks.map((subtask, position) => (
        <View
          key={subtask.id}
          className={`border-b border-dotted py-1.5 ${colors.border}`}
        >
          {editingId === subtask.id ? (
            <View className="gap-1.5">
              <View className="flex-row items-center gap-2">
                <Text
                  className={`w-3 font-mono text-[12px] font-bold ${
                    subtask.done ? colors.resolved : colors.accent
                  }`}
                >
                  {subtask.done ? '✓' : '·'}
                </Text>
                <TextInput
                  value={draft}
                  onChangeText={(value) => {
                    setDraft(value)
                    if (error) setError('')
                  }}
                  onSubmitEditing={saveEdit}
                  autoFocus
                  accessibilityLabel={`Rename subtask ${position + 1}`}
                  returnKeyType="done"
                  testID="edit-subtask-title"
                  className="flex-1"
                />
              </View>

              <View className="flex-row gap-2 pl-5">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Save subtask name"
                  onPress={saveEdit}
                  className={`min-h-[32px] justify-center border px-2 py-1 ${colors.strong}`}
                >
                  <Text
                    className={`font-sans text-[9px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
                  >
                    Save
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cancel subtask rename"
                  onPress={cancelEdit}
                  className={`min-h-[32px] justify-center border px-2 py-1 ${colors.strong}`}
                >
                  <Text
                    className={`font-sans text-[9px] font-semibold uppercase tracking-[0.12em] ${colors.muted}`}
                  >
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View className="flex-row items-center gap-2">
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: subtask.done }}
                accessibilityLabel={`Toggle subtask ${position + 1}: ${subtask.title}`}
                onPress={() => toggleSubtask(task.id, subtask.id)}
                hitSlop={10}
                className="min-h-[30px] w-5 justify-center"
              >
                <Text
                  className={`font-mono text-[12px] font-bold ${
                    subtask.done ? colors.resolved : colors.accent
                  }`}
                >
                  {subtask.done ? '✓' : '·'}
                </Text>
              </Pressable>

              <Text
                className={`min-w-0 flex-1 font-mono text-[12px] ${
                  subtask.done ? `line-through ${colors.faint}` : colors.text
                }`}
              >
                {subtask.title}
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Edit subtask ${subtask.title}`}
                onPress={() => startEdit(subtask.id, subtask.title)}
                hitSlop={6}
                className="min-h-[30px] justify-center pl-1"
              >
                <Text
                  className={`font-mono text-[9px] uppercase tracking-[0.1em] ${colors.faint}`}
                >
                  edit
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove subtask ${subtask.title}`}
                onPress={() => deleteSubtask(task.id, subtask.id)}
                hitSlop={6}
                className="min-h-[30px] justify-center pl-1"
              >
                <Text
                  className={`font-mono text-[9px] uppercase tracking-[0.1em] ${colors.accent}`}
                >
                  remove
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}

      <View className="mt-2">
        <View className="flex-row gap-2">
          <TextInput
            ref={inputRef}
            value={title}
            onChangeText={(value) => {
              setTitle(value)
              if (error) setError('')
            }}
            onSubmitEditing={submitAdd}
            accessibilityLabel="New subtask"
            placeholder="New subtask"
            returnKeyType="done"
            testID="new-subtask-title"
            className="flex-1"
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add subtask"
            onPress={submitAdd}
            className={`min-h-[44px] justify-center border px-3 active:opacity-70 lg:min-h-[38px] ${colors.strong}`}
          >
            <Text
              className={`font-sans text-[9.5px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
            >
              Add
            </Text>
          </Pressable>
        </View>

        {error ? (
          <Text className={`mt-1.5 font-mono text-[11px] ${colors.accent}`}>
            {error}
          </Text>
        ) : null}
      </View>
    </View>
  )
}
