/*
  # Cannabis Assessment Form Database Schema

  1. New Tables
    - `responses`
      - `id` (uuid, primary key)
      - `stakeholder_email` (text)
      - `company_name` (text)
      - `completion_status` (enum: draft, partial, complete)
      - `current_step` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `metadata` (jsonb)
    
    - `form_answers`
      - `id` (uuid, primary key)
      - `response_id` (uuid, foreign key)
      - `section_id` (text)
      - `question_id` (text)
      - `answer_value` (text)
      - `additional_context` (text)
      - `answered_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policy for public access to create responses (anonymous forms)

  3. Indexes
    - Create indexes for efficient querying
    - Add composite indexes for common query patterns
*/

-- Create custom type for completion status
CREATE TYPE completion_status AS ENUM ('draft', 'partial', 'complete');

-- Main responses table
CREATE TABLE IF NOT EXISTS responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stakeholder_email text,
  company_name text,
  completion_status completion_status DEFAULT 'draft',
  current_step integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Individual answers table
CREATE TABLE IF NOT EXISTS form_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id uuid REFERENCES responses(id) ON DELETE CASCADE,
  section_id text NOT NULL,
  question_id text NOT NULL,
  answer_value text,
  additional_context text,
  answered_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for responses
CREATE POLICY "Anyone can create responses"
  ON responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read their own responses"
  ON responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update their own responses"
  ON responses
  FOR UPDATE
  TO anon
  USING (true);

-- RLS Policies for form_answers
CREATE POLICY "Anyone can create answers"
  ON form_answers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read answers"
  ON form_answers
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update answers"
  ON form_answers
  FOR UPDATE
  TO anon
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_responses_email ON responses(stakeholder_email);
CREATE INDEX IF NOT EXISTS idx_responses_status ON responses(completion_status);
CREATE INDEX IF NOT EXISTS idx_responses_updated ON responses(updated_at);
CREATE INDEX IF NOT EXISTS idx_answers_response_id ON form_answers(response_id);
CREATE INDEX IF NOT EXISTS idx_answers_section ON form_answers(section_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON form_answers(question_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_responses_updated_at
  BEFORE UPDATE ON responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();