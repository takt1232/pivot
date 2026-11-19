import { ScrollView, Text, View } from 'react-native'

import { games, type Move } from '../../data/board'
import { Pressable } from '../../components/pressable'
import { useTheme } from '../../provider/theme'

type DetailSheetProps = {
  move: Move
  resolved: boolean
  full?: boolean
  className?: string
  onToggleResolve: (id: string) => void
  onSelect?: (id: string) => void
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

export function DetailSheet({
  move,
  resolved,
  full = false,
  className = '',
  onToggleResolve,
  onSelect,
  onClose,
}: DetailSheetProps) {
  const { colors } = useTheme()
  const game = games.find((entry) =>
    entry.moves.some((candidate) => candidate.id === move.id),
  )
  const siblings = game?.moves.filter((entry) => entry.id !== move.id) ?? []
  const state = resolved ? 'resolved' : move.state

  return (
    <View
      className={`relative ${full ? 'flex-1' : 'w-[344px]'} ${colors.background} ${
        full ? '' : `border-l ${colors.border}`
      } ${className}`}
    >
      <View
        className={`absolute left-24 top-0 h-12 w-3 rounded-full border ${colors.strong}`}
        style={{ transform: [{ rotate: '2deg' }, { translateY: -14 }] }}
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
              Move {move.turn}
            </Text>
            <Text
              className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
            >
              {move.mark ? 'annotated' : `${state}`}
            </Text>
          </View>

          <Text
            className={`mt-2 font-mono text-[17px] font-bold leading-[1.35] ${colors.text}`}
          >
            {move.title}
          </Text>

          <View className="mt-2 flex-row items-center gap-3">
            <View className={`border px-1.5 py-0.5 ${colors.strong}`}>
              <Text className={`font-mono text-[10px] ${colors.text}`}>
                {state}
              </Text>
            </View>
            <Text className={`font-mono text-[11px] ${colors.muted}`}>
              due {move.due}
            </Text>
          </View>
        </View>

        <View className="px-6 pt-2">
          <Field
            label="Game"
            value={`${game?.index ?? 1} · ${game?.title ?? ''}`}
          />
          <Field label="Window" value={move.window ?? '—'} />
          <Field label="Variation" value={move.variation ?? '—'} />

          <View className="mt-4">
            <View className="flex-row items-baseline justify-between">
              <Text
                className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
              >
                Continuation — {move.subitems?.length ?? 0}
              </Text>
              <Text
                className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
              >
                {move.subitems?.filter((item) => item.done).length ?? 0}{' '}
                resolved
              </Text>
            </View>

            {(move.subitems?.length ?? 0) === 0 && (
              <Text className={`mt-2 font-mono text-[11.5px] ${colors.faint}`}>
                No continuation. This move ends where it lands.
              </Text>
            )}

            {move.subitems?.map((subitem) => (
              <View
                key={subitem.id}
                className={`flex-row items-baseline gap-2 border-b border-dotted py-1.5 ${colors.border}`}
              >
                <Text
                  className={`w-3 font-mono text-[12px] font-bold ${
                    subitem.done ? colors.resolved : colors.accent
                  }`}
                >
                  {subitem.done ? '✓' : '·'}
                </Text>
                <Text
                  className={`flex-1 font-mono text-[12px] ${
                    subitem.done ? `line-through ${colors.faint}` : colors.text
                  }`}
                >
                  {subitem.title}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-4 border-t pt-2.5">
            <Text
              className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
            >
              Annotation
            </Text>
            <Text
              className={`mt-1.5 font-mono text-[11.5px] leading-[1.7] ${colors.text}`}
            >
              {move.note ?? 'Nothing marked. This move is playing itself out.'}
            </Text>
          </View>

          <View className="mt-4 border-t pt-2.5">
            <Text
              className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
            >
              Record
            </Text>
            <View className="mt-1">
              <Field
                label="Raised"
                value={`02 Nov · game ${game?.index ?? 1}`}
              />
              <Field label="Revised" value="17 Nov · rev 3" />
            </View>
          </View>

          {siblings.length > 0 && (
            <View className="mt-4 border-t pt-2.5">
              <Text
                className={`font-sans text-[9px] uppercase tracking-[0.15em] ${colors.faint}`}
              >
                Also in this game
              </Text>
              {siblings.map((sibling) => (
                <Pressable
                  key={sibling.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open turn ${sibling.turn}: ${sibling.title}`}
                  onPress={() => onSelect?.(sibling.id)}
                  className={`flex-row items-baseline gap-2 border-b border-dotted py-2 ${colors.border}`}
                >
                  <Text className={`w-4 font-mono text-[11px] ${colors.faint}`}>
                    {sibling.turn}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className={`flex-1 font-mono text-[12px] ${colors.text}`}
                  >
                    {sibling.title}
                  </Text>
                  <Text
                    className={`font-mono text-[10px] uppercase tracking-[0.08em] ${colors.faint}`}
                  >
                    {sibling.state}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View className={`border-t-2 px-6 py-4 ${colors.strong}`}>
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              resolved ? 'Reopen this move' : 'Resolve this move'
            }
            onPress={() => onToggleResolve(move.id)}
            className={`min-h-[44px] justify-center border px-3 py-2 ${colors.strong}`}
          >
            <Text
              className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
            >
              {resolved ? 'Reopen' : 'Resolve'}
            </Text>
          </Pressable>

          {onClose && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close the move sheet"
              onPress={onClose}
              className={`min-h-[44px] justify-center border px-3 py-2 ${colors.strong}`}
            >
              <Text
                className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
              >
                Close
              </Text>
            </Pressable>
          )}

          <Text className={`ml-auto font-mono text-[10px] ${colors.faint}`}>
            {move.turn} / 8 · rev 3
          </Text>
        </View>
      </View>
    </View>
  )
}
