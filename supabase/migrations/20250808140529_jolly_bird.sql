/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `clerk_user_id` (text, unique, references Clerk user)
      - `name` (text, user display name)
      - `email` (text, user email)
      - `credits` (integer, carbon credits balance)
      - `total_earned` (integer, total credits earned)
      - `reports_count` (integer, number of reports filed)
      - `verified_reports` (integer, number of verified reports)
      - `recycling_score` (integer, recycling performance score)
      - `badges` (text array, earned badges)
      - `preferences` (jsonb, user preferences)
      - `email_connected` (boolean, email integration status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for public read/write access
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  credits integer DEFAULT 0,
  total_earned integer DEFAULT 0,
  reports_count integer DEFAULT 0,
  verified_reports integer DEFAULT 0,
  recycling_score integer DEFAULT 50,
  badges text[] DEFAULT '{}',
  preferences jsonb DEFAULT '{"emailNotifications": true, "smsNotifications": false, "pushNotifications": true, "automationEnabled": true, "realTimeUpdates": true}',
  email_connected boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read user profiles"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert user profiles"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update user profiles"
  ON user_profiles
  FOR UPDATE
  TO public
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_user_id ON user_profiles(clerk_user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();