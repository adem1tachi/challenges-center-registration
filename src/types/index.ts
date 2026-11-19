export type DeliveryMode = 'in_person' | 'online';

export type RegistrationStatus = 'new' | 'accepted' | 'rejected' | 'no_response';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "09:30 - 12:30"
  delivery_mode: DeliveryMode;
  location: string;
  meeting_url?: string | null;
  max_seats: number;
  is_published: boolean;
  is_featured: boolean;
  instructor_name?: string | null;
  instructor_title?: string | null;
  created_at: string;
  updated_at: string;
  accepted_count?: number;
  total_registered?: number;
}

export interface Registration {
  id: string;
  course_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  status: RegistrationStatus;
  consent_privacy: boolean;
  consent_terms: boolean;
  consent_data_law: boolean;
  consent_timestamp: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  course?: Course;
}

export type Locale = 'ar' | 'en';

export interface CourseInput {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  delivery_mode: DeliveryMode;
  location?: string;
  meeting_url?: string;
  max_seats: number;
  is_published?: boolean;
  is_featured?: boolean;
  instructor_name?: string;
  instructor_title?: string;
}

export interface RegistrationInput {
  course_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  consent_privacy: boolean;
  consent_terms: boolean;
  consent_data_law: boolean;
}
