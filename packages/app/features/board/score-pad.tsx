import { Platform, Text, View } from 'react-native'

import { board, games } from '../../data/board'
import { useTheme } from '../../provider/theme'
import { ScoreHeader, ScoreRow } from './score-row'

type ScorePadProps = {
  selectedId: string
  resolved: Set<string>
  onSelect: (id: string) => void
}

export function ScorePad({ selectedId, resolved, onSelect }: ScorePadProps) {
  const { colors } = useTheme()
  const total = games.reduce((sum, game) => sum + game.moves.length, 0)
  const settled = resolved.size

  return (
    <View className="w-full flex-1 px-4 pt-3 lg:px-7 lg:pt-5">
      <View
        className={`flex-row items-baseline justify-between border-b pb-2 ${colors.strong}`}
      >
        <Text
          className={`font-sans text-[9.5px] font-semibold uppercase tracking-[0.15em] ${colors.faint}`}
        >
          Scoresheet — one board, one game
        </Text>
        <Text
          className={`hidden font-mono text-[10px] lg:block ${colors.faint}`}
        >
          {board.sheet} · {total - settled} moves open
        </Text>
      </View>

      <Text
        className={`mt-2 font-sans text-[27px] font-medium leading-tight tracking-[-0.02em] lg:text-[30px] ${colors.text}`}
      >
        {board.title}
      </Text>

      <View
        className={`mt-1 flex-row items-center gap-5 border-b-[2.5px] pb-3 ${colors.strong}`}
      >
        <View className="flex-row items-center gap-2">
          <View className={`h-[11px] w-[11px] ${colors.ink}`} />
          <Text className={`font-mono text-[11.5px] ${colors.muted}`}>
            white — you
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className={`h-[11px] w-[11px] border ${colors.strong}`} />
          <Text className={`font-mono text-[11.5px] ${colors.muted}`}>
            black — the week
          </Text>
        </View>
        <Text
          className={`ml-auto hidden font-mono text-[11px] lg:block ${colors.faint}`}
        >
          resumed {board.resumed}
        </Text>
      </View>

      <View className="mt-3">
        <ScoreHeader />
      </View>

      {games.map((game) => {
        const done = game.moves.filter((move) => resolved.has(move.id)).length

        return (
          <View key={game.id} className="mt-4">
            <View className="flex-row items-baseline gap-2 pb-1">
              <Text
                className={`font-mono text-[12px] font-bold ${colors.text}`}
              >
                {game.index}.
              </Text>
              <Text
                className={`font-sans text-[12px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
              >
                {game.title}
              </Text>
              <Text
                className={`ml-auto hidden font-mono text-[10px] lg:block ${colors.faint}`}
              >
                {game.moves.length} moves · {done} resolved
              </Text>
              <Text
                className={`ml-auto font-mono text-[10px] lg:hidden ${colors.faint}`}
              >
                {done}/{game.moves.length}
              </Text>
            </View>

            {game.moves.map((move) => (
              <ScoreRow
                key={move.id}
                move={move}
                resolved={resolved.has(move.id)}
                selected={selectedId === move.id}
                onSelect={onSelect}
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
            {String(settled).padStart(2, '0')}
            <Text className={`text-[11px] tracking-[0.12em] ${colors.faint}`}>
              {' '}
              / {String(total).padStart(2, '0')} resolved
            </Text>
          </Text>
          <Text
            className={`mt-2 hidden font-mono text-[10.5px] lg:block ${colors.faint}`}
          >
            annotations: ! needs a decision · ? unplanned · ✓ clean
          </Text>
        </View>

        <View className={`hidden border px-3 py-1.5 lg:flex ${colors.strong}`}>
          <Text
            className={`font-mono text-[10.5px] font-bold tracking-[0.1em] ${colors.text}`}
          >
            ROUND {board.week}
          </Text>
          <Text className={`font-mono text-[10px] ${colors.faint}`}>
            {board.span}
          </Text>
          <Text className={`font-mono text-[10px] ${colors.faint}`}>
            resumed {board.resumed}
          </Text>
        </View>
      </View>

      {Platform.OS === 'web' && (
        <Text
          className={`mb-4 mt-4 hidden font-mono text-[10px] lg:block ${colors.faint}`}
        >
          ↑↓ select · space resolve · esc close
        </Text>
      )}
    </View>
  )
}
