
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TimetableProvider } from '../context/TimetableContext.tsx'
import { initDatabase } from '../storage/Database'
import { useEffect } from 'react';
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";


export default function RootLayout() {

  // useEffect(() => {
  //   initDatabase();
  //   //console.log("DATBASE")
  // }, []);
  useEffect(() => {
  initDatabase();

  async function setupNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      alert("Notification permission is required!");
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("bunkmate", {
        name: "BunkMate",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 300, 200, 300],
      });
    }
  }

  setupNotifications();
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