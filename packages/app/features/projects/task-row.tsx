import { Text, View } from 'react-native'

import { Pressable } from '../../components/pressable'
import { formatDue, isOverdue } from '../../data/date'
import { getTaskProgress } from '../../data/progress'
import type { Task } from '../../data/types'
import { useTheme } from '../../provider/theme'

type TaskRowProps = {
  task: Task
  index: number
  selected: boolean
  onSelect: (id: string) => void
  onToggleSubtask: (taskId: string, subtaskId: string) => void
}

export function TaskRow({
  task,
  index,
  selected,
  onSelect,
  onToggleSubtask,
}: TaskRowProps) {
  const { colors } = useTheme()
  const overdue = isOverdue(task.due, task.done)
  const state = task.done ? 'done' : overdue ? 'overdue' : task.state
  const mark = task.done ? '✓' : overdue ? '✗' : ''
  const due = task.due ? formatDue(task.due) : '—'
  const progress = getTaskProgress(task)

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Task ${index}. ${task.title}. ${state}.${
          task.due ? ` Due ${due}.` : ''
        }`}
        accessibilityState={{ selected }}
        onPress={() => onSelect(task.id)}
        className={`relative h-11 flex-row items-center border-b lg:h-10 ${colors.border} ${
          selected ? colors.sel : ''
        } hover:bg-sel`}
      >
        {selected ? (
          <View
            className={`absolute bottom-0 left-0 top-0 w-px ${colors.annotationBg}`}
          />
        ) : null}

        <Text
          className={`w-7 pr-3 text-right font-mono text-[11px] lg:w-11 ${colors.faint}`}
        >
          {index}
        </Text>

        <Text
          numberOfLines={1}
          style={{ flexShrink: 1, minWidth: 0 }}
          className={`min-w-0 flex-1 pr-3 font-mono text-[12.5px] lg:text-[13.5px] ${
            task.done ? `line-through ${colors.faint}` : colors.text
          } ${selected ? 'font-bold' : ''}`}
        >
          {task.title}
        </Text>

        <View
          className={`w-[88px] justify-center self-stretch border-l-2 pl-3 lg:w-[118px] ${colors.strong}`}
        >
          <Text
            numberOfLines={1}
            className={`font-mono text-[11px] lg:text-[11.5px] ${
              overdue ? colors.accent : colors.text
            }`}
          >
            {state}
          </Text>
        </View>

        <View
          testID="task-progress"
          className="w-[44px] items-center justify-center self-stretch lg:w-[64px]"
        >
          {progress ? (
            <Text
              accessibilityLabel={`Progress ${progress.done} of ${progress.total}, ${progress.percent} percent`}
              className={`font-mono text-[11px] ${
                progress.percent === 100 ? colors.resolved : colors.text
              }`}
            >
              {progress.percent}%
            </Text>
          ) : null}
        </View>

        <Text
          className={`hidden w-6 text-center font-mono text-[14px] font-bold lg:block lg:w-8 ${
            task.done ? colors.resolved : colors.accent
          }`}
        >
          {mark}
        </Text>

        <Text
          className={`hidden w-[76px] pr-1 text-right font-mono text-[11px] lg:block ${
            overdue ? colors.accent : colors.muted
          }`}
        >
          {due}
        </Text>
      </Pressable>

      {task.subitems?.map((subitem, position) => (
        <Pressable
          key={subitem.id}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: subitem.done }}
          accessibilityLabel={`Subtask ${index}.${position + 1}: ${subitem.title}`}
          onPress={() => onToggleSubtask(task.id, subitem.id)}
          className={`h-[30px] flex-row items-center border-b border-dashed pl-[38px] pr-3 hover:bg-sel active:bg-sel lg:pl-[46px] ${colors.border}`}
        >
          <Text className={`w-9 font-mono text-[10px] lg:w-11 ${colors.faint}`}>
            {index}.{position + 1}
          </Text>
          <Text
            className={`w-3 font-mono text-[12px] font-bold ${
              subitem.done ? colors.resolved : colors.accent
            }`}
          >
            {subitem.done ? '✓' : '·'}
          </Text>
          <Text
            style={{ flexShrink: 1, minWidth: 0 }}
            className={`min-w-0 flex-1 font-mono text-[12px] ${
              subitem.done ? `line-through ${colors.faint}` : colors.text
            }`}
          >
            {subitem.title}
          </Text>
          <Text
            className={`font-mono text-[9.5px] uppercase tracking-[0.12em] ${colors.faint}`}
          >
            {subitem.done ? 'done' : 'next'}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

export function TaskHeader() {
  const { colors } = useTheme()

  return (
    <View className={`flex-row items-end border-b pb-1 ${colors.strong}`}>
      <Text
        className={`w-7 pr-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] lg:w-11 ${colors.faint}`}
      >
        #
      </Text>
      <Text
        className={`flex-1 font-mono text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
      >
        Task
      </Text>
      <Text
        className={`w-[88px] border-l-2 pl-3 font-mono text-[9px] uppercase tracking-[0.15em] lg:w-[118px] ${colors.strong} ${colors.faint}`}
      >
        Result
      </Text>
      <Text
        className={`w-[44px] text-center font-mono text-[9px] uppercase tracking-[0.15em] lg:w-[64px] ${colors.faint}`}
      >
        %
      </Text>
      <Text
        className={`hidden w-6 text-center font-mono lg:block lg:w-8 ${colors.faint}`}
      />
      <Text
        className={`hidden w-[76px] pr-1 text-right font-mono text-[9px] uppercase tracking-[0.15em] lg:block ${colors.faint}`}
      >
        Due
      </Text>
    </View>
  )
}
