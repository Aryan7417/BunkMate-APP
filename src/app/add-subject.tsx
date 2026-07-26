import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, cardShadow } from '../../themes'; // 👈 adjust path to match your project (see note below)

// NOTE ON IMPORT PATH: your other screens use '../../../themes' (3 levels up)
// because they live in src/app/(tabs)/. This file sits directly in
// src/app/ (NOT inside (tabs)), same level as settings.tsx, so it needs
// ONE FEWER '../' than your tab screens. If your themes folder is at
// src/themes, '../../themes' is correct here. Double check against how
// settings.tsx imports theme in your project and match that.

const TARGET_OPTIONS = [65, 70, 75, 80, 85];

export default function AddSubjectScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [target, setTarget] = useState(75);

  const isValid = name.trim().length > 0;

  const handleSave = () => {
    if (!isValid) {
      Alert.alert('Subject name required', 'Please enter a subject name before saving.');
      return;
    }

    // TODO: wire this to your real data layer (context/AsyncStorage/API), e.g.:
    // addSubject({ name: name.trim(), professor: professor.trim(), target });

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
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
        <Text style={[typography.headlineLgMobile, styles.headerTitle]}>Add Subject</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Subject Details card */}
          <View style={styles.card}>
            <Text style={styles.label}>Subject Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Advanced Mathematics"
              placeholderTextColor={`${colors.secondaryText}80`}
              style={styles.input}
            />

            <Text style={[styles.label, { marginTop: spacing.md }]}>Professor</Text>
            <TextInput
              value={professor}
              onChangeText={setProfessor}
              placeholder="e.g. Dr. Alan Turing"
              placeholderTextColor={`${colors.secondaryText}80`}
              style={styles.input}
            />
          </View>

          {/* Target attendance card */}
          <View style={styles.card}>
            <Text style={styles.label}>Target Attendance</Text>
            <Text style={[typography.bodyMd, { color: colors.secondaryText, marginTop: 2, marginBottom: spacing.md }]}>
              Minimum attendance you want to maintain
            </Text>

            <View style={styles.targetRow}>
              {TARGET_OPTIONS.map((option) => {
                const active = option === target;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setTarget(option)}
                    style={[styles.targetChip, active && styles.targetChipActive]}
                  >
                    <Text
                      style={[
                        typography.button,
                        { color: active ? colors.onPrimary : colors.onSurface },
                      ]}
                    >
                      {option}%
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Save button */}
        <View style={styles.footer}>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveButton,
              !isValid && styles.saveButtonDisabled,
              pressed && isValid && { opacity: 0.85 },
            ]}
          >
            <Text style={[typography.button, { color: colors.onPrimary }]}>Save Subject</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    height: 56,
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
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  label: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  input: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.DEFAULT,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.onSurface,
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: 16,
  },
  targetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  targetChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  targetChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.DEFAULT,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
});