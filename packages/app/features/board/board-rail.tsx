import { Text, View } from 'react-native'

import { Pressable } from '../../components/pressable'
import { useTheme } from '../../provider/theme'

const sheets = [
  { label: 'Board', count: 1, active: true },
  { label: 'Timeline', count: 2, active: false },
  { label: 'Dashboard', count: 3, active: false },
  { label: 'Docs', count: 4, active: false },
]

const gameList = [
  { label: 'Launch v0.4', count: '44', active: true },
  { label: 'Northwind', count: '12', active: false },
  { label: 'Linear algebra', count: '06', active: false },
  { label: 'House', count: '03', active: false },
]

export function BoardRail() {
  const { colors, theme, toggleTheme } = useTheme()

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
          Scoresheet / round 44
        </Text>
      </View>

      <Text
        className={`mb-1 mt-8 font-sans text-[9px] uppercase tracking-[0.16em] ${colors.faint}`}
      >
        Sheets
      </Text>

      {sheets.map((sheet) => (
        <View
          key={sheet.label}
          className={`relative flex-row items-baseline justify-between py-1.5 ${
            sheet.active ? 'pl-2' : 'pl-[9px]'
          }`}
        >
          {sheet.active && (
            <View
              className={`absolute bottom-0 left-0 top-0 w-px ${colors.annotationBg}`}
            />
          )}
          <Text
            className={`font-sans text-[13px] ${
              sheet.active ? `font-semibold ${colors.text}` : colors.muted
            }`}
          >
            {sheet.label}
          </Text>
          <Text className={`font-mono text-[10px] ${colors.faint}`}>
            {sheet.count}
          </Text>
        </View>
      ))}

      <View className={`my-5 h-px ${colors.divider}`} />

      <Text
        className={`mb-1 font-sans text-[9px] uppercase tracking-[0.16em] ${colors.faint}`}
      >
        Games
      </Text>

      {gameList.map((game) => (
        <View
          key={game.label}
          className={`flex-row items-baseline justify-between py-1.5 ${
            game.active ? 'pl-2' : 'pl-[9px]'
          }`}
        >
          <Text
            className={`font-sans text-[13px] ${
              game.active ? `font-semibold ${colors.text}` : colors.muted
            }`}
          >
            {game.label}
          </Text>
          <Text className={`font-mono text-[10px] ${colors.faint}`}>
            {game.count}
          </Text>
        </View>
      ))}

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
          Local · 09:41{'\n'}Offline ready
        </Text>
      </View>
    </View>
  )
}
