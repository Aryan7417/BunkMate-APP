// import { Stack } from 'expo-router';

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" />
//       <Stack.Screen name="Settings" />
//     </Stack>
//   );
// }

// import { Stack } from 'expo-router';
//  import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { View } from 'react-native';

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="(tabs)" />
//         <Stack.Screen name="Settings" />
//       </Stack>
//     </SafeAreaProvider>
//   );
// }

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="Settings" />
      </Stack>
    </SafeAreaProvider>
  );
}