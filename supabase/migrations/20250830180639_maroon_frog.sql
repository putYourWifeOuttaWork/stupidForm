/*
  # Add unique constraint to form_answers table

  1. Database Changes
    - Add unique constraint on (response_id, question_id) combination
    - This enables proper upsert operations during final submission

  2. Purpose
    - Prevents duplicate answers for the same question in the same response
    - Enables ON CONFLICT clause in upsert operations
    - Maintains data integrity during form submission
*/

-- Add unique constraint to form_answers table for upsert operations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'form_answers_response_question_unique' 
    AND table_name = 'form_answers'
  ) THEN
    ALTER TABLE form_answers 
    ADD CONSTRAINT form_answers_response_question_unique 
    UNIQUE (response_id, question_id);
  END IF;
END $$;