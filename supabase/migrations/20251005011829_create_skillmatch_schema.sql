/*
  # SkillMatch AI Database Schema

  ## Overview
  This migration creates the complete database schema for the SkillMatch AI application,
  which helps users manage their technical skills and discover matching job opportunities.

  ## New Tables

  ### 1. `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text) - User's full name
  - `job_title` (text, nullable) - Current or desired job title
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. `skills`
  Master list of all available skills
  - `id` (uuid, primary key)
  - `name` (text, unique) - Skill name (e.g., "JavaScript", "Python")
  - `category` (text) - Skill category (e.g., "Programming", "Database", "Framework")
  - `created_at` (timestamptz) - Skill creation timestamp

  ### 3. `user_skills`
  Junction table linking users to their skills
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles.id)
  - `skill_id` (uuid, references skills.id)
  - `created_at` (timestamptz) - When user added this skill
  - Unique constraint on (user_id, skill_id) to prevent duplicates

  ### 4. `jobs`
  Job listings and opportunities
  - `id` (uuid, primary key)
  - `title` (text) - Job title
  - `company` (text) - Company name
  - `location` (text) - Job location
  - `salary_range` (text) - Salary information
  - `job_type` (text) - Employment type (Full-time, Contract, etc.)
  - `description` (text) - Job description
  - `required_skills` (text[]) - Array of required skill names
  - `is_active` (boolean) - Whether job is currently available
  - `created_at` (timestamptz) - Job posting creation timestamp
  - `updated_at` (timestamptz) - Last job posting update

  ## Security
  
  ### Row Level Security (RLS)
  All tables have RLS enabled with the following policies:

  #### profiles table:
  - Users can view their own profile
  - Users can insert their own profile (on signup)
  - Users can update their own profile
  
  #### skills table:
  - All authenticated users can view skills
  - No direct insert/update/delete (managed by admin or through user_skills)
  
  #### user_skills table:
  - Users can view their own skills
  - Users can add skills to their profile
  - Users can remove their own skills
  
  #### jobs table:
  - All authenticated users can view active jobs
  - No direct modification by users (managed by admin)

  ## Important Notes
  1. Uses `auth.uid()` for all user identification in RLS policies
  2. All timestamps use `timestamptz` with `now()` defaults
  3. Unique constraints prevent duplicate skills per user
  4. Jobs table uses array type for flexible skill matching
  5. All policies are restrictive by default - only authenticated users have access
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  job_title text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text DEFAULT 'General',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills"
  ON user_skills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add own skills"
  ON user_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON user_skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  salary_range text,
  job_type text DEFAULT 'Full-time',
  description text NOT NULL,
  required_skills text[] NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (is_active = true);

INSERT INTO skills (name, category) VALUES
  ('JavaScript', 'Programming'),
  ('TypeScript', 'Programming'),
  ('Python', 'Programming'),
  ('Java', 'Programming'),
  ('C#', 'Programming'),
  ('React', 'Framework'),
  ('Vue', 'Framework'),
  ('Angular', 'Framework'),
  ('Node.js', 'Framework'),
  ('SQL', 'Database'),
  ('PostgreSQL', 'Database'),
  ('MySQL', 'Database'),
  ('MongoDB', 'Database'),
  ('Docker', 'DevOps'),
  ('Kubernetes', 'DevOps'),
  ('AWS', 'Cloud'),
  ('Azure', 'Cloud'),
  ('Git', 'Tools')
ON CONFLICT (name) DO NOTHING;

INSERT INTO jobs (title, company, location, salary_range, job_type, description, required_skills) VALUES
  ('Frontend Developer', 'TechCorp', 'San Francisco, CA', '$70,000 - $90,000', 'Full-time', 
   'Join TechCorp as a Frontend Developer. We''re looking for someone with experience in React, JavaScript, CSS. This is a great opportunity to work with cutting-edge technologies and grow your career.',
   ARRAY['React', 'JavaScript', 'CSS']),
  
  ('Full Stack Developer', 'StartupXYZ', 'New York, NY', '$80,000 - $110,000', 'Full-time',
   'Join StartupXYZ as a Full Stack Developer. We''re looking for someone with experience in React, Node.js, SQL. This is a great opportunity to work with cutting-edge technologies and grow your career.',
   ARRAY['React', 'Node.js', 'SQL', 'JavaScript']),
  
  ('Java Developer', 'Enterprise Solutions', 'Austin, TX', '$85,000 - $120,000', 'Full-time',
   'Join Enterprise Solutions as a Java Developer. We''re looking for someone with experience in Java, SQL, Spring. This is a great opportunity to work with cutting-edge technologies and grow your career.',
   ARRAY['Java', 'SQL', 'Spring']),
  
  ('Database Administrator', 'DataFlow Inc', 'Seattle, WA', '$75,000 - $100,000', 'Full-time',
   'Join DataFlow Inc as a Database Administrator. We''re looking for someone with experience in SQL, PostgreSQL, MySQL. This is a great opportunity to work with cutting-edge technologies and grow your career.',
   ARRAY['SQL', 'PostgreSQL', 'MySQL', 'Python']),
  
  ('React Developer', 'Modern Web Co', 'Remote', '$65,000 - $85,000', 'Contract',
   'Join Modern Web Co as a React Developer. We''re looking for someone with experience in React, TypeScript, Redux. This is a great opportunity to work with cutting-edge technologies and grow your career.',
   ARRAY['React', 'TypeScript', 'Redux']),
  
  ('Software Engineer', 'Tech Innovators', 'Boston, MA', '$90,000 - $130,000', 'Full-time',
   'Join Tech Innovators as a Software Engineer. We''re looking for someone with experience in Java, Python, SQL. This is a great opportunity to work with cutting-edge technologies and grow your career.',
   ARRAY['Java', 'Python', 'SQL', 'Docker'])
ON CONFLICT DO NOTHING;