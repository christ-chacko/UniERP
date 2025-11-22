import Subject from '../models/Subject';
import { supabase } from '../services/supabaseClient';

export async function getSubjects(filters = {}) {
  const { course, branch, semester } = filters;
  let query = supabase.from('subjects').select('*');

  if (course) query = query.eq('course', course);
  if (branch) query = query.eq('branch', branch);
  if (semester) query = query.eq('semester', semester);

  const { data, error } = await query.order('name');
  if (error) throw error;
  return data.map(d => Subject.fromJSON(d));
}



export async function getSubjectsForStudent({ course, branch, semester }) {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .match({ course, branch, semester })
    .order("name");

  if (error) throw error;
  return data;
}
