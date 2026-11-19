-- ==============================================================================
-- Challenges Center & Salon de l'Emploi - Consolidated Database Schema
-- Migration: 20261118_initial_schema.sql
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create courses table (Unified single fields: title, description, location)
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Workshop',
    date DATE NOT NULL,
    time TEXT NOT NULL,
    delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('in_person', 'online')),
    location TEXT NOT NULL DEFAULT '',
    meeting_url TEXT, -- Private meeting link for online sessions
    max_seats INTEGER NOT NULL CHECK (max_seats > 0),
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    instructor_name TEXT,
    instructor_title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Migration safety check: Unify bilingual legacy columns if run on an existing older database
DO $$
BEGIN
    -- Migrate title if legacy columns exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'title_ar'
    ) THEN
        ALTER TABLE courses ADD COLUMN IF NOT EXISTS title TEXT;
        UPDATE courses 
        SET title = COALESCE(NULLIF(title_ar, ''), title_en, '') 
        WHERE title IS NULL;
        ALTER TABLE courses ALTER COLUMN title SET NOT NULL;
        ALTER TABLE courses DROP COLUMN IF EXISTS title_ar;
        ALTER TABLE courses DROP COLUMN IF EXISTS title_en;
    END IF;

    -- Migrate description if legacy columns exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'description_ar'
    ) THEN
        ALTER TABLE courses ADD COLUMN IF NOT EXISTS description TEXT;
        UPDATE courses 
        SET description = COALESCE(NULLIF(description_ar, ''), description_en, '') 
        WHERE description IS NULL;
        ALTER TABLE courses ALTER COLUMN description SET NOT NULL;
        ALTER TABLE courses DROP COLUMN IF EXISTS description_ar;
        ALTER TABLE courses DROP COLUMN IF EXISTS description_en;
    END IF;

    -- Migrate location if legacy columns exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'location_ar'
    ) THEN
        ALTER TABLE courses ADD COLUMN IF NOT EXISTS location TEXT;
        UPDATE courses 
        SET location = COALESCE(NULLIF(location_ar, ''), location_en, '') 
        WHERE location IS NULL;
        ALTER TABLE courses ALTER COLUMN location SET DEFAULT '';
        ALTER TABLE courses ALTER COLUMN location SET NOT NULL;
        ALTER TABLE courses DROP COLUMN IF EXISTS location_ar;
        ALTER TABLE courses DROP COLUMN IF EXISTS location_en;
    END IF;
END $$;

-- 4. Create registrations table
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

-- 5. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_registrations_updated_at ON registrations;
CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Courses RLS Policies:
DROP POLICY IF EXISTS "Public can view published courses" ON courses;
CREATE POLICY "Public can view published courses"
    ON courses FOR SELECT
    USING (is_published = true);

DROP POLICY IF EXISTS "Admins have full access to courses" ON courses;
CREATE POLICY "Admins have full access to courses"
    ON courses FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Registrations RLS Policies:
DROP POLICY IF EXISTS "Public can insert registrations" ON registrations;
CREATE POLICY "Public can insert registrations"
    ON registrations FOR INSERT
    WITH CHECK (
        consent_privacy = true AND
        consent_terms = true AND
        consent_data_law = true AND
        status = 'new'
    );

DROP POLICY IF EXISTS "Admins have full access to registrations" ON registrations;
CREATE POLICY "Admins have full access to registrations"
    ON registrations FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_date ON courses(date);
CREATE INDEX IF NOT EXISTS idx_registrations_course_id ON registrations(course_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
