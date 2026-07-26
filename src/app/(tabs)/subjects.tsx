
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography, spacing, radius, cardShadow } from '../../../themes';

// ---- Mock data — replace with your real subjects data source ----
interface Subject {
  id: string;
  name: string;
  professor: string;
  percent: number;
  target: number;
}

const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Advanced Mathematics', professor: 'Dr. Alan Turing', percent: 65, target: 75 },
  { id: '2', name: 'Quantum Physics', professor: 'Prof. R. Feynman', percent: 88, target: 75 },
  { id: '3', name: 'Data Structures', professor: 'Mrs. Lovelace', percent: 76, target: 75 },
];

// Functional colors only — per DESIGN.md ("color used exclusively for
// functional feedback"). These three are the only non-monochrome colors
// in the whole app, used strictly for attendance status.
const STATUS = {
  critical: { color: '#EF4444', label: 'Critical', icon: 'warning' as const },
  borderline: { color: '#F59E0B', label: 'Borderline', icon: 'info' as const },
  safe: { color: '#22C55E', label: 'Safe to bunk', icon: 'check-circle' as const },
};

function getStatus(percent: number, target: number) {
  if (percent < target) return STATUS.critical;
  if (percent < target + 5) return STATUS.borderline;
  return STATUS.safe;
}

function safeToBunkCount(percent: number, target: number) {
  // Rough placeholder formula — replace with your real attendance math.
  return Math.max(0, Math.floor((percent - target) / 4));
}

function SubjectRing({ percent, color, size = 64 }: { percent: number; color: string; size?: number }) {
  const strokeWidth = 6;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = circumference - (percent / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.toggleTrackOff}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFillObject}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[typography.button, { color, fontWeight: '700' }]}>{percent}%</Text>
        </View>
      </View>
    </View>
  );
}

export default function SubjectsScreen() {
  const router = useRouter();
  const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  const handleAddSubject = () => {
    // TODO: navigate to an "Add Subject" form screen, e.g.:
    // router.push('/add-subject');
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="school" size={22} color={colors.primary} />
          <Text style={[typography.headlineMd, { color: colors.primary, marginLeft: spacing.sm }]}>
            BunkMate
          </Text>
        </View>
        <Pressable hitSlop={10} onPress={() => router.push('/Settings')}>
          <MaterialIcons name="settings" size={22} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[typography.headlineLgMobile, { color: colors.primary, marginBottom: spacing.md }]}>
          Your Subjects
        </Text>

        {subjects.map((subject) => {
          const status = getStatus(subject.percent, subject.target);
          const bunkCount = safeToBunkCount(subject.percent, subject.target);
          const isSafe = status === STATUS.safe;

          return (
            <View key={subject.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.headlineMd, { color: colors.primary }]}>
                    {subject.name}
                  </Text>
                  <View style={styles.professorRow}>
                    <MaterialIcons name="person" size={14} color={colors.secondaryText} />
                    <Text style={[typography.bodyMd, { color: colors.secondaryText, marginLeft: 4 }]}>
                      {subject.professor}
                    </Text>
                  </View>
                </View>
                <SubjectRing percent={subject.percent} color={status.color} />
              </View>

              <View style={styles.cardBottomRow}>
                <View style={[styles.statusPill, { borderColor: status.color }]}>
                  <MaterialIcons name={status.icon} size={14} color={status.color} />
                  <Text style={[typography.labelSm, { color: status.color, marginLeft: 4 }]}>
                    {isSafe ? `${status.label} (${bunkCount})` : status.label}
                  </Text>
                </View>
                <Text style={[typography.labelSm, { color: colors.secondaryText }]}>
                  Target: {subject.target}%
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Floating Add button */}
      <Pressable style={styles.fab} onPress={handleAddSubject}>
        <MaterialIcons name="add" size={24} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing['3xl'],
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
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  professorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
});