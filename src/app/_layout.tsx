
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TimetableProvider } from '../context/TimetableContext.tsx'
import { initDatabase } from '../storage/Database'
import { useEffect } from 'react';


export default function RootLayout() {

  useEffect(() => {
    initDatabase();
    //console.log("DATBASE")
  }, []);


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