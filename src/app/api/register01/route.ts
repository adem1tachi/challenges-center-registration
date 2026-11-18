import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createRegistration,
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
} from '@/lib/db/store';
import { RegistrationStatus } from '@/types';

// Strict registration validation schema
const registrationSchema = z.object({
  course_id: z.string().min(1, 'Course ID is required'),
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  phone: z
    .string()
    .regex(/^(0)(5|6|7)[0-9]{8}$/, 'Must be a valid Algerian phone number (e.g. 0550123456)'),
  email: z.string().email('Must be a valid email address').toLowerCase(),
  consent_privacy: z.literal(true, {
    errorMap: () => ({ message: 'Privacy policy consent is required' }),
  }),
  consent_terms: z.literal(true, {
    errorMap: () => ({ message: 'Terms & conditions consent is required' }),
  }),
  consent_data_law: z.literal(true, {
    errorMap: () => ({ message: 'Consent under Law 18-07 is required' }),
  }),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId') || undefined;
    const status = (searchParams.get('status') as RegistrationStatus) || undefined;
    const search = searchParams.get('search') || undefined;

    const registrations = await getRegistrations({ courseId, status, search });
    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.error('Error in GET /api/register01:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parseResult = registrationSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await createRegistration(parseResult.data);

    if (!result.success) {
      const statusMap: Record<string, number> = {
        COURSE_NOT_FOUND: 404,
        COURSE_CLOSED: 400,
        COURSE_FULL: 409,
        ALREADY_REGISTERED: 409,
        CONSENT_REQUIRED: 400,
      };

      return NextResponse.json(
        { success: false, error: result.error },
        { status: statusMap[result.error || ''] || 400 }
      );
    }

    return NextResponse.json(
      { success: true, registration: result.registration },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/register01:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing ID or status' },
        { status: 400 }
      );
    }

    const updated = await updateRegistrationStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, registration: updated });
  } catch (error) {
    console.error('Error in PATCH /api/register01:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing registration ID' },
        { status: 400 }
      );
    }

    const ok = await deleteRegistration(id);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('Error in DELETE /api/register01:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}
