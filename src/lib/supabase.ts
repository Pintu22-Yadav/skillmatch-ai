import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  full_name: string;
  job_title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  created_at: string;
  skills?: Skill;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_range: string | null;
  job_type: string;
  description: string;
  required_skills: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
