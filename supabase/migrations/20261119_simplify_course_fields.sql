-- ==============================================================================
-- Migration: 20261119_simplify_course_fields.sql
-- Description: Replace separate language fields (title_ar/title_en,
--              description_ar/description_en, location_ar/location_en)
--              with unified single fields (title, description, location).
-- ==============================================================================

DO $$
BEGIN
    -- 1. Migrate title
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

    -- 2. Migrate description
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

    -- 3. Migrate location
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
