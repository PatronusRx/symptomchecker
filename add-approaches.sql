-- First, let's read the current list of approaches from SymptomSystem.json
-- We'll insert each of them as a chapter in the database

-- Insert the approach chapters
INSERT INTO chapters (title)
VALUES
  ('Approach to acute coronary syndrome'),
  ('Approach to aortic emergencies'),
  ('Approach to cardiac arrhythmias'),
  ('Approach to chest pain'),
  ('Approach to deep vein thrombosis'),
  ('Approach to dyspnea'),
  ('Approach to heart failure exacerbation'),
  ('Approach to hypertensive emergencies'),
  ('Approach to palpitations'),
  ('Approach to peripheral edema'),
  ('Approach to swollen leg'),
  ('Approach to syncope')
ON CONFLICT (title) DO NOTHING;

-- Optional: You can set chapter numbers if needed
UPDATE chapters SET chapter_number = 100 WHERE title LIKE 'Approach to%' AND chapter_number IS NULL; 