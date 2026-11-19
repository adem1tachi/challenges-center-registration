import { Course, CourseInput, Registration, RegistrationInput, RegistrationStatus } from '@/types';
import { INITIAL_COURSES, INITIAL_REGISTRATIONS } from './seed-data';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Polyfill WebSocket in Node runtime to avoid @supabase/realtime error in Node 20
if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class DummyWebSocket {};
}

// In-memory fallback persistent state
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

// Supabase Client Singleton for DB operations
let _supabaseClient: SupabaseClient | null | undefined;

function getSupabase(): SupabaseClient | null {
  if (_supabaseClient !== undefined) {
    return _supabaseClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    _supabaseClient = null;
    return null;
  }

  try {
    _supabaseClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return _supabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    _supabaseClient = null;
    return null;
  }
}

// ==============================================================================
// Course Operations
// ==============================================================================

export async function getCourses(options?: { publishedOnly?: boolean }): Promise<Course[]> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      let query = supabase
        .from('courses')
        .select('*, registrations(id, status)')
        .order('date', { ascending: true })
        .order('created_at', { ascending: true });

      if (options?.publishedOnly) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;

      if (!error && data) {
        return data.map((c: any) => {
          const regs = c.registrations || [];
          const accepted_count = regs.filter((r: any) => r.status === 'accepted').length;
          const total_registered = regs.length;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { registrations, ...courseData } = c;
          return {
            ...courseData,
            accepted_count,
            total_registered,
          };
        });
      }
      console.error('Supabase getCourses error:', error);
    } catch (err) {
      console.error('Error querying Supabase getCourses:', err);
    }
  }

  // Fallback: In-memory store
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
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*, registrations(id, status)')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        const regs = data.registrations || [];
        const accepted_count = regs.filter((r: any) => r.status === 'accepted').length;
        const total_registered = regs.length;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { registrations, ...courseData } = data;
        return {
          ...courseData,
          accepted_count,
          total_registered,
        };
      }
    } catch (err) {
      console.error('Error in Supabase getCourseById:', err);
    }
  }

  // Fallback: In-memory store
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
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            title: input.title.trim(),
            description: input.description.trim(),
            category: input.category || 'Workshop',
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
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return { ...data, accepted_count: 0, total_registered: 0 };
      }
      console.error('Supabase createCourse error:', error);
    } catch (err) {
      console.error('Error in Supabase createCourse:', err);
    }
  }

  // Fallback: In-memory store
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
  const supabase = getSupabase();

  if (supabase) {
    try {
      const payload: any = { updated_at: new Date().toISOString() };
      if (input.title !== undefined) payload.title = input.title.trim();
      if (input.description !== undefined) payload.description = input.description.trim();
      if (input.category !== undefined) payload.category = input.category;
      if (input.date !== undefined) payload.date = input.date;
      if (input.time !== undefined) payload.time = input.time.trim();
      if (input.delivery_mode !== undefined) {
        payload.delivery_mode = input.delivery_mode;
        payload.meeting_url = input.delivery_mode === 'online' ? input.meeting_url ?? null : null;
      } else if (input.meeting_url !== undefined) {
        payload.meeting_url = input.meeting_url;
      }
      if (input.location !== undefined) payload.location = input.location.trim();
      if (input.max_seats !== undefined) payload.max_seats = Number(input.max_seats);
      if (input.is_published !== undefined) payload.is_published = input.is_published;
      if (input.is_featured !== undefined) payload.is_featured = input.is_featured;
      if (input.instructor_name !== undefined) payload.instructor_name = input.instructor_name?.trim() || null;
      if (input.instructor_title !== undefined) payload.instructor_title = input.instructor_title?.trim() || null;

      const { error } = await supabase.from('courses').update(payload).eq('id', id);
      if (!error) {
        return getCourseById(id);
      }
      console.error('Supabase updateCourse error:', error);
    } catch (err) {
      console.error('Error in Supabase updateCourse:', err);
    }
  }

  // Fallback: In-memory store
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
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (!error) return true;
      console.error('Supabase deleteCourse error:', error);
    } catch (err) {
      console.error('Error in Supabase deleteCourse:', err);
    }
  }

  // Fallback: In-memory store
  const courses = getCoursesState();
  const regStore = getRegistrationsState();

  const initialLen = courses.length;
  global.__coursesStore = courses.filter(c => c.id !== id);
  global.__registrationsStore = regStore.filter(r => r.course_id !== id);

  return global.__coursesStore.length < initialLen;
}

export async function toggleCoursePublished(id: string): Promise<Course | null> {
  const current = await getCourseById(id);
  if (!current) return null;

  return updateCourse(id, { is_published: !current.is_published });
}

// ==============================================================================
// Registration Operations
// ==============================================================================

export async function getRegistrations(options?: {
  courseId?: string;
  status?: RegistrationStatus;
  search?: string;
}): Promise<Registration[]> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      let query = supabase
        .from('registrations')
        .select('*, course:courses(*)')
        .order('created_at', { ascending: false });

      if (options?.courseId && options.courseId !== 'all') {
        query = query.eq('course_id', options.courseId);
      }

      if (options?.status && options.status !== ('all' as RegistrationStatus)) {
        query = query.eq('status', options.status);
      }

      const { data, error } = await query;

      if (!error && data) {
        let results = data as Registration[];
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
        return results;
      }
      console.error('Supabase getRegistrations error:', error);
    } catch (err) {
      console.error('Error in Supabase getRegistrations:', err);
    }
  }

  // Fallback: In-memory store
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

  // Mandatory legal consent check
  if (!input.consent_privacy || !input.consent_terms || !input.consent_data_law) {
    return { success: false, error: 'CONSENT_REQUIRED' };
  }

  const cleanEmail = input.email.trim().toLowerCase();
  const supabase = getSupabase();

  if (supabase) {
    try {
      // Check duplicate email
      const { data: existing } = await supabase
        .from('registrations')
        .select('id')
        .eq('course_id', input.course_id)
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existing) {
        return { success: false, error: 'ALREADY_REGISTERED' };
      }

      const { data: newReg, error: insertErr } = await supabase
        .from('registrations')
        .insert([
          {
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
          },
        ])
        .select()
        .single();

      if (insertErr || !newReg) {
        if (insertErr?.code === '23505') {
          return { success: false, error: 'ALREADY_REGISTERED' };
        }
        console.error('Supabase registration insert error:', insertErr);
        return { success: false, error: insertErr?.message || 'Failed to save registration' };
      }

      return { success: true, registration: { ...newReg, course } };
    } catch (err: any) {
      console.error('Error in Supabase createRegistration:', err);
      return { success: false, error: err?.message || 'Database error' };
    }
  }

  // Fallback: In-memory store
  const registrations = getRegistrationsState();
  const existing = registrations.find(
    r => r.course_id === input.course_id && r.email.toLowerCase() === cleanEmail
  );

  if (existing) {
    return { success: false, error: 'ALREADY_REGISTERED' };
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
  const supabase = getSupabase();

  if (supabase) {
    try {
      const payload: any = { status, updated_at: new Date().toISOString() };
      if (notes !== undefined) {
        payload.notes = notes;
      }

      const { data, error } = await supabase
        .from('registrations')
        .update(payload)
        .eq('id', id)
        .select('*, course:courses(*)')
        .single();

      if (!error && data) {
        return data as Registration;
      }
      console.error('Supabase updateRegistrationStatus error:', error);
    } catch (err) {
      console.error('Error in Supabase updateRegistrationStatus:', err);
    }
  }

  // Fallback: In-memory store
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
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { error } = await supabase.from('registrations').delete().eq('id', id);
      if (!error) return true;
      console.error('Supabase deleteRegistration error:', error);
    } catch (err) {
      console.error('Error in Supabase deleteRegistration:', err);
    }
  }

  // Fallback: In-memory store
  const registrations = getRegistrationsState();
  const initialLen = registrations.length;
  global.__registrationsStore = registrations.filter(r => r.id !== id);
  return global.__registrationsStore.length < initialLen;
}
