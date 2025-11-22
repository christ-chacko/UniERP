import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
import { useAuth } from "../../contexts/AuthContext";
import { getSubjectsForStudent } from "../../controllers/subjectController";
import { getStudentAttendanceBySubject } from "../../controllers/attendanceController";
import { resolveStudentId } from "../../helpers/studentResolver";
import { COLORS } from "../../theme/colors";
import { supabase } from "../../services/supabaseClient";


export default function StudentAttendanceScreen() {
  const { user } = useAuth();

  const [studentId, setStudentId] = useState(null); // BIGINT
  const [studentInfo, setStudentInfo] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Step 1 — Load student BIGINT ID + profile
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const sid = await resolveStudentId(user.id); // UUID -> BIGINT
        setStudentId(sid);

        const { data, error } = await supabase
          .from("students")
          .select("id, course, branch, semester, section")
          .eq("id", sid)
          .single();

        if (error) throw error;

        setStudentInfo(data);

        const subj = await getSubjectsForStudent({
          course: data.course,
          branch: data.branch,
          semester: data.semester,
        });

        setSubjects(subj);
      } catch (err) {
        console.error("load student error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  // Step 2 — load attendance when subject selected
  useEffect(() => {
    if (selectedSubject && studentId) loadAttendance();
  }, [selectedSubject, studentId]);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const records = await getStudentAttendanceBySubject({
        student_id: studentId,
        subject_id: selectedSubject,
      });

      setAttendanceRecords(records);

      calculatePercentage(records);
    } catch (err) {
      console.error("attendance error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (records) => {
    if (!records.length) return setPercentage(0);

    const present = records.filter((r) => r.status === "Present").length;

    const pct = ((present / records.length) * 100).toFixed(1);
    setPercentage(pct);
  };

  const markedDates = useMemo(() => {
    const marks = {};
    attendanceRecords.forEach((r) => {
      marks[r.date] = {
        selected: true,
        marked: true,
        selectedColor: r.status === "Present" ? COLORS.success : COLORS.error,
      };
    });
    return marks;
  }, [attendanceRecords]);

  if (loading && !studentInfo) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {studentInfo && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Course: {studentInfo.course?.toUpperCase()}</Text>
          <Text style={styles.infoText}>Branch: {studentInfo.branch?.toUpperCase()}</Text>
          <Text style={styles.infoText}>Semester: {studentInfo.semester}</Text>
          <Text style={styles.infoText}>Section: {studentInfo.section}</Text>
        </View>
      )}

      <Text style={styles.label}>Select Subject</Text>

      <Picker
        selectedValue={selectedSubject}
        onValueChange={(v) => setSelectedSubject(v)}
      >
        <Picker.Item label="Select Subject" value={null} />
        {subjects.map((s) => (
          <Picker.Item key={s.id} label={s.name} value={s.id} />
        ))}
      </Picker>

      {selectedSubject && !loading && (
        <>
          <Text style={styles.sectionTitle}>Attendance Calendar</Text>

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

          <View style={styles.statsBox}>
            <Text style={styles.percentLabel}>
              Attendance Percentage:
              <Text
                style={{
                  color:
                    percentage >= 75
                      ? COLORS.success
                      : percentage > 0
                      ? COLORS.error
                      : COLORS.textMuted,
                  fontWeight: "700",
                }}
              >
                {" "}
                {percentage ? `${percentage}%` : "N/A"}
              </Text>
            </Text>
          </View>
        </>
      )}

      {loading && selectedSubject && (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 16 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.bgLight },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoBox: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  infoText: { color: COLORS.text, fontSize: 14, marginVertical: 2 },
  label: { fontWeight: "600", fontSize: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginVertical: 12 },
  statsBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
  },
  percentLabel: { fontSize: 16, color: COLORS.text },
});
