import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { COLORS } from "../../theme/colors";

export default function TeacherAttendanceDetailScreen({ route }) {
  const { teacher } = route.params;

  const markedDates = useMemo(() => {
    const marks = {};
    teacher.records?.forEach((r) => {
      marks[r.date] = {
        selected: true,
        marked: true,
        selectedColor: r.status === "Present" ? COLORS.success : COLORS.error,
      };
    });
    return marks;
  }, [teacher.records]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{teacher.name}</Text>
      <Text style={styles.subtitle}>{teacher.branch}</Text>

      <Calendar
        markedDates={markedDates}
        theme={{
          backgroundColor: COLORS.bgLight,
          calendarBackground: COLORS.bgLight,
          todayTextColor: COLORS.highlight,
          dayTextColor: COLORS.text,
          textDisabledColor: COLORS.textMuted,
          monthTextColor: COLORS.text,
          arrowColor: COLORS.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.bgLight },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4, color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 16 },
});
