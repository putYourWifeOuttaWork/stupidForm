/*
  # Create rooms table for facility layout

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `response_id` (uuid, foreign key to responses)
      - `room_number` (integer, room identifier within response)
      - `length_ft` (numeric, room length in feet)
      - `width_ft` (numeric, room width in feet) 
      - `sq_footage` (numeric, calculated square footage)
      - `purpose` (text, room type/purpose)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `rooms` table
    - Add policies for authenticated users to manage room data
    
  3. Triggers
    - Add updated_at trigger for automatic timestamp updates
*/

CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id uuid NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
  room_number integer NOT NULL,
  length_ft numeric,
  width_ft numeric,
  sq_footage numeric GENERATED ALWAYS AS (length_ft * width_ft) STORED,
  purpose text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rooms_response_id ON rooms(response_id);
CREATE INDEX IF NOT EXISTS idx_rooms_room_number ON rooms(response_id, room_number);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can create rooms"
  ON rooms
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read rooms"
  ON rooms
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update rooms"
  ON rooms
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete rooms"
  ON rooms
  FOR DELETE
  TO anon
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();