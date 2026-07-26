import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  typography,
  spacing,
  radius,
  cardShadow,
} from "../../../themes";

import { Alert } from "react-native";
import { useRouter } from "expo-router";

// ---- Mock data — replace with your real timetable data source ----
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface TimetableEntry {
  id: string;
  time: string; // e.g. "09:00 AM"
  period: "AM" | "PM";
  name: string;
  room: string;
  timeRange: string; // e.g. "09:00 - 10:30"
  isNow?: boolean;
}




export default function TimetableScreen() {
  const [schedule, setSchedule] = useState<Record<string, TimetableEntry[]>>({
    Wed: [
      {
        id: "1",
        time: "09:00",
        period: "AM",
        name: "Data Structures",
        room: "Room 302",
        timeRange: "09:00 - 10:30",
      },
      {
        id: "2",
        time: "11:00",
        period: "AM",
        name: "Operating Systems",
        room: "Lab 4",
        timeRange: "11:00 - 12:30",
        isNow: true,
      },
      {
        id: "3",
        time: "01:30",
        period: "PM",
        name: "Computer Networks",
        room: "Room 105",
        timeRange: "13:30 - 15:00",
      },
      {
        id: "4",
        time: "03:15",
        period: "PM",
        name: "Database Management",
        room: "Room 201",
        timeRange: "15:15 - 16:45",
      },
    ],
    Tue: [
      {
        id: "1",
        time: "09:00",
        period: "AM",
        name: "COA",
        room: "Room 302",
        timeRange: "09:00 - 10:30",
      },
      {
        id: "2",
        time: "11:00",
        period: "AM",
        name: "Operating Systems",
        room: "Lab 4",
        timeRange: "11:00 - 12:30",
        isNow: true,
      },
      {
        id: "3",
        time: "01:30",
        period: "PM",
        name: "DBMS",
        room: "Room 105",
        timeRange: "13:30 - 15:00",
      },
      {
        id: "4",
        time: "03:15",
        period: "PM",
        name: "MATHS",
        room: "Room 201",
        timeRange: "15:15 - 16:45",
      },
    ],
  });

  const handleAdd = () => {
    console.warn("Add Subject");
  };
  const router = useRouter();



  const handleDelete = (id: string) => {
  Alert.alert(
    "Delete Subject",
    "Are you sure?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updated = {
            ...schedule,
            [selectedDay]:
              schedule[selectedDay].filter(
                (item) => item.id !== id
              ),
          };

          setSchedule(updated);
        },
      },
    ]
  );
};


const handleEdit = (entry: TimetableEntry) => {
  // router.push({
  //   pathname: "/edit-subject",
  //   params: {
  //     id: entry.id,
  //   },
  // });
  console.warn("edit code")
};

  const [selectedDay, setSelectedDay] = useState("Wed");
  const entries = schedule[selectedDay] ?? [];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={[typography.headlineLgMobile, { color: colors.primary }]}>
          Timetable
        </Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable onPress={handleAdd}>
            <MaterialIcons name="add-circle" size={28} color={colors.primary} />
          </Pressable>

          <Pressable>
            <MaterialIcons name="edit" size={22} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      

      {/* Day selector */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayRow}
      >
        {DAYS.map((day) => {
          const active = day === selectedDay;
          return (
            <Pressable
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[styles.dayPill, active && styles.dayPillActive]}
            >
              <Text
                style={[
                  typography.button,
                  { color: active ? colors.primary : colors.onSurfaceVariant },
                ]}
              >
                {day}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Timeline */}
      <ScrollView
        contentContainerStyle={styles.timelineContent}
        showsVerticalScrollIndicator={false}
      >
        {entries.length === 0 ? (
          <Text
            style={[
              typography.bodyLg,
              { color: colors.secondaryText, padding: spacing.md },
            ]}
          >
            No classes scheduled for {selectedDay}.
          </Text>
        ) : (
          entries.map((entry, index) => (
            <View key={entry.id} style={styles.timelineRow}>
              {/* Time column */}
              <View style={styles.timeCol}>
                <Text
                  style={[
                    typography.labelSm,
                    {
                      color: entry.isNow
                        ? colors.primary
                        : colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {entry.time}
                </Text>
                <Text
                  style={[typography.labelSm, { color: colors.secondaryText }]}
                >
                  {entry.period}
                </Text>
              </View>

              {/* Dot + connecting line */}
              <View style={styles.lineCol}>
                <View style={[styles.dot, entry.isNow && styles.dotActive]} />
                {index < entries.length - 1 && (
                  <View style={styles.connectingLine} />
                )}
              </View>

              {/* Class card */}
              <View style={[styles.card, entry.isNow && styles.cardActive]}>
                {entry.isNow && (
                  <View style={styles.nowBadge}>
                    <Text
                      style={[typography.labelSm, { color: colors.primary }]}
                    >
                      Happening Now
                    </Text>
                  </View>
                )}

                <View style={styles.cardTopRow}>
                  <Text
                    style={[
                      typography.headlineMd,
                      {
                        color: colors.primary,
                        flex: 1,
                        marginRight: spacing.sm,
                      },
                    ]}
                  >
                    {entry.name}
                  </Text>
                  <View style={styles.timeChip}>
                    <Text
                      style={[typography.labelSm, { color: colors.primary }]}
                    >
                      {entry.timeRange}
                    </Text>
                  </View>
                </View>

                <View style={styles.roomRow}>
                  <MaterialIcons
                    name="location-on"
                    size={14}
                    color={colors.secondaryText}
                  />
                  <Text
                    style={[
                      typography.bodyMd,
                      { color: colors.secondaryText, marginLeft: 4 },
                    ]}
                  >
                    {entry.room}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const DOT_SIZE = 10;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dayRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  dayPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginRight: spacing.sm,
  },
  dayPillActive: {
    borderColor: colors.primary,
  },
  timelineContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing["3xl"],
  },
  timelineRow: {
    flexDirection: "row",
  },
  timeCol: {
    width: 56,
    alignItems: "flex-start",
    paddingTop: spacing.sm,
  },
  lineCol: {
    width: 24,
    alignItems: "center",
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.outline,
    marginTop: spacing.md,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: DOT_SIZE + 6,
    height: DOT_SIZE + 6,
    borderRadius: (DOT_SIZE + 6) / 2,
    marginTop: spacing.md - 3,
  },
  connectingLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.cardBorder,
    marginVertical: 4,
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...cardShadow,
  },
  cardActive: {
    borderColor: colors.primary,
  },
  nowBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  timeChip: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.DEFAULT,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  roomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
});
