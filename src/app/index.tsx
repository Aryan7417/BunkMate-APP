// app/index.tsx
// If YOUR actual Dashboard UI already lives in this file, do NOT replace the
// whole file — just copy the 3 marked sections below into your existing
// code: the import, the router hook, and the gear icon's onPress.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // 👈 1. ADD THIS IMPORT
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../themes';

export default function DashboardScreen() {
  const router = useRouter(); // 👈 2. ADD THIS HOOK

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={10}>
          <MaterialIcons name="menu" size={24} color={colors.onSurfaceVariant} />
        </Pressable>

        <Text style={[typography.headlineMd, { color: colors.primary }]}>BunkMate</Text>

        {/* 👇 3. THIS IS THE GEAR ICON — WIRE ITS onPress LIKE THIS */}
        <Pressable hitSlop={10} onPress={() => router.push('/Settings')}>
          <MaterialIcons name="settings" size={24} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
});