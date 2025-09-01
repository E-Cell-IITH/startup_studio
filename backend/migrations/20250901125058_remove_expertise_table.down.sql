-- 1. Recreate expertise table
CREATE TABLE expertise (
    expertise_id UUID PRIMARY KEY,
    expertise TEXT UNIQUE NOT NULL
);

-- 2. Add expertise_id back to mentor_expertise
ALTER TABLE mentor_expertise
    ADD COLUMN expertise_id UUID;

-- 3. Repopulate expertise table from distinct values
INSERT INTO expertise (expertise_id, expertise)
SELECT gen_random_uuid(), DISTINCT expertise
FROM mentor_expertise;

-- 4. Update mentor_expertise.expertise_id from expertise table
UPDATE mentor_expertise me
SET expertise_id = e.expertise_id
FROM expertise e
WHERE me.expertise = e.expertise;

-- 5. Drop the expertise text column
ALTER TABLE mentor_expertise
    DROP COLUMN expertise;

-- 6. Add back foreign key
ALTER TABLE mentor_expertise
    ADD CONSTRAINT mentor_expertise_expertise_id_fkey
        FOREIGN KEY (expertise_id) REFERENCES expertise(expertise_id) ON DELETE CASCADE;
