import { Text, View } from 'react-native'

import type { Move } from '../../data/board'
import { Pressable } from '../../components/pressable'
import { useTheme } from '../../provider/theme'

type ScoreRowProps = {
  move: Move
  resolved: boolean
  selected: boolean
  onSelect: (id: string) => void
}

export function ScoreRow({
  move,
  resolved,
  selected,
  onSelect,
}: ScoreRowProps) {
  const { colors } = useTheme()
  const isOverdue = move.state === 'overdue' && !resolved
  const mark = resolved ? '✓' : (move.mark ?? '')
  const state = resolved ? 'resolved' : move.state

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Turn ${move.turn}. ${move.title}. ${state}. Due ${move.due}.`}
        accessibilityState={{ selected }}
        onPress={() => onSelect(move.id)}
        className={`relative h-11 flex-row items-center border-b lg:h-10 ${colors.border} ${
          selected ? colors.sel : ''
        } hover:bg-sel`}
      >
        {selected && (
          <View
            className={`absolute bottom-0 left-0 top-0 w-px ${colors.annotationBg}`}
          />
        )}

        <Text
          className={`w-7 pr-3 text-right font-mono text-[11px] lg:w-11 ${colors.faint}`}
        >
          {move.turn}
        </Text>

        <Text
          numberOfLines={1}
          style={{ flexShrink: 1, minWidth: 0 }}
          className={`min-w-0 flex-1 pr-3 font-mono text-[12.5px] lg:text-[13.5px] ${
            resolved ? `line-through ${colors.faint}` : colors.text
          } ${selected ? 'font-bold' : ''}`}
        >
          {move.title}
        </Text>

        <View
          className={`w-[96px] justify-center self-stretch border-l-2 pl-3 lg:w-[118px] ${colors.strong}`}
        >
          <Text
            numberOfLines={1}
            className={`font-mono text-[11px] lg:text-[11.5px] ${
              isOverdue ? colors.accent : colors.text
            }`}
          >
            {isOverdue ? 'overdue' : state}
          </Text>
        </View>

        <Text
          className={`w-6 text-center font-mono text-[14px] font-bold lg:w-8 ${
            resolved ? colors.resolved : colors.accent
          }`}
        >
          {mark}
        </Text>

        <Text
          className={`hidden w-[76px] pr-1 text-right font-mono text-[11px] lg:block ${
            isOverdue ? colors.accent : colors.muted
          }`}
        >
          {move.due}
        </Text>
      </Pressable>

      {move.subitems?.map((subitem) => (
        <View
          key={subitem.id}
          className={`h-[30px] flex-row items-center border-b border-dashed pl-[38px] pr-3 lg:pl-[46px] ${colors.border}`}
        >
          <Text className={`w-9 font-mono text-[10px] lg:w-11 ${colors.faint}`}>
            {subitem.id}
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
        </View>
      ))}

      {move.subitems && move.subitems.length > 0 && (
        <View
          className={`h-[30px] flex-row items-center border-b pl-[38px] lg:pl-[46px] ${colors.sheet} ${colors.border}`}
        >
          <Text className={`font-mono text-[11.5px] ${colors.muted}`}>
            + next subitem
          </Text>
        </View>
      )}
    </View>
  )
}

export function ScoreHeader() {
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
        Move
      </Text>
      <Text
        className={`w-[96px] border-l-2 pl-3 font-mono text-[9px] uppercase tracking-[0.15em] lg:w-[118px] ${colors.strong} ${colors.faint}`}
      >
        Result
      </Text>
      <Text className={`w-6 text-center font-mono lg:w-8 ${colors.faint}`} />
      <Text
        className={`hidden w-[76px] pr-1 text-right font-mono text-[9px] uppercase tracking-[0.15em] lg:block ${colors.faint}`}
      >
        Due
      </Text>
    </View>
  )
}
