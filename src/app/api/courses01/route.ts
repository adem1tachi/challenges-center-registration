import { NextRequest, NextResponse } from 'next/server';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublished,
} from '@/lib/db/store';
import { CourseInput } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('all') === 'true';

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
    const body = (await request.json()) as CourseInput;

    if (!body.title_en || !body.title_ar || !body.date || !body.time || !body.delivery_mode) {
      return NextResponse.json(
        { success: false, error: 'Missing required course fields' },
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
