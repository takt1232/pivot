'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Platform,
  Text,
  type NativeSyntheticEvent,
  type TextInput as TextInputInstance,
  type TextInputKeyPressEventData,
  View,
} from 'react-native'

import { Pressable } from '../../components/pressable'
import { TextInput } from '../../components/text-input'
import { formatMoment } from '../../data/date'
import type { Task } from '../../data/types'
import { useTheme } from '../../provider/theme'
import { useStore } from '../../provider/store'

type TaskCommentsProps = {
  task: Task
}

type AddCommentKeyEvent = TextInputKeyPressEventData & {
  ctrlKey?: boolean
  metaKey?: boolean
}

export function TaskComments({ task }: TaskCommentsProps) {
  const { colors } = useTheme()
  const { addComment, updateComment, deleteComment } = useStore()

  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<TextInputInstance>(null)

  const comments = task.comments ?? []

  useEffect(() => {
    setBody('')
    setError('')
    setEditingId(null)
    setDraft('')
  }, [task.id])

  const submitAdd = () => {
    if (!body.trim()) {
      setError('Write the comment first.')
      inputRef.current?.focus()
      return
    }

    addComment(task.id, body)
    setBody('')
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
      setError('Write the comment first.')
      return
    }

    updateComment(task.id, editingId, draft)
    cancelEdit()
  }

  const handleAddKeyPress = (
    event: NativeSyntheticEvent<AddCommentKeyEvent>,
  ) => {
    const native = event.nativeEvent

    if (native.key === 'Enter' && (native.ctrlKey || native.metaKey)) {
      submitAdd()
    }
  }

  return (
    <View className="mt-4 border-t pt-2.5">
      <View className="flex-row items-baseline justify-between">
        <Text
          className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
        >
          Comments — {comments.length}
        </Text>
        <Text
          className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
        >
          oldest first
        </Text>
      </View>

      {comments.length === 0 ? (
        <Text className={`mt-1.5 font-mono text-[11.5px] ${colors.faint}`}>
          No comments yet.
        </Text>
      ) : null}

      {comments.map((comment) => (
        <View
          key={comment.id}
          className={`border-b border-dotted py-2 ${colors.border}`}
        >
          {editingId === comment.id ? (
            <View className="gap-1.5">
              <TextInput
                value={draft}
                onChangeText={(value) => {
                  setDraft(value)
                  if (error) setError('')
                }}
                multiline
                numberOfLines={3}
                autoFocus
                accessibilityLabel="Edit comment"
                testID="edit-comment-body"
                style={{ minHeight: 70, textAlignVertical: 'top' }}
              />

              <View className="flex-row gap-2">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Save comment"
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
                  accessibilityLabel="Cancel comment edit"
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
            <View>
              <Text
                className={`font-mono text-[11.5px] leading-[1.7] ${colors.text}`}
              >
                {comment.body}
              </Text>

              <View className="mt-1 flex-row items-center gap-2">
                <Text
                  className={`font-mono text-[9.5px] tracking-[0.08em] ${colors.faint}`}
                >
                  {formatMoment(comment.createdAt)}
                  {comment.updatedAt ? ' · edited' : ''}
                </Text>

                <View className="ml-auto flex-row gap-2">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit comment"
                    onPress={() => startEdit(comment.id, comment.body)}
                    hitSlop={6}
                    className="justify-center"
                  >
                    <Text
                      className={`font-mono text-[9px] uppercase tracking-[0.1em] ${colors.faint}`}
                    >
                      edit
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remove comment"
                    onPress={() => deleteComment(task.id, comment.id)}
                    hitSlop={6}
                    className="justify-center"
                  >
                    <Text
                      className={`font-mono text-[9px] uppercase tracking-[0.1em] ${colors.accent}`}
                    >
                      remove
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      ))}

      <View className="mt-2">
        <TextInput
          ref={inputRef}
          value={body}
          onChangeText={(value) => {
            setBody(value)
            if (error) setError('')
          }}
          onKeyPress={handleAddKeyPress}
          multiline
          numberOfLines={3}
          accessibilityLabel="New comment"
          placeholder="Write a comment…"
          testID="new-comment-body"
          style={{ minHeight: 76, textAlignVertical: 'top' }}
        />

        <View className="mt-1.5 flex-row items-center justify-between gap-2">
          <Text className={`font-mono text-[9.5px] ${colors.faint}`}>
            {Platform.OS === 'web' ? 'ctrl + enter' : ''}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add comment"
            onPress={submitAdd}
            className={`min-h-[38px] justify-center border px-3 active:opacity-70 ${colors.strong}`}
          >
            <Text
              className={`font-sans text-[9.5px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
            >
              Add comment
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
