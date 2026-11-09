import '../global.css'

import { Providers } from '@pivot/app'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </Providers>
    </GestureHandlerRootView>
  )
}
