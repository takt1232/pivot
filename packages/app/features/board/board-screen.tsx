'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { allMoves } from '../../data/board'
import { Pressable } from '../../components/pressable'
import { useTheme } from '../../provider/theme'
import { BoardRail } from './board-rail'
import { DetailSheet } from './detail-sheet'
import { ScorePad } from './score-pad'

function CompactBar() {
  const { colors, theme, toggleTheme } = useTheme()

  return (
    <View
      className={`flex-row items-center justify-between border-b px-4 py-3 lg:hidden ${colors.border}`}
    >
      <View>
        <Text className={`font-sans text-[15px] font-semibold ${colors.text}`}>
          Pivot
        </Text>
        <Text
          className={`font-mono text-[9px] uppercase tracking-[0.16em] ${colors.faint}`}
        >
          Scoresheet · round 44
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
          {theme === 'light' ? 'Night' : 'Day'}
        </Text>
      </Pressable>
    </View>
  )
}

export function BoardScreen() {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()

  const [selectedId, setSelectedId] = useState('119')
  const [resolved, setResolved] = useState<Set<string>>(
    () => new Set<string>(['120']),
  )
  const [sheetOpen, setSheetOpen] = useState(false)

  const selectedMove =
    allMoves.find((move) => move.id === selectedId) ?? allMoves[0]!

  const select = useCallback(
    (id: string) => {
      setSelectedId(id)
      // Below the two-pane breakpoint the sheet has nowhere to live; open it.
      if (width < 1024) setSheetOpen(true)
    },
    [width],
  )

  const toggleResolve = useCallback((id: string) => {
    setResolved((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  useEffect(() => {
    if (Platform.OS !== 'web') return

    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedId((current) => {
          const index = allMoves.findIndex((move) => move.id === current)
          const step = event.key === 'ArrowDown' ? 1 : -1
          const next = (index + step + allMoves.length) % allMoves.length
          return allMoves[next]!.id
        })
      }

      if (event.key === ' ') {
        event.preventDefault()
        toggleResolve(selectedId)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedId, toggleResolve])

  return (
    <SafeAreaView style={{ flex: 1 }} className={`flex-1 ${colors.background}`}>
      <View className="flex-1 flex-row">
        <BoardRail />

        <View className={`min-w-0 flex-1 ${colors.sheet}`}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              width: '100%',
              paddingBottom: 8,
            }}
            showsVerticalScrollIndicator={false}
          >
            <CompactBar />
            <ScorePad
              selectedId={selectedId}
              resolved={resolved}
              onSelect={select}
            />
          </ScrollView>
        </View>

        <DetailSheet
          className="hidden lg:flex"
          move={selectedMove}
          resolved={resolved.has(selectedMove.id)}
          onToggleResolve={toggleResolve}
          onSelect={select}
        />
      </View>

      <Modal
        visible={sheetOpen}
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <View className={`flex-1 ${colors.background}`}>
          <SafeAreaView style={{ flex: 1 }} className={colors.background}>
            <DetailSheet
              full
              move={selectedMove}
              resolved={resolved.has(selectedMove.id)}
              onToggleResolve={toggleResolve}
              onSelect={select}
              onClose={() => setSheetOpen(false)}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
