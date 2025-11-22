import { supabase } from "../services/supabaseClient";

export async function resolveStudentId(appUserId) {
  const { data, error } = await supabase
    .from("students")
    .select("id")
    .eq("app_user_id", appUserId)
    .single();

  if (error) {
    console.log("resolveStudentId error:", error);
    throw new Error("Student profile not found");
  }

  return data.id; // BIGINT ID returned
}
