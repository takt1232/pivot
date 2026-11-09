import type { PropsWithChildren } from 'react'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTheme } from '../provider/theme'

export function Screen({ children }: PropsWithChildren) {
  const { colors } = useTheme()

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className={`flex-1 ${colors.background}`}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-auto w-full max-w-2xl gap-6">{children}</View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
