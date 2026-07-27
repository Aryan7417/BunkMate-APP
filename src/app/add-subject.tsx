import React, { useState ,useEffect } from 'react';
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
import { useRouter ,useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTimetable } from "../context/TimetableContext.tsx";
import {
  addSubjectToDB,
} from "@/storage/Database";

import { scheduleClassNotification } from "@/notifications/NotificationService";



const C = {
  background: '#141313',
  card: '#1c1b1b',
  cardBorder: '#27272A',
  divider: '#27272A',
  primary: '#ffffff',
  onPrimary: '#2f3131',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#c4c7c8',
  secondaryText: '#A1A1AA',
};

const SP = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const RADIUS = { DEFAULT: 8, lg: 16, full: 9999 };
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AddClassScreen() {
    const router = useRouter();
    //const { addSubject, updateSubject } = useTimetable();
    const params = useLocalSearchParams();

  const [subject, setSubject] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [time, setTime] = useState('');
  const [professor, setProfessor] = useState('');
  const [day, setDay] = useState(String(params.day ?? "Mon"));
  const { schedule, addSubject, updateSubject } = useTimetable();

  const isValid = subject.trim().length > 0;




useEffect(() => {
  if (params.id) {
    setSubject(String(params.name ?? ""));
    setRoomNo(String(params.room ?? ""));
    setTime(String(params.time ?? ""));
  }
}, []);

const handleSave =async () => {

 // console.log("Selected Day:", day);
//consol.log("Before Save:", schedule);

  if (!isValid) {
    Alert.alert(
      "Subject required",
      "Please enter a subject name before saving."
    );
    return;
  }
  
if (params.id) {
    updateSubject(day, {
      id: String(params.id),
      name: subject,
      room: roomNo,
      time: "08:45",
      timeRange: time,
      period: "AM",
      present: 0,
      absent: 0,
      target: 75,
    });
    //console.log("Selected Day:", day);

  } else {
    addSubject(day, {
      id: Date.now().toString(),
      name: subject,
      room: roomNo,
      time: "09:00",
      timeRange: time,
      period: "AM",
      present: 0,
      absent: 0,
      target: 75,
    });
  }

  const classTime = new Date();

// Abhi ke liye testing: 1 minute baad notification
classTime.setMinutes(classTime.getMinutes() + 1);

await scheduleClassNotification(
  subject,
  roomNo,
  classTime
);

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
            pressed && { backgroundColor: '#2a2a2a' },
          ]}
        >
          <MaterialIcons name="arrow-back" size={24} color={C.onSurfaceVariant} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Class</Text>
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
          <View style={styles.card}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="e.g. "
              placeholderTextColor={C.secondaryText}
              style={styles.input}
            />

            <Text style={[styles.label, { marginTop: SP.md }]}>Room No</Text>
            <TextInput
              value={roomNo}
              onChangeText={setRoomNo}
              placeholder="e.g. Room 302"
              placeholderTextColor={C.secondaryText}
              style={styles.input}
            />

            <Text style={[styles.label, { marginTop: SP.md }]}>Time</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="e.g. 09:00 AM - 10:30 AM"
              placeholderTextColor={C.secondaryText}
              style={styles.input}
            />

            <Text style={[styles.label, { marginTop: SP.md }]}>Professor</Text>

            <Text style={[styles.label, { marginTop: SP.md }]}>Day</Text>

<View
  style={{
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  }}
>
  {DAYS.map((d) => (
    <Pressable
      key={d}
      onPress={() => setDay(d)}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: day === d ? "#fff" : "#27272A",
      }}
    >
      <Text
        style={{
          color: day === d ? "#000" : "#fff",
          fontWeight: "600",
        }}
      >
        {d}
      </Text>
    </Pressable>
  ))}
</View>




            <TextInput
              value={professor}
              onChangeText={setProfessor}
              placeholder="e.g. Dr.bsdk sir"
              placeholderTextColor={C.secondaryText}
              style={styles.input}
            />
          </View>
        </ScrollView>

        {/* Save button */}
        <View style={styles.footer}>
          <Pressable
  onPress={() => {
    //console.warn("Button Clicked");
    handleSave();
  }}
  style={({ pressed }) => [
    styles.saveButton,
    !isValid && styles.saveButtonDisabled,
    pressed && isValid && { opacity: 0.85 },
  ]}
>
  <Text style={styles.saveButtonText}>Save Class</Text>
</Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: SP.md,
  },
  backButton: {
    padding: SP.sm,
    borderRadius: RADIUS.full,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.primary,
  },
  scrollContent: {
    paddingHorizontal: SP.md,
    paddingTop: SP.md,
    paddingBottom: SP.xl,
  },
  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: RADIUS.lg,
    padding: SP.lg,
    marginBottom: SP.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: C.primary,
  },
  input: {
    marginTop: SP.sm,
    borderWidth: 1,
    borderColor: C.cardBorder,
    borderRadius: RADIUS.DEFAULT,
    paddingHorizontal: SP.md,
    paddingVertical: 12,
    color: C.onSurface,
    fontSize: 16,
  },
  footer: {
    padding: SP.md,
    borderTopWidth: 1,
    borderTopColor: C.divider,
  },
  saveButton: {
    backgroundColor: C.primary,
    borderRadius: RADIUS.DEFAULT,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onPrimary,
  },
});