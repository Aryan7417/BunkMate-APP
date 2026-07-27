import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, cardShadow } from '../../../themes';
import { useTimetable } from "../../context/TimetableContext.tsx";
import { getAttendanceHistory } from "../../storage/Database";


// ---- Mock data — replace with your real analytics data source ----
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


interface SubjectPerf {
  id: string;
  name: string;
  percent: number;
}



type DayMark = 'present' | 'bunked' | null;

// Mock attendance marks keyed by "YYYY-M-D" — replace with your real
// attendance data source (e.g. fetch marks for the visible month from your DB/API).
const MOCK_MARKS: Record<string, DayMark> = {};
(function seedMockMarks() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const pattern: Record<number, DayMark> = {
    1: 'present', 3: 'bunked', 5: 'present', 9: 'present',
    12: 'present', 15: 'bunked', 20: 'present',
  };
  Object.entries(pattern).forEach(([day, mark]) => {
    MOCK_MARKS[`${y}-${m}-${day}`] = mark;
  });
})();

// ---- Weekly line chart (SVG) ----
function WeeklyChart({ values }: { values: number[] }) {
  const width = 300;
  const height = 140;
  const chartHeight = height - 20;
  const paddingX = 12;
  // const stepX = (width - paddingX * 2) / (WEEK_VALUES.length - 1);
  const stepX = (width - paddingX * 2) / (values.length - 1);

  //const points = WEEK_VALUES.map((v, i) => {
  // const points = values.map((v, i) => {
  //   const x = paddingX + i * stepX;
  //   const y = height - (v / 100) * height;
  //   return { x, y };
  // });
  const points = values.map((v, i) => {
    const x = paddingX + i * stepX;

    const y = chartHeight - (v / 100) * chartHeight + 10;

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

// ---- Functional calendar: computes real days/weekday-offset for any month ----
function CalendarGrid({ monthOffset }: { monthOffset: number }) {
  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday

  const isCurrentMonth = monthOffset === 0;
  const todayDate = today.getDate();

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
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
          const mark = MOCK_MARKS[`${year}-${month}-${day}`];
          const isSelected = isCurrentMonth && day === todayDate;
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

  const history = getAttendanceHistory();
  // console.log("Attendance History:", history);

  const { schedule } = useTimetable();
  const subjects = Object.values(schedule).flat();
  const router = useRouter();
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthLabel = viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const WEEK_LABELS = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (5 - index));

    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  });





  const WEEK_VALUES = WEEK_LABELS.map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (5 - index));

    //const day = date.toISOString().split("T")[0]
    // ;
    const day =
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const dayHistory = history.filter((item: any) => item.date === day);

    if (dayHistory.length === 0) return 0;

    const present = dayHistory.filter(
      (item: any) => item.status === "present"
    ).length;

    return Math.round((present / dayHistory.length) * 100);
  });
  console.log("Week Values:", WEEK_VALUES);
  const totalSubjects = subjects.length;

  const totalPresent = subjects.reduce(
    (sum, subject) => sum + subject.present,
    0
  );

  const totalAbsent = subjects.reduce(
    (sum, subject) => sum + subject.absent,
    0
  );

  const overallAttendance =
    totalPresent + totalAbsent === 0
      ? 0
      : Math.round(
        (totalPresent / (totalPresent + totalAbsent)) * 100
      );





  const SUBJECT_PERFORMANCE: SubjectPerf[] = subjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    percent:
      subject.present + subject.absent === 0
        ? 0
        : Math.round(
          (subject.present /
            (subject.present + subject.absent)) *
          100
        ),
  }));



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

        <View style={styles.card}>
          <Text
            style={[
              typography.headlineMd,
              { color: colors.primary, marginBottom: spacing.md },
            ]}
          >
            Overview
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <View style={{ width: "48%", marginBottom: 15 }}>
              <Text
                style={[
                  typography.labelSm,
                  { color: colors.secondaryText },
                ]}
              >
                Overall Attendance
              </Text>

              <Text
                style={[
                  typography.headlineLgMobile,
                  { color: colors.primary },
                ]}
              >
                {overallAttendance}%
              </Text>
            </View>

            <View style={{ width: "48%", marginBottom: 15 }}>
              <Text
                style={[
                  typography.labelSm,
                  { color: colors.secondaryText },
                ]}
              >
                Subjects
              </Text>

              <Text
                style={[
                  typography.headlineLgMobile,
                  { color: colors.primary },
                ]}
              >
                {totalSubjects}
              </Text>
            </View>

            <View style={{ width: "48%" }}>
              <Text
                style={[
                  typography.labelSm,
                  { color: colors.secondaryText },
                ]}
              >
                Present
              </Text>

              <Text
                style={[
                  typography.headlineLgMobile,
                  { color: "#22c55e" },
                ]}
              >
                {totalPresent}
              </Text>
            </View>

            <View style={{ width: "48%" }}>
              <Text
                style={[
                  typography.labelSm,
                  { color: colors.secondaryText },
                ]}
              >
                Absent
              </Text>

              <Text
                style={[
                  typography.headlineLgMobile,
                  { color: "#ef4444" },
                ]}
              >
                {totalAbsent}
              </Text>
            </View>
          </View>
        </View>
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
            {/* <WeeklyChart /> */}
            <WeeklyChart values={WEEK_VALUES} />
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
            <Text style={[typography.headlineMd, { color: colors.primary }]}>{monthLabel}</Text>
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
            <CalendarGrid monthOffset={monthOffset} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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