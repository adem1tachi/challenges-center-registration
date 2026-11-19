import { NextRequest, NextResponse } from 'next/server';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublished,
} from '@/lib/db/store';
import { CourseInput } from '@/types';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/lib/auth/session';

async function requireAdminAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(token);
  return session.valid;
}

function isValidHttpsUrl(url: string | undefined | null): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // 1. Fetch single course by ID if requested
    if (id) {
      const course = await getCourseById(id);
      if (!course) {
        return NextResponse.json(
          { success: false, error: 'Course not found' },
          { status: 404 }
        );
      }
      // If course is unpublished draft, check admin auth
      if (!course.is_published) {
        const isAuthed = await requireAdminAuth(request);
        if (!isAuthed) {
          return NextResponse.json(
            { success: false, error: 'Course not found' },
            { status: 404 }
          );
        }
      }
      return NextResponse.json({ success: true, course });
    }

    const includeUnpublished = searchParams.get('all') === 'true';

    // If requesting unpublished drafts, require admin authentication
    if (includeUnpublished) {
      const isAuthed = await requireAdminAuth(request);
      if (!isAuthed) {
        // Fallback to only published courses for unauthenticated callers
        const courses = await getCourses({ publishedOnly: true });
        return NextResponse.json({ success: true, courses });
      }
    }

    const courses = await getCourses({ publishedOnly: !includeUnpublished });
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Error in GET /api/courses01:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Defense-in-depth: Course creation requires admin authentication
    const isAuthed = await requireAdminAuth(request);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بإنشاء الورشات (Unauthorized)' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CourseInput;

    if (!body.title || !body.date || !body.time || !body.delivery_mode) {
      return NextResponse.json(
        { success: false, error: 'Missing required course fields' },
        { status: 400 }
      );
    }

    // XSS / Protocol injection prevention on meeting_url
    if (body.meeting_url && !isValidHttpsUrl(body.meeting_url)) {
      return NextResponse.json(
        { success: false, error: 'Meeting URL must be a valid https:// URL' },
        { status: 400 }
      );
    }

    const course = await createCourse(body);
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/courses01:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Defense-in-depth: Course updates require admin authentication
    const isAuthed = await requireAdminAuth(request);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بتعديل الورشات (Unauthorized)' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, action, ...input } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing course ID' },
        { status: 400 }
      );
    }

    if (action === 'toggle_publish') {
      const course = await toggleCoursePublished(id);
      return NextResponse.json({ success: true, course });
    }

    if (input.meeting_url && !isValidHttpsUrl(input.meeting_url)) {
      return NextResponse.json(
        { success: false, error: 'Meeting URL must be a valid https:// URL' },
        { status: 400 }
      );
    }

    const updated = await updateCourse(id, input);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    console.error('Error in PUT /api/courses01:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Defense-in-depth: Course deletion requires admin authentication
    const isAuthed = await requireAdminAuth(request);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بحذف الورشات (Unauthorized)' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing course ID' },
        { status: 400 }
      );
    }

    const ok = await deleteCourse(id);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('Error in DELETE /api/courses01:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
