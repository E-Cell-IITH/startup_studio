-- Drop cascading constraints
ALTER TABLE mentor_expertise
    DROP CONSTRAINT IF EXISTS mentor_expertise_mentor_id_fkey,
    DROP CONSTRAINT IF EXISTS mentor_expertise_expertise_id_fkey;

ALTER TABLE experience
    DROP CONSTRAINT IF EXISTS experience_mentor_id_fkey;

ALTER TABLE mentorships
    DROP CONSTRAINT IF EXISTS mentorships_mentor_id_fkey;

-- Re-add without ON DELETE CASCADE
ALTER TABLE mentor_expertise
    ADD CONSTRAINT mentor_expertise_mentor_id_fkey
        FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id),
    ADD CONSTRAINT mentor_expertise_expertise_id_fkey
        FOREIGN KEY (expertise_id) REFERENCES expertise(expertise_id);

ALTER TABLE experience
    ADD CONSTRAINT experience_mentor_id_fkey
        FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id);

ALTER TABLE mentorships
    ADD CONSTRAINT mentorships_mentor_id_fkey
        FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id);
