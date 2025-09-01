-- Up Migration: Removing `ON DELETE CASCADE` from `mentor_expertise`

-- Drop the old foreign key constraints
ALTER TABLE mentor_expertise
    DROP CONSTRAINT mentor_expertise_mentor_id_fkey,
    DROP CONSTRAINT mentor_expertise_expertise_id_fkey;

-- Re-add the foreign key constraints without `ON DELETE CASCADE`
ALTER TABLE mentor_expertise
    ADD CONSTRAINT mentor_expertise_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id),
    ADD CONSTRAINT mentor_expertise_expertise_id_fkey FOREIGN KEY (expertise_id) REFERENCES expertise(expertise_id);
