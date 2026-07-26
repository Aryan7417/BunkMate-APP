// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { colors, typography, spacing } from '../../../themes';

// export default function AnalyticsScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={[typography.headlineLgMobile, { color: colors.primary, padding: spacing.md }]}>Weekly Attendance</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background } });


import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { colors, typography, spacing, radius, cardShadow } from '../../../themes';

// ---- Mock data — replace with your real analytics data source ----
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_VALUES = [25, 55, 45, 80, 60, 90]; // percent, 0-100

interface SubjectPerf {
  id: string;
  name: string;
  percent: number;
}

const SUBJECT_PERFORMANCE: SubjectPerf[] = [
  { id: '1', name: 'Data Structures', percent: 85 },
  { id: '2', name: 'Algorithms', percent: 62 },
  { id: '3', name: 'Operating Systems', percent: 45 },
  { id: '4', name: 'Database Systems', percent: 92 },
];

type DayMark = 'present' | 'bunked' | null;

const MONTH_NAME = 'November 2023';
const CALENDAR_DAYS = 30;
const START_WEEKDAY = 3; // Nov 1, 2023 was a Wednesday (0 = Sunday)
const SELECTED_DATE = 9;

// Mock mark data: date -> status
const DAY_MARKS: Record<number, DayMark> = {
  1: 'present',
  3: 'bunked',
  5: 'present',
  9: 'present',
  12: 'present',
  15: 'bunked',
  20: 'present',
};

// ---- Weekly line chart (SVG) ----
function WeeklyChart() {
  const width = 300;
  const height = 140;
  const paddingX = 12;
  const stepX = (width - paddingX * 2) / (WEEK_VALUES.length - 1);

  const points = WEEK_VALUES.map((v, i) => {
    const x = paddingX + i * stepX;
    const y = height - (v / 100) * height;
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View>
      <View style={styles.chartYAxis}>
        {[100, 75, 50, 25].map((label) => (
          <Text key={label} style={[typography.labelSm, { color: colors.secondaryText }]}>
            {label}%
          </Text>
        ))}
      </View>
      <Svg width={width} height={height}>
        {[0, 0.25, 0.5, 0.75].map((f) => (
          <Line
            key={f}
            x1={0}
            y1={height * f}
            x2={width}
            y2={height * f}
            stroke={colors.divider}
            strokeWidth={1}
          />
        ))}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={colors.primary}
          strokeWidth={2}
        />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill={colors.primary} />
        ))}
      </Svg>
      <View style={styles.chartXAxis}>
        {WEEK_LABELS.map((label) => (
          <Text key={label} style={[typography.labelSm, { color: colors.secondaryText }]}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function CalendarGrid() {
  const cells: (number | null)[] = [
    ...Array(START_WEEKDAY).fill(null),
    ...Array.from({ length: CALENDAR_DAYS }, (_, i) => i + 1),
  ];

  const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View>
      <View style={styles.calendarWeekdayRow}>
        {weekdayLabels.map((d, i) => (
          <Text key={i} style={[typography.labelSm, styles.calendarCell, { color: colors.secondaryText }]}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {cells.map((day, i) => {
          if (day === null) return <View key={i} style={styles.calendarCell} />;
          const mark = DAY_MARKS[day];
          const isSelected = day === SELECTED_DATE;
          return (
            <View key={i} style={styles.calendarCell}>
              <View style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}>
                <Text
                  style={[
                    typography.bodyMd,
                    { color: isSelected ? colors.onPrimary : colors.onSurface },
                  ]}
                >
                  {day}
                </Text>
              </View>
              {mark && !isSelected && (
                <View
                  style={[
                    styles.markDot,
                    { backgroundColor: mark === 'present' ? colors.primary : colors.outline },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.markDot, { backgroundColor: colors.primary, position: 'relative' }]} />
          <Text style={[typography.labelSm, { color: colors.secondaryText, marginLeft: 6 }]}>
            Present
          </Text>
        </View>
        <View style={[styles.legendItem, { marginLeft: spacing.md }]}>
          <View style={[styles.markDot, { backgroundColor: colors.outline, position: 'relative' }]} />
          <Text style={[typography.labelSm, { color: colors.secondaryText, marginLeft: 6 }]}>
            Bunked
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const [monthOffset, setMonthOffset] = useState(0); // TODO: wire to real month navigation

  return (
    <View style={styles.screen}>
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
        {/* Weekly Attendance */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={[typography.headlineMd, { color: colors.primary }]}>
              Weekly Attendance
            </Text>
            <View style={styles.weekChip}>
              <Text style={[typography.labelSm, { color: colors.primary }]}>This Week</Text>
            </View>
          </View>
          <View style={{ marginTop: spacing.md }}>
            <WeeklyChart />
          </View>
        </View>

        {/* Subject Performance */}
        <View style={styles.card}>
          <Text style={[typography.headlineMd, { color: colors.primary, marginBottom: spacing.md }]}>
            Subject Performance
          </Text>
          {SUBJECT_PERFORMANCE.map((s) => (
            <View key={s.id} style={{ marginBottom: spacing.md }}>
              <View style={styles.subjectRow}>
                <Text style={[typography.bodyLg, { color: colors.onSurface }]}>{s.name}</Text>
                <Text style={[typography.bodyMd, { color: colors.secondaryText }]}>{s.percent}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${s.percent}%` }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Calendar */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={[typography.headlineMd, { color: colors.primary }]}>{MONTH_NAME}</Text>
            <View style={styles.monthNav}>
              <Pressable hitSlop={8} onPress={() => setMonthOffset((m) => m - 1)}>
                <MaterialIcons name="chevron-left" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
              <Pressable hitSlop={8} onPress={() => setMonthOffset((m) => m + 1)}>
                <MaterialIcons name="chevron-right" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
            </View>
          </View>
          <View style={{ marginTop: spacing.md }}>
            <CalendarGrid />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const CELL_SIZE = 40;

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
  weekChip: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  chartYAxis: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 140,
    justifyContent: 'space-between',
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressTrack: {
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
  monthNav: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  calendarWeekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: colors.primary,
  },
  markDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  legendRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});