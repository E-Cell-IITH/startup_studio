-- 1. Add expertise column to mentor_expertise
ALTER TABLE mentor_expertise
    ADD COLUMN expertise TEXT;

-- 2. Backfill expertise from the expertise table
UPDATE mentor_expertise me
SET expertise = e.expertise
FROM expertise e
WHERE me.expertise_id = e.expertise_id;

-- 3. Drop old foreign key + column
ALTER TABLE mentor_expertise
    DROP CONSTRAINT mentor_expertise_expertise_id_fkey,
    DROP COLUMN expertise_id;

-- 4. Make expertise required
ALTER TABLE mentor_expertise
    ALTER COLUMN expertise SET NOT NULL;

-- 5. Drop global expertise table (no longer needed)
DROP TABLE expertise;
