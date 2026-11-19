'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'solito/link'

import { Pressable } from '../../components/pressable'
import { useTheme } from '../../provider/theme'
import type { NewTaskInput } from '../../provider/store'
import { useStore } from '../../provider/store'
import { ProjectRail } from './project-rail'
import { TaskPad } from './task-pad'
import { TaskSheet } from './task-sheet'

type ProjectScreenProps = {
  projectId: string
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

/** Native buttons and links keep their own Space / Enter activation. */
function isControlTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null

  return Boolean(
    element?.closest(
      'button, a, [role="button"], [role="checkbox"], [role="link"]',
    ),
  )
}

function CompactBar() {
  const { colors, theme, toggleTheme } = useTheme()

  return (
    <View
      className={`flex-row items-center justify-between border-b px-4 py-3 lg:hidden ${colors.border}`}
    >
      <Link href="/">
        <Text
          className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${colors.accent}`}
        >
          ← Projects
        </Text>
      </Link>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          theme === 'light'
            ? 'Switch to the night pad'
            : 'Switch to the day pad'
        }
        onPress={toggleTheme}
        className={`min-h-[44px] justify-center border px-3 py-1.5 ${colors.strong}`}
      >
        <Text
          className={`font-sans text-[10px] uppercase tracking-[0.12em] ${colors.text}`}
        >
          {theme === 'light' ? 'Night' : 'Day'}
        </Text>
      </Pressable>
    </View>
  )
}

export function ProjectScreen({ projectId }: ProjectScreenProps) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const {
    ready,
    projects,
    tasks,
    createTask,
    toggleTask,
    toggleSubtask,
    getProject,
    getProjectTasks,
  } = useStore()

  const project = getProject(projectId)
  const projectTasks = useMemo(
    () => getProjectTasks(projectId),
    [getProjectTasks, projectId],
  )

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const selectedTask =
    projectTasks.find((task) => task.id === selectedId) ??
    projectTasks[0] ??
    null
  const selectedIndex = selectedTask
    ? projectTasks.findIndex((task) => task.id === selectedTask.id) + 1
    : 0

  const select = useCallback(
    (id: string) => {
      setSelectedId(id)
      // Below the two-pane breakpoint the sheet has nowhere to live; open it.
      if (width < 1024) setSheetOpen(true)
    },
    [width],
  )

  const create = useCallback(
    (input: NewTaskInput) => {
      createTask(projectId, input)
    },
    [createTask, projectId],
  )

  useEffect(() => {
    if (Platform.OS !== 'web') return

    const handler = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      if (event.key === 'Escape') {
        setSheetOpen(false)
        return
      }

      if (projectTasks.length === 0) return

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()

        const index = projectTasks.findIndex(
          (task) => task.id === selectedTask?.id,
        )
        const step = event.key === 'ArrowDown' ? 1 : -1
        const next = (index + step + projectTasks.length) % projectTasks.length

        select(projectTasks[next]!.id)
      }

      if (event.key === ' ') {
        if (!selectedTask || isControlTarget(event.target)) return

        event.preventDefault()
        toggleTask(selectedTask.id)
      }
    }

    window.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [projectTasks, selectedTask, select, toggleTask])

  if (!ready) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className={`flex-1 ${colors.background}`}
      >
        <View className="flex-1 items-center justify-center px-6">
          <Text className={`font-mono text-[12px] ${colors.faint}`}>
            Reading the local sheet…
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!project) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className={`flex-1 ${colors.background}`}
      >
        <View className="mx-auto w-full max-w-xl px-5 py-10">
          <Text
            className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
          >
            404
          </Text>
          <Text
            className={`mt-2 font-mono text-[19px] font-bold leading-[1.4] ${colors.text}`}
          >
            No project with id “{projectId}”.
          </Text>
          <Link href="/">
            <Text
              className={`mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] ${colors.accent}`}
            >
              ← Back to all projects
            </Text>
          </Link>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className={`flex-1 ${colors.background}`}>
      <View className="flex-1 flex-row">
        <ProjectRail
          projects={projects}
          tasks={tasks}
          activeProjectId={projectId}
        />

        <View className={`min-w-0 flex-1 ${colors.sheet}`}>
          <CompactBar />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <TaskPad
              project={project}
              tasks={projectTasks}
              selectedId={selectedTask?.id ?? null}
              onSelect={select}
              onCreateTask={create}
              onToggleSubtask={toggleSubtask}
            />
          </ScrollView>
        </View>

        {selectedTask ? (
          <TaskSheet
            className="hidden lg:flex"
            task={selectedTask}
            project={project}
            tasks={projectTasks}
            index={selectedIndex}
            onToggleDone={toggleTask}
            onSelect={select}
          />
        ) : (
          <View
            className={`hidden w-[344px] border-l px-6 py-7 lg:flex ${colors.border} ${colors.background}`}
          >
            <Text
              className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
            >
              Detail sheet
            </Text>
            <Text
              className={`mt-3 font-mono text-[11.5px] leading-[1.7] ${colors.faint}`}
            >
              No task to open yet. Add one on the pad and it will be recorded
              here.
            </Text>
          </View>
        )}
      </View>

      <Modal
        visible={sheetOpen}
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <View className={`flex-1 ${colors.background}`}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <SafeAreaView style={{ flex: 1 }} className={colors.background}>
              {selectedTask ? (
                <TaskSheet
                  full
                  task={selectedTask}
                  project={project}
                  tasks={projectTasks}
                  index={selectedIndex}
                  onToggleDone={toggleTask}
                  onSelect={select}
                  onClose={() => setSheetOpen(false)}
                />
              ) : (
                <View className="flex-1 items-center justify-center px-6">
                  <Text className={`font-mono text-[12px] ${colors.faint}`}>
                    No task to open yet.
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close the task sheet"
                    onPress={() => setSheetOpen(false)}
                    className={`mt-4 min-h-[44px] justify-center border px-3 py-2 ${colors.strong}`}
                  >
                    <Text
                      className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
                    >
                      Close
                    </Text>
                  </Pressable>
                </View>
              )}
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
