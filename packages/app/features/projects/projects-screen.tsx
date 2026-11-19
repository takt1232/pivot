'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Platform,
  ScrollView,
  Text,
  type TextInput as TextInputInstance,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'solito/navigation'

import { Pressable } from '../../components/pressable'
import { TextInput } from '../../components/text-input'
import { formatStamp, formatToday } from '../../data/date'
import { taskCountLabel } from '../../data/labels'
import { useTheme } from '../../provider/theme'
import { useStore } from '../../provider/store'

function isTypingTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null

  return Boolean(
    element &&
    (element.tagName === 'INPUT' ||
      element.tagName === 'TEXTAREA' ||
      element.isContentEditable),
  )
}

export function ProjectsScreen() {
  const { colors, theme, toggleTheme } = useTheme()
  const { ready, projects, tasks, createProject } = useStore()
  const router = useRouter()

  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<TextInputInstance>(null)

  const ordered = [...projects].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )
  const done = tasks.filter((task) => task.done).length
  const open = tasks.length - done

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

  const submit = () => {
    if (!ready) return

    const project = createProject(name)

    if (!project) {
      setError('Give the project a name first.')
      inputRef.current?.focus()
      return
    }

    setError('')
    setName('')
    router.push(`/projects/${project.id}`)
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className={`flex-1 ${colors.background}`}>
      <View
        className={`flex-row items-center justify-between border-b px-4 py-4 lg:px-8 ${colors.border}`}
      >
        <View>
          <Text
            className={`font-sans text-[17px] font-semibold ${colors.text}`}
          >
            Pivot
          </Text>
          <Text
            className={`mt-1 font-mono text-[9px] uppercase tracking-[0.18em] ${colors.faint}`}
          >
            Projects · stored locally
          </Text>
        </View>

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
            {theme === 'light' ? 'Night pad' : 'Day pad'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className={`flex-1 ${colors.sheet}`}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-3xl px-4 pb-10 pt-4 lg:px-8 lg:pt-6">
          <View
            className={`flex-row items-baseline justify-between border-b pb-2 ${colors.strong}`}
          >
            <Text
              className={`font-sans text-[9.5px] font-semibold uppercase tracking-[0.15em] ${colors.faint}`}
            >
              Project sheet — one per project
            </Text>
            <Text className={`font-mono text-[10px] ${colors.faint}`}>
              {String(projects.length).padStart(2, '0')}{' '}
              {projects.length === 1 ? 'project' : 'projects'}
            </Text>
          </View>

          <Text
            className={`mt-2 font-sans text-[27px] font-medium leading-tight tracking-[-0.02em] lg:text-[30px] ${colors.text}`}
          >
            Projects
          </Text>

          <View
            className={`mt-1 flex-row items-center gap-5 border-b-[2.5px] pb-3 ${colors.strong}`}
          >
            <Text className={`font-mono text-[11.5px] ${colors.muted}`}>
              {open} open · {done} done
            </Text>
            <Text className={`ml-auto font-mono text-[11px] ${colors.faint}`}>
              {formatToday()}
            </Text>
          </View>

          <View className="mt-5">
            <Text
              className={`font-sans text-[9px] uppercase tracking-[0.16em] ${colors.faint}`}
            >
              New project
            </Text>

            <View className="mt-2 flex-row gap-2">
              <TextInput
                ref={inputRef}
                value={name}
                onChangeText={(value) => {
                  setName(value)
                  if (error) setError('')
                }}
                onSubmitEditing={submit}
                editable={ready}
                accessibilityLabel="Project name"
                placeholder="Project name"
                returnKeyType="done"
                testID="new-project-name"
                className="flex-1"
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create project"
                onPress={submit}
                className={`min-h-[44px] justify-center border px-4 active:opacity-70 lg:min-h-[38px] ${colors.strong}`}
              >
                <Text
                  className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
                >
                  Create
                </Text>
              </Pressable>
            </View>

            {error ? (
              <Text className={`mt-2 font-mono text-[11.5px] ${colors.accent}`}>
                {error}
              </Text>
            ) : null}
          </View>

          <View className="mt-7">
            {!ready ? (
              <Text className={`font-mono text-[12px] ${colors.faint}`}>
                Reading the local sheet…
              </Text>
            ) : null}

            {ready && ordered.length === 0 ? (
              <View className={`border-y border-dashed py-7 ${colors.border}`}>
                <Text className={`font-mono text-[12.5px] ${colors.text}`}>
                  No projects yet.
                </Text>
                <Text
                  className={`mt-1 font-mono text-[11.5px] leading-[1.7] ${colors.muted}`}
                >
                  Name the first one above. Its task sheet opens next.
                </Text>
              </View>
            ) : null}

            {ordered.map((project, index) => {
              const projectTasks = tasks.filter(
                (task) => task.projectId === project.id,
              )
              const projectDone = projectTasks.filter(
                (task) => task.done,
              ).length
              const projectOpen = projectTasks.length - projectDone

              return (
                <Pressable
                  key={project.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open project ${project.name}`}
                  onPress={() => router.push(`/projects/${project.id}`)}
                  className={`min-h-[60px] flex-row items-center border-b py-3 hover:bg-sel active:bg-sel ${colors.border}`}
                >
                  <Text className={`w-9 font-mono text-[11px] ${colors.faint}`}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>

                  <View className="min-w-0 flex-1 pr-3">
                    <Text
                      numberOfLines={1}
                      className={`font-mono text-[13.5px] font-bold ${colors.text}`}
                    >
                      {project.name}
                    </Text>
                    <Text
                      className={`mt-0.5 font-mono text-[11px] ${colors.muted}`}
                    >
                      {projectTasks.length === 0
                        ? 'no tasks'
                        : `${taskCountLabel(projectTasks.length)} · ${projectDone} done`}
                      {' · created '}
                      {formatStamp(project.createdAt)}
                    </Text>
                  </View>

                  <Text
                    className={`w-[52px] text-right font-mono text-[11px] ${
                      projectOpen === 0 && projectTasks.length > 0
                        ? colors.resolved
                        : colors.text
                    }`}
                  >
                    {projectOpen}/{projectTasks.length}
                  </Text>

                  <Text
                    className={`w-7 text-right font-mono text-[15px] ${colors.faint}`}
                  >
                    →
                  </Text>
                </Pressable>
              )
            })}
          </View>

          <View
            className={`mt-auto flex-row items-end gap-5 border-t-[2.5px] pt-3 ${colors.strong}`}
          >
            <View className="flex-1">
              <Text
                className={`font-mono text-[26px] leading-none ${colors.text}`}
              >
                {String(projects.length).padStart(2, '0')}
                <Text
                  className={`text-[11px] tracking-[0.12em] ${colors.faint}`}
                >
                  {' '}
                  / {taskCountLabel(tasks.length)} · {open} open
                </Text>
              </Text>

              {Platform.OS === 'web' ? (
                <Text
                  className={`mt-2 hidden font-mono text-[10.5px] lg:block ${colors.faint}`}
                >
                  n new project · enter create
                </Text>
              ) : null}
            </View>

            <Text
              className={`font-mono text-[10px] uppercase tracking-[0.14em] ${colors.faint}`}
            >
              local only{'\n'}no account
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
