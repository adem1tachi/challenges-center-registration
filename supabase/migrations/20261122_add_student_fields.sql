-- ==============================================================================
-- Migration: Add birth_date, university, and academic_year to registrations table
-- Run this in your Supabase SQL Editor
-- ==============================================================================

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS university TEXT,
  ADD COLUMN IF NOT EXISTS academic_year TEXT;
