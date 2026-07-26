

import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, cardShadow } from '../../../themes';
import { useTimetable } from "../../context/TimetableContext.tsx";


// ---- Mock data — replace with your real data source (context/API/db) ----
const TARGET_PERCENT = 75;
//const OVERALL_PERCENT = 62; // drives the ring + status label


const UP_NEXT = { name: 'DBMS', time: '10:30 AM', minsAway: 15 };

type ClassStatus = 'attended' | 'bunked' | 'present' | 'pending';

interface ClassItem {
  id: string;
  name: string;
  time: string;
  room: string;
  status: ClassStatus;
}

const INITIAL_CLASSES: ClassItem[] = [
  { id: '1', name: 'Operating Systems', time: '09:00 AM - 10:00 AM', room: 'Room 302', status: 'attended' },
  { id: '2', name: 'Data Structures', time: '10:30 AM - 11:30 AM', room: 'Lab 1', status: 'present' },
  { id: '3', name: 'Database Management', time: '12:00 PM - 01:00 PM', room: 'Room 405', status: 'pending' },
];

function statusLabel(percent: number) {
  if (percent >= 85) return 'EXCELLENT';
  if (percent >= 75) return 'GOOD';
  if (percent >= 60) return 'AT RISK';
  return 'CRITICAL';
}

// ---- Circular progress ring ----
function AttendanceRing({ percent, size = 130 }: { percent: number; size?: number }) {
  const strokeWidth = 10;
  const radiusPx = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radiusPx;
  const progress = circumference - (percent / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radiusPx}
          stroke={colors.toggleTrackOff}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radiusPx}
          stroke={colors.primary}
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
          <Text style={[typography.headlineLg, { color: colors.primary }]}>{percent}%</Text>
          <Text style={[typography.labelSm, { color: colors.secondaryText, marginTop: 4 }]}>
            {statusLabel(percent)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { schedule } = useTimetable();
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
  const allSubjects = Object.values(schedule).flat();



  const totalPresent = allSubjects.reduce(
    (sum, subject) => sum + subject.present,
    0
  );

  const totalAbsent = allSubjects.reduce(
    (sum, subject) => sum + subject.absent,
    0
  );

  const totalClasses = totalPresent + totalAbsent;

  const overallPercent =
    totalClasses === 0
      ? 100
      : Math.round((totalPresent / totalClasses) * 100);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = days[new Date().getDay()];

  const todayClasses = schedule[today] || [];



  const updateStatus = (id: string, status: ClassStatus) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  // mock — compute from your real attendance math

  const targetAttendance = 75;

  let lecturesSafeToBunk = 0;

  if (totalClasses > 0 && overallPercent >= targetAttendance) {
    lecturesSafeToBunk = Math.floor(
      totalPresent - (targetAttendance / 100) * totalClasses
    );
  }

  const todayDate = new Date();

const formattedDate = todayDate.toLocaleDateString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={10}>
          <MaterialIcons name="menu" size={24} color={colors.onSurfaceVariant} />
        </Pressable>
        <Text style={[typography.headlineMd, { color: colors.primary }]}>BunkMate</Text>
        <Pressable hitSlop={10} onPress={() => router.push('/Settings')}>
          <MaterialIcons name="settings" size={24} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >


        {/* Overall Attendance */}
        <View style={[styles.card, styles.centerCard]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[typography.headlineMd, { color: colors.primary }]}>
              Overall Attendance
            </Text>
          </View>
          <Text style={[typography.bodyMd, { color: colors.secondaryText, marginBottom: spacing.md }]}>
            Target: {TARGET_PERCENT}%
          </Text>
          <AttendanceRing percent={overallPercent} />
        </View>

        {/* Smart Bunk */}
        <View style={styles.card}>
          <Text style={[typography.headlineMd, { color: colors.primary, marginBottom: spacing.sm }]}>
            Smart Bunk
          </Text>
          <Text style={[typography.bodyLg, { color: colors.onSurface, marginBottom: spacing.sm }]}>
            Lectures Safe to Bunk
          </Text>
          <View style={styles.bunkRow}>
            <Text style={[typography.headlineLgMobile, { color: colors.primary }]}>
              {lecturesSafeToBunk}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min((lecturesSafeToBunk / 5) * 100, 100)}%` },
                ]}
              />
            </View>
          </View>
          <Text style={[typography.labelSm, { color: colors.secondaryText, marginTop: spacing.sm }]}>
            To maintain {TARGET_PERCENT}%
          </Text>
        </View>

        {/* Up Next */}
        <View style={styles.card}>
          <Text style={[typography.labelSm, { color: colors.secondaryText, marginBottom: spacing.sm }]}>
            UP NEXT
          </Text>
          <View style={styles.upNextRow}>
            <View>
              <Text style={[typography.headlineMd, { color: colors.primary }]}>{UP_NEXT.name}</Text>
              <View style={styles.rowWithIcon}>
                <MaterialIcons name="schedule" size={14} color={colors.secondaryText} />
                <Text style={[typography.bodyMd, { color: colors.secondaryText, marginLeft: 4 }]}>
                  {UP_NEXT.time} (in {UP_NEXT.minsAway}m)
                </Text>
              </View>
            </View>
            <View style={styles.upNextDot} />
          </View>
        </View>

        {/* Today's Classes */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[typography.headlineMd, { color: colors.primary }]}>Today's Classes</Text>
          <View style={styles.dateChip}>
            <Text style={[typography.labelSm, { color: colors.primary }]}>{formattedDate}</Text>
          </View>
        </View>



        {todayClasses.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={[typography.headlineMd, { color: colors.primary }]}>{item.name}</Text>
            <View style={styles.rowWithIcon}>
              <MaterialIcons name="schedule" size={14} color={colors.secondaryText} />
              <Text style={[typography.bodyMd, { color: colors.secondaryText, marginLeft: 4 }]}>
                {item.time}
              </Text>
              <MaterialIcons
                name="location-on"
                size={14}
                color={colors.secondaryText}
                style={{ marginLeft: spacing.md }}
              />
              <Text style={[typography.bodyMd, { color: colors.secondaryText, marginLeft: 4 }]}>
                {item.room}
              </Text>
            </View>

            <View style={styles.actionsRow}>
              {item.status === 'attended' ? (
                <View style={styles.attendedPill}>
                  <MaterialIcons name="check" size={16} color={colors.onSurface} />
                  <Text style={[typography.button, { color: colors.onSurface, marginLeft: 4 }]}>
                    Attended
                  </Text>
                </View>
              ) : item.status === 'present' ? (
                <>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => updateStatus(item.id, 'bunked')}
                  >
                    <Text style={[typography.button, { color: colors.onSurfaceVariant }]}>Bunk</Text>
                  </Pressable>
                  <Text style={[typography.bodyLg, { color: colors.primary, marginLeft: spacing.md }]}>
                    Present
                  </Text>
                </>
              ) : (
                <>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => updateStatus(item.id, 'bunked')}
                  >
                    <Text style={[typography.button, { color: colors.onSurfaceVariant }]}>Bunk</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, { marginLeft: spacing.md }]}
                    onPress={() => updateStatus(item.id, 'attended')}
                  >
                    <Text style={[typography.button, { color: colors.onSurfaceVariant }]}>Attended</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing['3xl'],
    gap: spacing.md,
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
  centerCard: {
    alignItems: 'center',
    paddingTop: 10,

  },
  cardHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  bunkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.toggleTrackOff,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  upNextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  upNextDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.outline,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  dateChip: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.DEFAULT,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
  },
  attendedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.DEFAULT,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    opacity: 0.6,
  },
});