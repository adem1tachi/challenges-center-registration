-- ==============================================================================
-- Challenges Center & Salon de l'Emploi - Database Schema
-- Migration: 20261118_initial_schema.sql
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Workshop',
    date DATE NOT NULL,
    time TEXT NOT NULL,
    delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('in_person', 'online')),
    location_en TEXT NOT NULL,
    location_ar TEXT NOT NULL,
    meeting_url TEXT, -- Private meeting link for online sessions
    max_seats INTEGER NOT NULL CHECK (max_seats > 0),
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    instructor_name TEXT,
    instructor_title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'accepted', 'rejected', 'no_response')),
    consent_privacy BOOLEAN NOT NULL DEFAULT false,
    consent_terms BOOLEAN NOT NULL DEFAULT false,
    consent_data_law BOOLEAN NOT NULL DEFAULT false, -- Algerian Law No. 18-07
    consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Prevent duplicate registrations for the same course by the same email
    CONSTRAINT unique_course_registration UNIQUE (course_id, email)
);

-- 4. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Courses RLS Policies:
-- Public can view published courses
CREATE POLICY "Public can view published courses"
    ON courses FOR SELECT
    USING (is_published = true);

-- Authenticated admins have full access to courses
CREATE POLICY "Admins have full access to courses"
    ON courses FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Registrations RLS Policies:
-- Public can register (insert only)
CREATE POLICY "Public can insert registrations"
    ON registrations FOR INSERT
    WITH CHECK (
        consent_privacy = true AND
        consent_terms = true AND
        consent_data_law = true AND
        status = 'new'
    );

-- Admins have full access to registrations
CREATE POLICY "Admins have full access to registrations"
    ON registrations FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_date ON courses(date);
CREATE INDEX IF NOT EXISTS idx_registrations_course_id ON registrations(course_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
