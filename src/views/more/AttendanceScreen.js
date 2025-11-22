import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  getStudentsAttendance,
  getTeachers,
} from "../../controllers/attendanceController";
import { getSubjects } from "../../controllers/subjectController";
import { COLORS } from "../../theme/colors";

export default function AttendanceScreen({ navigation }) {
  const [mode, setMode] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Dropdown states
  const [course, setCourse] = useState(null);
  const [branch, setBranch] = useState(null);
  const [semester, setSemester] = useState(null);
  const [section, setSection] = useState(null);
  const [teacherCourse, setTeacherCourse] = useState(null);

  const [subject, setSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (course && branch && semester) {
      getSubjects({ course, branch, semester }).then(setSubjects);
    }
  }, [course, branch, semester]);

  const loadStudents = async () => {
    const data = await getStudentsAttendance({
      course,
      branch,
      semester,
      section,
    });
    setStudents(data);
  };

  // const loadTeachers = async () => {
  //   const data = await getTeachers(teacherBranch);
  //   setTeachers(data);
  // };

  const loadTeachers = async () => {
    if (!teacherCourse) return;
    const data = await getTeachers(teacherCourse);
    setTeachers(data);
  };

  const courseBranches = {
    btech: ["cse", "ece", "mechanical", "civil"],
    bba: ["management", "finance"],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Attendance</Text>

      {/* Toggle */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.optionBtn, mode === "student" && styles.active]}
          onPress={() => setMode("student")}
        >
          <Text style={styles.optionText}>Students</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionBtn, mode === "teacher" && styles.active]}
          onPress={() => setMode("teacher")}
        >
          <Text style={styles.optionText}>Teachers</Text>
        </TouchableOpacity>
      </View>

      {/* Students */}
      {mode === "student" && (
        <View>
          <Text style={styles.filterTitle}>Filters</Text>
          <Picker selectedValue={course} onValueChange={setCourse}>
            <Picker.Item label="Select Course" value={null} />
            <Picker.Item label="B.Tech" value="btech" />
            <Picker.Item label="BBA" value="bba" />
          </Picker>
          {course && (
            <Picker selectedValue={branch} onValueChange={setBranch}>
              <Picker.Item label="Select Branch" value={null} />
              {courseBranches[course].map((b) => (
                <Picker.Item
                  key={b}
                  label={b.charAt(0).toUpperCase() + b.slice(1)} // Capitalize nicely
                  value={b}
                />
              ))}
            </Picker>
          )}
          <Picker selectedValue={semester} onValueChange={setSemester}>
            <Picker.Item label="Select Semester" value={null} />
            <Picker.Item label="1st" value={1} />
            <Picker.Item label="2nd" value={2} />
          </Picker>
          <Picker selectedValue={section} onValueChange={setSection}>
            <Picker.Item label="Select Section" value={null} />
            <Picker.Item label="A" value="A" />
            <Picker.Item label="B" value="B" />
            <Picker.Item label="C" value="C" />
          </Picker>

          <Picker
            selectedValue={subject}
            onValueChange={(val) => setSubject(val)}
          >
            <Picker.Item label="Select Subject" value={null} />
            {subjects.map((s) => (
              <Picker.Item key={s.id} label={s.name} value={s} />
            ))}
          </Picker>

          <TouchableOpacity
            style={styles.loadBtn}
            onPress={() => {
              if (!subject) return;
              navigation.navigate("MarkAttendance", {
                subject,
                filters: { course, branch, semester, section },
              });
            }}
          >
            <Text style={styles.loadText}>Load Students</Text>
          </TouchableOpacity>

          <FlatList
            data={students}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("StudentAttendanceDetail", {
                    student: item,
                  })
                }
              >
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.percent}>{item.percentage}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Teachers */}
      {mode === "teacher" && (
        <View>
          <Text style={styles.filterTitle}>Select Course</Text>
          <Picker
            selectedValue={teacherCourse}
            onValueChange={setTeacherCourse}
          >
            <Picker.Item label="Select Course" value={null} />
            <Picker.Item label="B.Tech" value="btech" />
            <Picker.Item label="BBA" value="bba" />
          </Picker>

          <TouchableOpacity style={styles.loadBtn} onPress={loadTeachers}>
            <Text style={styles.loadText}>Load Teachers</Text>
          </TouchableOpacity>

          <FlatList
            data={teachers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("TeacherAttendanceDetail", {
                    teacher: item,
                  })
                }
              >
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.branch}>{item.branch.toUpperCase()}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.bgLight },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: COLORS.text,
  },
  row: { flexDirection: "row", marginBottom: 16 },
  optionBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 8,
  },
  active: { backgroundColor: COLORS.primary },
  optionText: { color: COLORS.text },
  filterTitle: { fontSize: 16, fontWeight: "500", marginVertical: 8 },
  loadBtn: {
    backgroundColor: COLORS.highlight,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  loadText: { color: "#fff", fontWeight: "600" },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: { fontSize: 16, fontWeight: "500", color: COLORS.text },
  branch: { fontSize: 14, color: COLORS.textMuted },
  percent: { fontSize: 14, fontWeight: "600", color: COLORS.highlight },
});
