import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getStudentsAttendance } from "../../controllers/attendanceController";
import { submitBulkAttendance } from "../../controllers/attendanceController";
import { COLORS } from "../../theme/colors";
import { useAuth } from "../../contexts/AuthContext";
import { canEdit } from "../../utils/permissions";
import Toast from "react-native-toast-message";

export default function MarkAttendanceScreen({ route }) {
  const { subject, filters } = route.params;
  const { user } = useAuth();

  const [students, setStudents] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getStudentsAttendance(filters);
      const initialized = data.map((s) => ({ ...s, status: "Absent" }));
      setStudents(initialized);
    })();
  }, []);

  const toggleStatus = (id) => {
    if (!canEdit(user, "attendance")) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "Present" ? "Absent" : "Present" } : s
      )
    );
  };

  const handleSubmit = async () => {
    if (!canEdit(user, "attendance")) {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "You cannot mark attendance.",
      });
      return;
    }

    try {
      const entries = students.map((s) => ({
        student_id: s.id, // BIGINT
        subject_id: subject.id,
        date: new Date().toISOString().split("T")[0],
        status: s.status,
        marked_by: user?.id,
      }));

      await submitBulkAttendance({ entries });

      Toast.show({
        type: "success",
        text1: "Attendance Saved",
        text2: "Attendance recorded successfully.",
      });
    } catch (err) {
      console.error("submit error:", err);
      Toast.show({
        type: "error",
        text1: "Failed to Save",
        text2: err.message || "Please try again.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {subject.name} - {filters.section ? `Section ${filters.section}` : ""}
      </Text>

      <FlatList
        data={students}
        keyExtractor={(s) => s.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                borderColor: item.status === "Present" ? COLORS.success : COLORS.error,
              },
            ]}
            onPress={() => toggleStatus(item.id)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text
              style={{
                color: item.status === "Present" ? COLORS.success : COLORS.error,
                fontWeight: "600",
              }}
            >
              {item.status}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.bgLight },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  card: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: { fontSize: 16 },
  submitBtn: {
    backgroundColor: COLORS.highlight,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
