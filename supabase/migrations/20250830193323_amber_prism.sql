/*
  # Add documentation columns to responses table

  1. Table Changes
    - Add `facility_docs` column to `responses` table (text array for file URLs)
    - Add `financial_docs` column to `responses` table (text array for file URLs)
  
  2. Notes
    - These columns will store arrays of Supabase Storage URLs
    - Default to empty arrays
    - Nullable to allow gradual migration
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'responses' AND column_name = 'facility_docs'
  ) THEN
    ALTER TABLE responses ADD COLUMN facility_docs text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'responses' AND column_name = 'financial_docs'
  ) THEN
    ALTER TABLE responses ADD COLUMN financial_docs text[] DEFAULT '{}';
  END IF;
END $$;