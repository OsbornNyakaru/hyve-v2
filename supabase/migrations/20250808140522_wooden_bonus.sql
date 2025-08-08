/*
  # Create waste reports table

  1. New Tables
    - `waste_reports`
      - `id` (uuid, primary key)
      - `user_id` (text, references Clerk user ID)
      - `type` (text, waste type)
      - `location_address` (text, human readable address)
      - `location_coordinates` (point, GPS coordinates)
      - `description` (text, report description)
      - `urgency` (text, urgency level)
      - `status` (text, current status)
      - `images` (text array, image URLs)
      - `credits` (integer, carbon credits earned)
      - `ai_analysis` (jsonb, AI classification data)
      - `created_at` (timestamp)
      - `resolved_at` (timestamp, nullable)

  2. Security
    - Enable RLS on `waste_reports` table
    - Add policies for public read/write access
*/

CREATE TABLE IF NOT EXISTS waste_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  type text NOT NULL DEFAULT 'other',
  location_address text NOT NULL DEFAULT '',
  location_coordinates point,
  description text NOT NULL DEFAULT '',
  urgency text NOT NULL DEFAULT 'low',
  status text NOT NULL DEFAULT 'pending',
  images text[] DEFAULT '{}',
  credits integer DEFAULT 0,
  ai_analysis jsonb,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE waste_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read waste reports"
  ON waste_reports
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert waste reports"
  ON waste_reports
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update waste reports"
  ON waste_reports
  FOR UPDATE
  TO public
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_waste_reports_user_id ON waste_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_waste_reports_status ON waste_reports(status);
CREATE INDEX IF NOT EXISTS idx_waste_reports_created_at ON waste_reports(created_at DESC);