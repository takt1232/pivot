import { useRouter } from 'solito/navigation'
import { Link } from 'solito/link'
import { Pressable, Text, View } from 'react-native'

import { Card } from '../../components/card'
import { Screen } from '../../components/screen'
import { Body, Caption, Heading } from '../../components/text'
import { tintClasses, users } from '../../data/users'
import { useTheme } from '../../provider/theme'

const spotlight = users[1] ?? users[0]!

export function HomeScreen() {
  const { colors, theme, toggleTheme } = useTheme()
  const router = useRouter()

  return (
    <Screen>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className={`h-10 w-10 items-center justify-center rounded-xl ${colors.accentBg}`}
          >
            <Text className={`text-lg font-black ${colors.onAccent}`}>P</Text>
          </View>
          <View>
            <Text className={`text-xl font-bold ${colors.text}`}>Pivot</Text>
            <Text className={`text-xs ${colors.faint}`}>
              one codebase · two platforms
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={toggleTheme}
          className={`rounded-full border px-3 py-2 ${colors.border} ${colors.chip}`}
        >
          <Text className={`text-xs font-semibold ${colors.text}`}>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </Text>
        </Pressable>
      </View>

      <View className="gap-2">
        <Caption>The experiment</Caption>
        <Heading>Same screens. Web and native.</Heading>
        <Body>
          This list, the routing and the theme all live in one shared package.
          Next.js renders them with react-native-web; Expo renders them with
          React Native.
        </Body>
      </View>

      <View className="gap-3">
        <Caption>People</Caption>
        {users.map((user) => (
          <Link key={user.id} href={`/users/${user.id}`}>
            <Card className="flex-row items-center gap-4">
              <View
                className={`h-12 w-12 items-center justify-center rounded-full ${
                  tintClasses[user.tint]
                }`}
              >
                <Text className="text-base font-bold text-white">
                  {user.initials}
                </Text>
              </View>
              <View className="flex-1">
                <Text className={`text-base font-semibold ${colors.text}`}>
                  {user.name}
                </Text>
                <Text className={`text-sm ${colors.muted}`}>{user.role}</Text>
              </View>
              <Text className={`text-lg ${colors.faint}`}>→</Text>
            </Card>
          </Link>
        ))}
      </View>

      <Card className="gap-3">
        <Caption>Try the router</Caption>
        <Body>
          Push a route from shared code and let each platform handle navigation.
        </Body>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/users/${spotlight.id}`)}
          className={`rounded-xl px-4 py-3 active:opacity-70 ${colors.accentBg}`}
        >
          <Text
            className={`text-center text-base font-semibold ${colors.onAccent}`}
          >
            Open {spotlight.name}
          </Text>
        </Pressable>
      </Card>

      <Text className={`text-center text-xs ${colors.faint}`}>
        Next.js 16 · Expo SDK 54 · Solito 5 · NativeWind
      </Text>
    </Screen>
  )
}
