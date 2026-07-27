import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import {
  colors,
  typography,
  spacing,
  radius,
  cardShadow,
} from "../../../themes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTimetable } from "../../context/TimetableContext.tsx";

// ---- Mock data — replace with your real subjects data source ----
interface Subject {
  id: string;
  name: string;
  professor: string;
  percent: number;
  target: number;
}



const STATUS = {
  critical: { color: "#EF4444", label: "Critical", icon: "warning" as const },
  borderline: { color: "#F59E0B", label: "Borderline", icon: "info" as const },
  safe: {
    color: "#22C55E",
    label: "Safe to bunk",
    icon: "check-circle" as const,
  },
};

function getStatus(percent: number, target: number) {
  if (percent < target) return STATUS.critical;
  if (percent < target + 5) return STATUS.borderline;
  return STATUS.safe;
}

function safeToBunkCount(percent: number, target: number) {

  return Math.max(0, Math.floor((percent - target) / 4));
}

function SubjectRing({
  percent,
  color,
  size = 64,
}: {
  percent: number;
  color: string;
  size?: number;
}) {
  const strokeWidth = 6;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const progress =
    percent >= 100
      ? 0
      : circumference - (percent / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
      <View style={StyleSheet.absoluteFill}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={[typography.button, { color, fontWeight: "700" }]}>
            {percent}%
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function SubjectsScreen() {
  const router = useRouter();
  //const [subjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  // const { schedule } = useTimetable();

  const { schedule, markPresent, markAbsent } = useTimetable();
  const subjects = Object.values(schedule).flat();

  const handleAddSubject = () => {
    router.push("/add-subject");
  };








  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="school" size={22} color={colors.primary} />
          <Text
            style={[
              typography.headlineMd,
              { color: colors.primary, marginLeft: spacing.sm },
            ]}
          >
            BunkMate
          </Text>
        </View>
        <Pressable hitSlop={10} onPress={() => router.push("/Settings")}>
          <MaterialIcons
            name="settings"
            size={22}
            color={colors.onSurfaceVariant}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            typography.headlineLgMobile,
            { color: colors.primary, marginBottom: spacing.md },
          ]}
        >
          Your Subjects
        </Text>

        {subjects.map((subject) => {

          const total = subject.present + subject.absent;

          const percent =
            total === 0
              ? 100
              : Math.round((subject.present / total) * 100);

          const status = getStatus(percent, subject.target);

          const bunkCount = safeToBunkCount(percent, subject.target);

          const isSafe = percent >= subject.target;

          return (
            <View key={subject.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[typography.headlineMd, { color: colors.primary }]}
                  >
                    {subject.name}
                  </Text>
                  <View style={styles.professorRow}>
                    <MaterialIcons
                      name="person"
                      size={14}
                      color={colors.secondaryText}
                    />
                    <Text
                      style={[
                        typography.bodyMd,
                        { color: colors.secondaryText, marginLeft: 4 },
                      ]}
                    >
                      {subject.room}
                    </Text>
                  </View>
                </View>
                <SubjectRing
                  percent={percent}
                  color={status.color}
                />


                <View style={{ marginTop: 30, }}>
                  <Text
                    style={[
                      typography.bodyMd,
                      { color: colors.secondaryText }
                    ]}
                  >
                    Present : {subject.present}
                  </Text>

                  <Text
                    style={[
                      typography.bodyMd,
                      { color: colors.secondaryText }
                    ]}
                  >
                    Absent : {subject.absent}
                  </Text>
                </View>


              </View>
              <View style={styles.cardBottomRow}>
                <View
                  style={[styles.statusPill, { borderColor: status.color }]}
                >
                  <MaterialIcons
                    name={status.icon}
                    size={14}
                    color={status.color}
                  />
                  <Text
                    style={[
                      typography.labelSm,
                      { color: status.color, marginLeft: 4 },
                    ]}
                  >
                    {isSafe ? `${status.label} (${bunkCount})` : status.label}
                  </Text>
                </View>

                <Text
                  style={[
                    typography.labelSm,
                    { color: colors.secondaryText },
                  ]}
                >
                  Target: {subject.target}%
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                <Pressable
                  onPress={() => markPresent(subject.id)}
                  style={{
                    flex: 1,
                    backgroundColor: "#22C55E",
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Present
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => markAbsent(subject.id)}
                  style={{
                    flex: 1,
                    backgroundColor: "#EF4444",
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Absent
                  </Text>
                </Pressable>
              </View>

            </View>
          );
        })}
      </ScrollView>

      {/* Floating Add button */}
      <Pressable style={styles.fab} onPress={handleAddSubject}>
        <MaterialIcons name="add" size={24} color={colors.onPrimary} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing["3xl"],
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  professorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  fab: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...cardShadow,
  },
});
