
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TimetableProvider  } from '../context/TimetableContext.tsx'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TimetableProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="Settings" />
        </Stack>
      </TimetableProvider>
    </SafeAreaProvider>
  );
}