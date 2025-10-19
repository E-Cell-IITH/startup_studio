ALTER TABLE startups 
ALTER COLUMN approval_status SET DEFAULT false;

UPDATE startups 
SET approval_status = false 
WHERE approval_status IS NULL;
