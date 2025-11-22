import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = 'https://nronqwxtsbcjuodhkmeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yb25xd3h0c2JjanVvZGhrbWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTA2NDgsImV4cCI6MjA3NTY4NjY0OH0.Z0ymhI4vLvpD4AN-eGf1QX0nXCAlx6f7sGRnXUbWlqg'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
