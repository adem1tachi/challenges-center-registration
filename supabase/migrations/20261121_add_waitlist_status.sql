-- ==============================================================================
-- Migration: Add 'waitlist' status to registrations table
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- Drop the existing CHECK constraint on status
ALTER TABLE registrations
  DROP CONSTRAINT IF EXISTS registrations_status_check;

-- Re-add it with 'waitlist' included
ALTER TABLE registrations
  ADD CONSTRAINT registrations_status_check
  CHECK (status IN ('new', 'accepted', 'rejected', 'no_response', 'waitlist'));
