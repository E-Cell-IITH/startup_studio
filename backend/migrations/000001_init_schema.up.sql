CREATE TABLE users (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    is_registered BOOLEAN DEFAULT FALSE
);

CREATE TABLE startups (
    startup_id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    startup_name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_photo_ref TEXT,
    about TEXT,
    phone_number BIGINT
);

CREATE TABLE mentors (
    mentor_id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    linked_in_url TEXT,
    profile_photo_ref TEXT,
    phone_number BIGINT,
    about TEXT
);

CREATE TABLE expertise (
    expertise_id UUID PRIMARY KEY,
    expertise TEXT UNIQUE NOT NULL
);

CREATE TABLE mentor_expertise (
    mentor_id UUID NOT NULL REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    expertise_id UUID NOT NULL REFERENCES expertise(expertise_id) ON DELETE CASCADE,
    PRIMARY KEY (mentor_id, expertise_id)
);

CREATE TABLE experience (
    experience_id UUID PRIMARY KEY,
    experience TEXT NOT NULL,
    mentor_id UUID NOT NULL REFERENCES mentors(mentor_id) ON DELETE CASCADE
);

CREATE TABLE mentorships (
    mentorship_id UUID PRIMARY KEY,
    mentor_id UUID NOT NULL REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startups(startup_id) ON DELETE CASCADE,
    UNIQUE (mentor_id, startup_id)
);

CREATE INDEX idx_mentor_expertise_expertise_id ON mentor_expertise(expertise_id);
CREATE INDEX idx_mentor_expertise_mentor_id ON mentor_expertise(mentor_id);
CREATE INDEX idx_mentorships_mentor_id ON mentorships(mentor_id);
CREATE INDEX idx_mentorships_startup_id ON mentorships(startup_id);
