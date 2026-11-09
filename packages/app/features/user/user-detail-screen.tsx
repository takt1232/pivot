import { useRouter } from 'solito/navigation'
import { Link } from 'solito/link'
import { Platform, Text, View } from 'react-native'

import { Button } from '../../components/button'
import { Card } from '../../components/card'
import { Screen } from '../../components/screen'
import { Body, Caption, Heading } from '../../components/text'
import { getNextUser, getUser, tintClasses } from '../../data/users'
import { useTheme } from '../../provider/theme'

type UserDetailScreenProps = {
  id: string
}

export function UserDetailScreen({ id }: UserDetailScreenProps) {
  const { colors } = useTheme()
  const router = useRouter()
  const user = getUser(id)

  if (!user) {
    return (
      <Screen>
        <Caption>404</Caption>
        <Heading>No profile with id “{id}”.</Heading>
        <Link href="/">
          <Text className={`text-sm font-semibold ${colors.accent}`}>
            ← Back to all profiles
          </Text>
        </Link>
      </Screen>
    )
  }

  const nextUser = getNextUser(user.id)

  return (
    <Screen>
      <Link href="/">
        <Text className={`text-sm font-semibold ${colors.accent}`}>
          ← All profiles
        </Text>
      </Link>

      <View className="items-center gap-4 py-4">
        <View
          className={`h-24 w-24 items-center justify-center rounded-full ${
            tintClasses[user.tint]
          }`}
        >
          <Text className="text-3xl font-black text-white">
            {user.initials}
          </Text>
        </View>
        <View className="items-center gap-1">
          <Heading className="text-center">{user.name}</Heading>
          <Body className="text-center">{user.role}</Body>
        </View>
      </View>

      <Card className="gap-3">
        <Caption>About</Caption>
        <Body>{user.bio}</Body>
      </Card>

      <Card className="gap-3">
        <Caption>Route context</Caption>
        <View className="flex-row items-center justify-between">
          <Body>Rendered on</Body>
          <Text className={`text-sm font-semibold ${colors.text}`}>
            {Platform.OS}
          </Text>
        </View>
        <View className={`h-px ${colors.divider}`} />
        <View className="flex-row items-center justify-between">
          <Body>URL</Body>
          <Text className={`text-sm font-semibold ${colors.text}`}>
            /users/{user.id}
          </Text>
        </View>
      </Card>

      <Button
        label={`Next: ${nextUser.name}`}
        onPress={() => router.push(`/users/${nextUser.id}`)}
      />
    </Screen>
  )
}
