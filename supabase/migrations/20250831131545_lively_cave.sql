/*
  # Re-architect Assessment Database Schema

  This migration transforms the current generic response structure into a more organized
  architecture with a parent Forms table and section-specific response tables.

  ## Changes Made

  1. **Rename responses → forms**
     - Becomes the parent table for all assessments
     - Stores high-level metadata, contact info, and document links

  2. **Drop form_answers table**
     - Replaced by section-specific tables for better data organization

  3. **Create section-specific response tables**
     - Each major form section gets its own table
     - Columns are specific to questions in that section
     - All reference parent form via form_id foreign key

  4. **Update rooms table**
     - Change response_id → form_id for consistency

  5. **Security**
     - Enable RLS on all new tables
     - Add policies for CRUD operations
*/

-- Step 1: Rename responses table to forms and update foreign key references
ALTER TABLE responses RENAME TO forms;

-- Update the rooms table foreign key reference
ALTER TABLE rooms RENAME COLUMN response_id TO form_id;

-- Drop the old foreign key constraint and add new one
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_response_id_fkey;
ALTER TABLE rooms ADD CONSTRAINT rooms_form_id_fkey FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE;

-- Update indexes to reflect new column name
DROP INDEX IF EXISTS idx_rooms_response_id;
DROP INDEX IF EXISTS idx_rooms_room_number;
CREATE INDEX idx_rooms_form_id ON rooms USING btree (form_id);
CREATE INDEX idx_rooms_room_number ON rooms USING btree (form_id, room_number);

-- Step 2: Drop the generic form_answers table (will be replaced by section-specific tables)
DROP TABLE IF EXISTS form_answers CASCADE;

-- Step 3: Create section-specific response tables

-- Basic Information Responses (Welcome & Company Information)
CREATE TABLE IF NOT EXISTS basic_info_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  role text,
  facility_location text[],
  years_operation integer,
  business_model text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Facility Layout & Design Responses
CREATE TABLE IF NOT EXISTS facility_layout_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  total_square_footage integer,
  canopy_square_footage integer,
  ceiling_height integer,
  layout_context text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contamination Control Responses
CREATE TABLE IF NOT EXISTS contamination_control_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  contamination_controls text[],
  clean_dirty_separation text,
  contamination_challenges text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lighting Systems Responses
CREATE TABLE IF NOT EXISTS lighting_systems_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  lighting_type text,
  watts_per_sqft integer,
  automation_level integer,
  lighting_challenges text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- HVAC & Climate Control Responses
CREATE TABLE IF NOT EXISTS hvac_climate_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  hvac_type text,
  temp_range_veg text,
  temp_range_flower text,
  humidity_control text,
  environmental_challenges text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Growing Cycles Responses
CREATE TABLE IF NOT EXISTS growing_cycles_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  veg_cycle_length integer,
  flower_cycle_length integer,
  harvests_per_year integer,
  staggering_strategy text,
  harvest_optimization text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sanitation Protocols Responses
CREATE TABLE IF NOT EXISTS sanitation_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  cleaning_frequency text[],
  sanitization_products text[],
  sanitation_challenges text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contamination Prevention Responses
CREATE TABLE IF NOT EXISTS contamination_prevention_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  primary_contamination_risks text[],
  ipm_strategies text[],
  monitoring_technology text[],
  prevention_strategies text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Financial Impact Assessment Responses
CREATE TABLE IF NOT EXISTS financial_impact_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  loss_percentage integer,
  major_loss_sources text[],
  unexpected_losses text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Key Performance Indicators Responses
CREATE TABLE IF NOT EXISTS kpis_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  yield_per_sqft integer,
  yield_per_watt numeric(3,1),
  cost_per_gram numeric(4,2),
  tracking_improvements text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Remediation Economics Responses
CREATE TABLE IF NOT EXISTS remediation_economics_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  remediation_methods text[],
  remediation_cost_impact integer,
  pricing_strategy_impact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Compliance Software Responses
CREATE TABLE IF NOT EXISTS compliance_software_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  compliance_platform text,
  integration_complexity integer,
  compliance_satisfaction integer,
  missing_features text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Operational Software Responses
CREATE TABLE IF NOT EXISTS operational_software_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  erp_platform text,
  operational_inefficiencies text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Final Review Responses
CREATE TABLE IF NOT EXISTS final_review_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  additional_comments text,
  follow_up_consent text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 4: Add updated_at triggers for all new tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for all section response tables
CREATE TRIGGER update_basic_info_responses_updated_at
  BEFORE UPDATE ON basic_info_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facility_layout_responses_updated_at
  BEFORE UPDATE ON facility_layout_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contamination_control_responses_updated_at
  BEFORE UPDATE ON contamination_control_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lighting_systems_responses_updated_at
  BEFORE UPDATE ON lighting_systems_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hvac_climate_responses_updated_at
  BEFORE UPDATE ON hvac_climate_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_growing_cycles_responses_updated_at
  BEFORE UPDATE ON growing_cycles_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sanitation_responses_updated_at
  BEFORE UPDATE ON sanitation_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contamination_prevention_responses_updated_at
  BEFORE UPDATE ON contamination_prevention_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_impact_responses_updated_at
  BEFORE UPDATE ON financial_impact_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpis_responses_updated_at
  BEFORE UPDATE ON kpis_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_remediation_economics_responses_updated_at
  BEFORE UPDATE ON remediation_economics_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_software_responses_updated_at
  BEFORE UPDATE ON compliance_software_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_operational_software_responses_updated_at
  BEFORE UPDATE ON operational_software_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_final_review_responses_updated_at
  BEFORE UPDATE ON final_review_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Enable RLS and create policies for all new tables

-- Basic Info Responses
ALTER TABLE basic_info_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create basic_info_responses"
  ON basic_info_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read basic_info_responses"
  ON basic_info_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update basic_info_responses"
  ON basic_info_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete basic_info_responses"
  ON basic_info_responses
  FOR DELETE
  TO anon
  USING (true);

-- Facility Layout Responses
ALTER TABLE facility_layout_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create facility_layout_responses"
  ON facility_layout_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read facility_layout_responses"
  ON facility_layout_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update facility_layout_responses"
  ON facility_layout_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete facility_layout_responses"
  ON facility_layout_responses
  FOR DELETE
  TO anon
  USING (true);

-- Contamination Control Responses
ALTER TABLE contamination_control_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contamination_control_responses"
  ON contamination_control_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read contamination_control_responses"
  ON contamination_control_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update contamination_control_responses"
  ON contamination_control_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete contamination_control_responses"
  ON contamination_control_responses
  FOR DELETE
  TO anon
  USING (true);

-- Lighting Systems Responses
ALTER TABLE lighting_systems_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create lighting_systems_responses"
  ON lighting_systems_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read lighting_systems_responses"
  ON lighting_systems_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update lighting_systems_responses"
  ON lighting_systems_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete lighting_systems_responses"
  ON lighting_systems_responses
  FOR DELETE
  TO anon
  USING (true);

-- HVAC Climate Responses
ALTER TABLE hvac_climate_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create hvac_climate_responses"
  ON hvac_climate_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read hvac_climate_responses"
  ON hvac_climate_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update hvac_climate_responses"
  ON hvac_climate_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete hvac_climate_responses"
  ON hvac_climate_responses
  FOR DELETE
  TO anon
  USING (true);

-- Growing Cycles Responses
ALTER TABLE growing_cycles_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create growing_cycles_responses"
  ON growing_cycles_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read growing_cycles_responses"
  ON growing_cycles_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update growing_cycles_responses"
  ON growing_cycles_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete growing_cycles_responses"
  ON growing_cycles_responses
  FOR DELETE
  TO anon
  USING (true);

-- Sanitation Responses
ALTER TABLE sanitation_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create sanitation_responses"
  ON sanitation_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read sanitation_responses"
  ON sanitation_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update sanitation_responses"
  ON sanitation_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete sanitation_responses"
  ON sanitation_responses
  FOR DELETE
  TO anon
  USING (true);

-- Contamination Prevention Responses
ALTER TABLE contamination_prevention_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contamination_prevention_responses"
  ON contamination_prevention_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read contamination_prevention_responses"
  ON contamination_prevention_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update contamination_prevention_responses"
  ON contamination_prevention_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete contamination_prevention_responses"
  ON contamination_prevention_responses
  FOR DELETE
  TO anon
  USING (true);

-- Financial Impact Responses
ALTER TABLE financial_impact_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create financial_impact_responses"
  ON financial_impact_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read financial_impact_responses"
  ON financial_impact_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update financial_impact_responses"
  ON financial_impact_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete financial_impact_responses"
  ON financial_impact_responses
  FOR DELETE
  TO anon
  USING (true);

-- KPIs Responses
ALTER TABLE kpis_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create kpis_responses"
  ON kpis_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read kpis_responses"
  ON kpis_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update kpis_responses"
  ON kpis_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete kpis_responses"
  ON kpis_responses
  FOR DELETE
  TO anon
  USING (true);

-- Remediation Economics Responses
ALTER TABLE remediation_economics_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create remediation_economics_responses"
  ON remediation_economics_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read remediation_economics_responses"
  ON remediation_economics_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update remediation_economics_responses"
  ON remediation_economics_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete remediation_economics_responses"
  ON remediation_economics_responses
  FOR DELETE
  TO anon
  USING (true);

-- Compliance Software Responses
ALTER TABLE compliance_software_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create compliance_software_responses"
  ON compliance_software_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read compliance_software_responses"
  ON compliance_software_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update compliance_software_responses"
  ON compliance_software_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete compliance_software_responses"
  ON compliance_software_responses
  FOR DELETE
  TO anon
  USING (true);

-- Operational Software Responses
ALTER TABLE operational_software_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create operational_software_responses"
  ON operational_software_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read operational_software_responses"
  ON operational_software_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update operational_software_responses"
  ON operational_software_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete operational_software_responses"
  ON operational_software_responses
  FOR DELETE
  TO anon
  USING (true);

-- Final Review Responses
ALTER TABLE final_review_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create final_review_responses"
  ON final_review_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read final_review_responses"
  ON final_review_responses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update final_review_responses"
  ON final_review_responses
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete final_review_responses"
  ON final_review_responses
  FOR DELETE
  TO anon
  USING (true);

-- Step 6: Create indexes for performance optimization

-- Basic Info Responses
CREATE INDEX idx_basic_info_form_id ON basic_info_responses USING btree (form_id);

-- Facility Layout Responses
CREATE INDEX idx_facility_layout_form_id ON facility_layout_responses USING btree (form_id);

-- Contamination Control Responses
CREATE INDEX idx_contamination_control_form_id ON contamination_control_responses USING btree (form_id);

-- Lighting Systems Responses
CREATE INDEX idx_lighting_systems_form_id ON lighting_systems_responses USING btree (form_id);

-- HVAC Climate Responses
CREATE INDEX idx_hvac_climate_form_id ON hvac_climate_responses USING btree (form_id);

-- Growing Cycles Responses
CREATE INDEX idx_growing_cycles_form_id ON growing_cycles_responses USING btree (form_id);

-- Sanitation Responses
CREATE INDEX idx_sanitation_form_id ON sanitation_responses USING btree (form_id);

-- Contamination Prevention Responses
CREATE INDEX idx_contamination_prevention_form_id ON contamination_prevention_responses USING btree (form_id);

-- Financial Impact Responses
CREATE INDEX idx_financial_impact_form_id ON financial_impact_responses USING btree (form_id);

-- KPIs Responses
CREATE INDEX idx_kpis_form_id ON kpis_responses USING btree (form_id);

-- Remediation Economics Responses
CREATE INDEX idx_remediation_economics_form_id ON remediation_economics_responses USING btree (form_id);

-- Compliance Software Responses
CREATE INDEX idx_compliance_software_form_id ON compliance_software_responses USING btree (form_id);

-- Operational Software Responses
CREATE INDEX idx_operational_software_form_id ON operational_software_responses USING btree (form_id);

-- Final Review Responses
CREATE INDEX idx_final_review_form_id ON final_review_responses USING btree (form_id);