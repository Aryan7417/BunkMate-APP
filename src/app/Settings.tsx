// app/settings.tsx
// Converted 1:1 from code.html. Drop this file into your Expo Router `app/`
// folder as-is. Reached via the gear icon on your other screens, e.g.:
//   import { useRouter } from 'expo-router';
//   const router = useRouter();
//   <Pressable onPress={() => router.push('/settings')}>...gear icon...</Pressable>

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, typography, spacing, radius } from '../../themes';
import { Card } from '../../components/Card';
import { SettingsRow } from '../../components/SettingsRow';
import { Toggle } from '../../components/Toggle';
import { FontScaleSlider } from '../../components/FontScaleSlider';
import { SettingsButton } from '../../components/SettingsButtons';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const router = useRouter();

  // --- Notifications ---
  const [vibration, setVibration] = useState(true);
  const [repeatReminders, setRepeatReminders] = useState(false);

 
  const [fontScale, setFontScale] = useState(2); // 1=Small, 2=Default, 3=Large

  const handleExportData = () => {
    // TODO: wire to your actual export logic (e.g. share a JSON/CSV file)
    Alert.alert('Export Data', 'Export started.');
  };

  const handleRestoreBackup = () => {
    // TODO: wire to your actual file-picker / restore logic
    Alert.alert('Restore Backup', 'Pick a backup file to restore.');
  };

  const handleResetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your attendance data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // TODO: wire to your actual data-reset logic (clear storage/DB)
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { backgroundColor: colors.surfaceVariant },
          ]}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
        </Pressable>
        <Text style={[typography.headlineLgMobile, styles.headerTitle]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications */}
        <Card style={{ marginBottom: spacing.xl }}>
          <Text style={[typography.headlineMd, styles.sectionTitle]}>Notifications</Text>

          <SettingsRow
            title="Vibration"
            subtitle="Vibrate on attendance prompt"
            showDivider
            control={<Toggle value={vibration} onValueChange={setVibration} />}
          />
          <SettingsRow
            title="Repeat Reminders"
            subtitle="Keep reminding until logged"
            control={<Toggle value={repeatReminders} onValueChange={setRepeatReminders} />}
          />
        </Card>

        {/* Appearance */}
        <Card style={{ marginBottom: spacing.xl }}>
          <Text style={[typography.headlineMd, styles.sectionTitle]}>Appearance</Text>

          <SettingsRow
            title="Dark Mode"
            subtitle="Minimalist monochrome"
            showDivider
            control={<Toggle value={true} onValueChange={() => {}} disabled />}
          />

          <View style={{ paddingTop: spacing.md }}>
            <FontScaleSlider value={fontScale} onValueChange={setFontScale} />
          </View>
        </Card>

        {/* Data Management */}
        <Card style={{ marginBottom: spacing.xl, gap: spacing.md }}>
          <Text style={[typography.headlineMd, styles.sectionTitle]}>Data Management</Text>

          <SettingsButton
            label="Export Data"
            icon="download"
            onPress={handleExportData}
          />
          <SettingsButton
            label="Restore Backup"
            icon="upload"
            onPress={handleRestoreBackup}
          />

          <View style={styles.divider} />

          <SettingsButton
            label="Reset All Data"
            icon="delete-forever"
            variant="danger"
            onPress={handleResetAllData}
          />
        </Card>

        {/* About */}
        <View style={styles.aboutSection}>
          <View style={styles.aboutIconBox}>
            <MaterialIcons name="school" size={28} color={colors.primary} />
          </View>
          <Text style={[typography.headlineMd, { color: colors.primary, fontWeight: '700' }]}>
            BunkMate
          </Text>
          <Text style={[typography.labelSm, { color: colors.secondaryText, marginTop: 4 }]}>
            Version {APP_VERSION}
          </Text>
          <Text
            style={[
              typography.labelSm,
              {
                color: colors.inversePrimary,
                marginTop: spacing.sm,
                textTransform: 'uppercase',
                letterSpacing: 2,
              },
            ]}
          >
            Made with Precision
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: radius.full,
  },
  headerTitle: {
    color: colors.primary,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
    maxWidth: 720, // matches md:max-w-2xl container in code.html
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  aboutSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  aboutIconBox: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
});