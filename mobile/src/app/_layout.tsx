import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from '../context/auth'
import { colors } from '../theme'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerTintColor: colors.brand950,
            headerTitleStyle: { fontWeight: '700' },
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: colors.white },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="service/[id]" options={{ title: '' }} />
          <Stack.Screen name="book" options={{ title: 'Book a cleaning' }} />
          <Stack.Screen name="login" options={{ title: 'Log in' }} />
          <Stack.Screen name="signup" options={{ title: 'Create account' }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
