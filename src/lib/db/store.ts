import { Course, CourseInput, Registration, RegistrationInput, RegistrationStatus } from '@/types';
import { INITIAL_COURSES, INITIAL_REGISTRATIONS } from './seed-data';

// In-memory persistent state (persists across requests during server runtime)
declare global {
  // eslint-disable-next-line no-var
  var __coursesStore: Course[] | undefined;
  // eslint-disable-next-line no-var
  var __registrationsStore: Registration[] | undefined;
}

if (!global.__coursesStore) {
  global.__coursesStore = JSON.parse(JSON.stringify(INITIAL_COURSES));
}

if (!global.__registrationsStore) {
  global.__registrationsStore = JSON.parse(JSON.stringify(INITIAL_REGISTRATIONS));
}

function getCoursesState(): Course[] {
  return global.__coursesStore!;
}

function getRegistrationsState(): Registration[] {
  return global.__registrationsStore!;
}

export async function getCourses(options?: { publishedOnly?: boolean }): Promise<Course[]> {
  const courses = getCoursesState();
  const registrations = getRegistrationsState();

  const filtered = options?.publishedOnly
    ? courses.filter(c => c.is_published)
    : courses;

  return filtered.map(course => {
    const courseRegs = registrations.filter(r => r.course_id === course.id);
    const accepted_count = courseRegs.filter(r => r.status === 'accepted').length;
    const total_registered = courseRegs.length;
    return {
      ...course,
      accepted_count,
      total_registered,
    };
  });
}

export async function getCourseById(id: string): Promise<Course | null> {
  const courses = getCoursesState();
  const registrations = getRegistrationsState();

  const course = courses.find(c => c.id === id);
  if (!course) return null;

  const courseRegs = registrations.filter(r => r.course_id === course.id);
  const accepted_count = courseRegs.filter(r => r.status === 'accepted').length;
  const total_registered = courseRegs.length;

  return {
    ...course,
    accepted_count,
    total_registered,
  };
}

export async function createCourse(input: CourseInput): Promise<Course> {
  const newCourse: Course = {
    id: `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category || 'General Workshop',
    date: input.date,
    time: input.time.trim(),
    delivery_mode: input.delivery_mode,
    location: (input.location || '').trim(),
    meeting_url: input.delivery_mode === 'online' ? input.meeting_url || null : null,
    max_seats: Number(input.max_seats) || 30,
    is_published: input.is_published ?? true,
    is_featured: input.is_featured ?? false,
    instructor_name: input.instructor_name?.trim() || null,
    instructor_title: input.instructor_title?.trim() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    accepted_count: 0,
    total_registered: 0,
  };

  const courses = getCoursesState();
  courses.unshift(newCourse);
  return newCourse;
}

export async function updateCourse(id: string, input: Partial<CourseInput>): Promise<Course | null> {
  const courses = getCoursesState();
  const index = courses.findIndex(c => c.id === id);
  if (index === -1) return null;

  const current = courses[index];
  const updated: Course = {
    ...current,
    ...input,
    title: input.title !== undefined ? input.title.trim() : current.title,
    description: input.description !== undefined ? input.description.trim() : current.description,
    location: input.location !== undefined ? input.location.trim() : current.location,
    meeting_url: input.delivery_mode === 'online' ? input.meeting_url ?? current.meeting_url : null,
    max_seats: input.max_seats !== undefined ? Number(input.max_seats) : current.max_seats,
    updated_at: new Date().toISOString(),
  };

  courses[index] = updated;
  return getCourseById(id);
}

export async function deleteCourse(id: string): Promise<boolean> {
  const courses = getCoursesState();
  const regStore = getRegistrationsState();

  const initialLen = courses.length;
  global.__coursesStore = courses.filter(c => c.id !== id);

  // Cascade delete registrations
  global.__registrationsStore = regStore.filter(r => r.course_id !== id);

  return global.__coursesStore.length < initialLen;
}

export async function toggleCoursePublished(id: string): Promise<Course | null> {
  const courses = getCoursesState();
  const course = courses.find(c => c.id === id);
  if (!course) return null;

  course.is_published = !course.is_published;
  course.updated_at = new Date().toISOString();
  return getCourseById(id);
}

export async function getRegistrations(options?: {
  courseId?: string;
  status?: RegistrationStatus;
  search?: string;
}): Promise<Registration[]> {
  const registrations = getRegistrationsState();
  const courses = getCoursesState();

  let results = [...registrations];

  if (options?.courseId && options.courseId !== 'all') {
    results = results.filter(r => r.course_id === options.courseId);
  }

  if (options?.status && options.status !== ('all' as RegistrationStatus)) {
    results = results.filter(r => r.status === options.status);
  }

  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    results = results.filter(
      r =>
        r.first_name.toLowerCase().includes(q) ||
        r.last_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q)
    );
  }

  // Attach course info
  return results.map(reg => ({
    ...reg,
    course: courses.find(c => c.id === reg.course_id),
  }));
}

export async function createRegistration(
  input: RegistrationInput
): Promise<{ success: boolean; registration?: Registration; error?: string }> {
  const course = await getCourseById(input.course_id);
  if (!course) {
    return { success: false, error: 'COURSE_NOT_FOUND' };
  }

  if (!course.is_published) {
    return { success: false, error: 'COURSE_CLOSED' };
  }

  if ((course.accepted_count ?? 0) >= course.max_seats) {
    return { success: false, error: 'COURSE_FULL' };
  }

  // Duplicate email check
  const registrations = getRegistrationsState();
  const cleanEmail = input.email.trim().toLowerCase();
  const existing = registrations.find(
    r => r.course_id === input.course_id && r.email.toLowerCase() === cleanEmail
  );

  if (existing) {
    return { success: false, error: 'ALREADY_REGISTERED' };
  }

  // Check mandatory consent
  if (!input.consent_privacy || !input.consent_terms || !input.consent_data_law) {
    return { success: false, error: 'CONSENT_REQUIRED' };
  }

  const newReg: Registration = {
    id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    course_id: input.course_id,
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    phone: input.phone.trim(),
    email: cleanEmail,
    status: 'new',
    consent_privacy: true,
    consent_terms: true,
    consent_data_law: true,
    consent_timestamp: new Date().toISOString(),
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    course,
  };

  registrations.unshift(newReg);

  return { success: true, registration: newReg };
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
  notes?: string | null
): Promise<Registration | null> {
  const registrations = getRegistrationsState();
  const reg = registrations.find(r => r.id === id);
  if (!reg) return null;

  reg.status = status;
  if (notes !== undefined) {
    reg.notes = notes;
  }
  reg.updated_at = new Date().toISOString();

  const courses = getCoursesState();
  reg.course = courses.find(c => c.id === reg.course_id);
  return reg;
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const registrations = getRegistrationsState();
  const initialLen = registrations.length;
  global.__registrationsStore = registrations.filter(r => r.id !== id);
  return global.__registrationsStore.length < initialLen;
}
