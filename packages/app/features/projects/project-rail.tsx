'use client'

import { Text, View } from 'react-native'
import { useRouter } from 'solito/navigation'

import { Pressable } from '../../components/pressable'
import type { Project, Task } from '../../data/types'
import { useTheme } from '../../provider/theme'

type ProjectRailProps = {
  projects: Project[]
  tasks: Task[]
  activeProjectId: string
}

export function ProjectRail({
  projects,
  tasks,
  activeProjectId,
}: ProjectRailProps) {
  const { colors, theme, toggleTheme } = useTheme()
  const router = useRouter()

  const ordered = [...projects].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )

  return (
    <View
      className={`hidden w-[196px] border-r px-5 py-6 lg:flex ${colors.border}`}
    >
      <View>
        <Text className={`font-sans text-[17px] font-semibold ${colors.text}`}>
          Pivot
        </Text>
        <Text
          className={`mt-1 font-mono text-[9px] uppercase tracking-[0.18em] ${colors.faint}`}
        >
          Local project sheet
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to all projects"
        onPress={() => router.push('/')}
        className={`mt-6 min-h-[32px] justify-center self-start border px-2 py-1 active:opacity-70 ${colors.strong}`}
      >
        <Text
          className={`font-sans text-[9.5px] uppercase tracking-[0.12em] ${colors.text}`}
        >
          ← All projects
        </Text>
      </Pressable>

      <Text
        className={`mb-1 mt-6 font-sans text-[9px] uppercase tracking-[0.16em] ${colors.faint}`}
      >
        Projects
      </Text>

      {ordered.map((project) => {
        const active = project.id === activeProjectId
        const projectTasks = tasks.filter(
          (task) => task.projectId === project.id,
        )
        const open = projectTasks.filter((task) => !task.done).length

        return (
          <Pressable
            key={project.id}
            accessibilityRole="button"
            accessibilityLabel={`Open project ${project.name}`}
            accessibilityState={{ selected: active }}
            onPress={() => router.push(`/projects/${project.id}`)}
            className={`relative flex-row items-baseline justify-between py-1.5 active:opacity-70 ${
              active ? 'pl-2' : 'pl-[9px]'
            }`}
          >
            {active ? (
              <View
                className={`absolute bottom-0 left-0 top-0 w-px ${colors.annotationBg}`}
              />
            ) : null}
            <Text
              numberOfLines={1}
              className={`min-w-0 flex-1 pr-2 font-sans text-[13px] ${
                active ? `font-semibold ${colors.text}` : colors.muted
              }`}
            >
              {project.name}
            </Text>
            <Text className={`font-mono text-[10px] ${colors.faint}`}>
              {open}
            </Text>
          </Pressable>
        )
      })}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create a new project"
        onPress={() => router.push('/')}
        className="relative mt-1 py-1.5 pl-[9px] active:opacity-70"
      >
        <Text className={`font-sans text-[12px] ${colors.faint}`}>
          + new project
        </Text>
      </Pressable>

      <View className="mt-auto pt-8">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            theme === 'light'
              ? 'Switch to the night pad'
              : 'Switch to the day pad'
          }
          onPress={toggleTheme}
          className={`self-start border px-2.5 py-1.5 ${colors.strong}`}
        >
          <Text
            className={`font-sans text-[10px] uppercase tracking-[0.12em] ${colors.text}`}
          >
            {theme === 'light' ? 'Night pad' : 'Day pad'}
          </Text>
        </Pressable>

        <Text
          className={`mt-4 font-mono text-[9px] uppercase leading-[1.7] tracking-[0.14em] ${colors.faint}`}
        >
          Local · stored on this device{'\n'}No account
        </Text>
      </View>
    </View>
  )
}
