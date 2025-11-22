import { supabase } from "../services/supabaseClient";
import { resolveStudentId } from "../helpers/studentResolver";

// For teacher: fetch students + attendance
export async function getStudentsAttendance(filters = {}) {
  const { course, branch, semester, section } = filters;

  const { data: students, error: sErr } = await supabase
    .from("students")
    .select("*")
    .match({ course, branch, semester, section });

  if (sErr) throw sErr;
  if (!students.length) return [];

  const studentIds = students.map((s) => s.id);

  const { data: records, error: rErr } = await supabase
    .from("attendance")
    .select("*")
    .in("student_id", studentIds);

  if (rErr) throw rErr;

  const grouped = {};
  records.forEach((r) => {
    if (!grouped[r.student_id]) grouped[r.student_id] = [];
    grouped[r.student_id].push(r);
  });

  return students.map((s) => ({
    ...s,
    records: grouped[s.id] || [],
  }));
}

// Teacher fetch teachers by course
export async function getTeachers(course) {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("course", course);

  if (error) throw error;
  return data;
}

// Teacher submit attendance
export async function submitBulkAttendance({ entries }) {
  const { data, error } = await supabase
    .from("attendance")
    .upsert(entries, {
      onConflict: ["student_id", "subject_id", "date"],
    });

  if (error) throw error;
  return data;
}

// Student: fetch attendance for subject
export async function getStudentAttendanceBySubject({
  student_id,
  subject_id,
}) {
  const { data, error } = await supabase
    .from("attendance")
    .select("date, status")
    .eq("student_id", student_id)
    .eq("subject_id", subject_id)
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
}

// Student: fetch all subjects + attendance summary
export async function getStudentAttendanceOverview(appUserId) {
  // First convert UUID → BIGINT
  const studentId = await resolveStudentId(appUserId);

  // Fetch subjects
  const { data: subjects, error: subjErr } = await supabase
    .from("subjects")
    .select("*");

  if (subjErr) throw subjErr;

  // Fetch attendance
  const { data: records, error: recErr } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", studentId);

  if (recErr) throw recErr;

  return { studentId, subjects, records };
}
