import { ScrollView, Text, View } from 'react-native'

import { Pressable } from '../../components/pressable'
import { formatDue, formatStamp, isOverdue } from '../../data/date'
import { getTaskProgress } from '../../data/progress'
import type { Project, Task } from '../../data/types'
import { useTheme } from '../../provider/theme'
import { TaskComments } from './comments'
import { TaskSubtasks } from './subtasks'

type TaskSheetProps = {
  task: Task
  project: Project
  tasks: Task[]
  index: number
  full?: boolean
  className?: string
  onToggleDone: (id: string) => void
  onSelect: (id: string) => void
  onClose?: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme()

  return (
    <View
      className={`flex-row items-baseline gap-3 border-b border-dotted py-2 ${colors.border}`}
    >
      <Text
        className={`w-[74px] font-sans text-[9px] uppercase tracking-[0.14em] ${colors.faint}`}
      >
        {label}
      </Text>
      <Text className={`flex-1 font-mono text-[12px] ${colors.text}`}>
        {value}
      </Text>
    </View>
  )
}

export function TaskSheet({
  task,
  project,
  tasks,
  index,
  full = false,
  className = '',
  onToggleDone,
  onSelect,
  onClose,
}: TaskSheetProps) {
  const { colors } = useTheme()
  const overdue = isOverdue(task.due, task.done)
  const state = task.done ? 'done' : overdue ? 'overdue' : task.state
  const progress = getTaskProgress(task)
  const siblings = tasks.filter((entry) => entry.id !== task.id)

  return (
    <View
      className={`relative ${full ? 'flex-1' : 'w-[344px]'} ${colors.background} ${
        full ? '' : `border-l ${colors.border}`
      } ${className}`}
    >
      <View
        className={`absolute left-24 top-0 h-12 w-3 rounded-full border ${colors.strong}`}
        style={{
          transform: [{ rotate: '2deg' }, { translateY: full ? 2 : -14 }],
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className={`border-b-2 px-6 pb-3 pt-7 ${colors.strong}`}>
          <View className="flex-row items-baseline justify-between">
            <Text
              className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
            >
              Task {index}
            </Text>
            <Text
              className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
            >
              {state}
            </Text>
          </View>

          <Text
            className={`mt-2 font-mono text-[17px] font-bold leading-[1.35] ${colors.text}`}
          >
            {task.title}
          </Text>

          <View className="mt-2 flex-row items-center gap-3">
            <View className={`border px-1.5 py-0.5 ${colors.strong}`}>
              <Text className={`font-mono text-[10px] ${colors.text}`}>
                {state}
              </Text>
            </View>
            <Text
              className={`font-mono text-[11px] ${
                overdue ? colors.accent : colors.muted
              }`}
            >
              due {task.due ? formatDue(task.due) : '—'}
            </Text>
          </View>
        </View>

        <View className="px-6 pt-2">
          <Field label="Project" value={project.name} />
          <Field label="State" value={task.state} />
          <Field
            label="Due"
            value={task.due ? formatDue(task.due) : 'Not scheduled'}
          />
          {progress ? (
            <Field
              label="Progress"
              value={`${progress.done} / ${progress.total} · ${progress.percent}%`}
            />
          ) : null}
          <Field label="Created" value={formatStamp(task.createdAt)} />
          <Field label="Updated" value={formatStamp(task.updatedAt)} />

          <TaskSubtasks task={task} />

          <View className="mt-4 border-t pt-2.5">
            <Text
              className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
            >
              Annotation
            </Text>
            <Text
              className={`mt-1.5 font-mono text-[11.5px] leading-[1.7] ${colors.text}`}
            >
              {task.note ?? 'Nothing written here yet.'}
            </Text>
          </View>

          <TaskComments task={task} />

          {siblings.length > 0 ? (
            <View className="mt-4 border-t pt-2.5">
              <Text
                className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
              >
                Also in this project
              </Text>
              {siblings.map((sibling) => {
                const siblingIndex =
                  tasks.findIndex((entry) => entry.id === sibling.id) + 1

                return (
                  <Pressable
                    key={sibling.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Open task ${siblingIndex}: ${sibling.title}`}
                    onPress={() => onSelect(sibling.id)}
                    className={`flex-row items-baseline gap-2 border-b border-dotted py-2 ${colors.border}`}
                  >
                    <Text
                      className={`w-4 font-mono text-[11px] ${colors.faint}`}
                    >
                      {siblingIndex}
                    </Text>
                    <Text
                      numberOfLines={1}
                      className={`flex-1 font-mono text-[12px] ${
                        sibling.done
                          ? `line-through ${colors.faint}`
                          : colors.text
                      }`}
                    >
                      {sibling.title}
                    </Text>
                    <Text
                      className={`font-mono text-[10px] uppercase tracking-[0.08em] ${colors.faint}`}
                    >
                      {sibling.done ? 'done' : sibling.state}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View className={`border-t-2 px-6 py-4 ${colors.strong}`}>
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              task.done ? 'Reopen this task' : 'Complete this task'
            }
            onPress={() => onToggleDone(task.id)}
            className={`min-h-[44px] justify-center border px-3 py-2 ${colors.strong}`}
          >
            <Text
              className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
            >
              {task.done ? 'Reopen' : 'Done'}
            </Text>
          </Pressable>

          {onClose ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close the task sheet"
              onPress={onClose}
              className={`min-h-[44px] justify-center border px-3 py-2 ${colors.strong}`}
            >
              <Text
                className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
              >
                Close
              </Text>
            </Pressable>
          ) : null}

          <Text className={`ml-auto font-mono text-[10px] ${colors.faint}`}>
            {index} / {tasks.length}
          </Text>
        </View>
      </View>
    </View>
  )
}
