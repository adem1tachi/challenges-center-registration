# Course & Workshop 
 Management Platform

## 1. Project Overview

Build a complete web platform for managing registrations for in-person and online courses and workshops organized by **Challenges Center**, a private educational institution.

The platform will initially be introduced during the **Salon de l’Emploi** event. However, it must be designed as a permanent, reusable system that Challenges Center can continue using after the event to publish new courses, manage workshops, and handle participant registrations.

The system should be scalable, maintainable, secure, and easy to manage without requiring technical knowledge from administrators.

---

## 2. Application Structure & Pages

### 2.1. Homepage

Create a professional landing page containing the following sections:

**Hero Section**
- Display the Salon de l’Emploi event logo.
- Display the Challenges Center logo.
- Main headline introducing the available courses and workshops.
- A short supporting subtitle.
- Two call-to-action buttons:
  - Primary CTA: Explore Available Courses.
  - Secondary CTA: Contact Challenges Center (or another relevant action).
  
**Featured Courses**
- Display a selection of featured or upcoming courses.
- Each course should have a compact preview.
- Include a button linking to the complete courses listing page.

**About the Event**
- A brief introduction to Salon de l’Emploi.
- Explain the relationship between the event and Challenges Center's training activities.

**Footer**
- Include relevant navigation links.
- Display event and institution information.
- Include the developer credit specified in the technical requirements.

### 2.2. Available Courses Page

Create a dedicated page displaying all currently available courses and workshops.

Requirements:
- Display courses using compact horizontal cards.
- Each card should provide essential information:
  - Course title.
  - Short description.
  - Date and time.
  - Delivery format (In-person / Online).
  - Available seats.
  - A button to view course details.
- Clearly distinguish between upcoming, fully booked, and unavailable courses.
- Only display courses that administrators have made publicly available.

### 2.3. Course Details & Registration Page

Each course must have its own dedicated details page.

**Course Information**
Display the complete information associated with the selected course:
- Course title.
- Full description.
- Date and time.
- Delivery format.
- Physical location or online meeting link, depending on the course type.
- Number of available seats.
- Any additional information provided by the administrator.

**Registration Form**

Place a simple registration form below the course information.

Required fields:
- First Name.
- Last Name.
- Phone Number.
- Email Address.

Additional requirements:
- Validate all submitted information.
- Prevent duplicate registrations for the same course using the participant's email address.
- Prevent registrations when a course is full or closed.
- Display clear success and error messages.
- Store all registration data securely in Supabase.

---

## 3. Administration Dashboard

Create a protected administration dashboard for managing courses, workshops, and registrations.

The dashboard must be responsive and optimized for desktop and mobile devices.

### 3.1. Course & Workshop Management

Administrators must be able to:

- Create new courses and workshops.
- Edit existing courses.
- Delete courses.
- Publish or unpublish courses.
- View all courses and their current status.

**Course Data Structure**

Each course should support the following fields:

| Field | Description |
|---|---|
| Title | Course or workshop title |
| Description | Full course description |
| Date | Scheduled date |
| Time | Starting time |
| Delivery Mode | In-person or Online |
| Location / Meeting URL | Physical address or online meeting link |
| Available Seats | Maximum participant capacity |

Additional system fields should include:
- Unique course ID.
- Creation date.
- Last modification date.
- Publication status.

**Responsive Display**

- On desktop: Display courses in a structured data table.
- On mobile: Display courses as compact cards instead of forcing users to interact with wide tables.

### 3.2. Participant & Registration Management

Administrators must be able to view and manage all registrations.

**Participant Information**

Each registration should contain:
- First Name.
- Last Name.
- Phone Number.
- Email Address.
- Associated Course.
- Registration Date.

**Registration Status**

Each registration must have one of the following statuses:

- New.
- Accepted.
- Rejected.
- No Response.

Administrators should be able to:
- View registrations for each course.
- Filter registrations by course and status.
- Search for participants by name, email, or phone number.
- Change registration statuses.
- View participant details.
- Track the number of accepted participants and remaining available seats.

### 3.3. Export Accepted Participants to CSV

For each course, provide an action allowing administrators to export the list of accepted participants as a CSV file.

Requirements:
- Export only accepted registrations.
- Include participant names, phone numbers, and email addresses.
- Use appropriate UTF-8 encoding to support Arabic characters.
- Use a clear and descriptive filename containing the course name.

### 3.4. Generate Attendance Sheets (PDF)

Provide an option to print or download a PDF attendance sheet for each course.

The PDF must contain:

**Header**
- Course title.
- Course date.
- Relevant institution or event identification.

**Participants Table**

Include the following columns:
- Participant Number.
- First Name.
- Last Name.
- Phone Number.
- Email Address.
- Attendance Signature.

The signature column must provide sufficient empty space for participants to sign manually.

**Footer**
Include:
- Course date.
- Document generation date.
- Page numbers when the document spans multiple pages.

The PDF should have a clean, professional, print-friendly layout with proper table formatting and support for Arabic text when needed.

Only accepted participants should appear in the attendance sheet.

---

## 4. Technical Requirements

### 4.1. Technology Stack

Use the following infrastructure:

- **Frontend & Deployment:** Next.js / Vercel.
- **Backend & Database:** Supabase.
- **Database:** PostgreSQL through Supabase.
- **Authentication:** Supabase Auth for administrator access.

Use a modern, maintainable architecture with reusable components and clear separation of concerns.

### 4.2. Multilingual Support

The public-facing platform must support two languages:

- Arabic.
- English.

Requirements:
- Provide a language switcher.
- Support proper RTL layouts for Arabic.
- Support LTR layouts for English.
- Ensure that typography, navigation, forms, cards, and tables adapt correctly to both languages.
- Do not simply translate text while ignoring layout direction.

The administration dashboard should also support the same language system.

### 4.3. Responsive Design — Mobile First

The entire application must follow a mobile-first design approach.

Important requirements:
- Optimize all pages for mobile screens.
- Use responsive layouts and appropriate spacing.
- Replace desktop data tables with card-based layouts on mobile.
- Ensure buttons and form controls are easy to use on touch screens.
- Avoid horizontal overflow.
- Maintain a consistent experience across desktop, tablet, and mobile devices.

### 4.4. Security Requirements

Security is a critical requirement.

Implement appropriate security measures to protect the application against common web vulnerabilities and unauthorized access.

At minimum:

**Authentication & Authorization**
- Protect all administration routes.
- Only authenticated and authorized administrators may access administrative functionality.
- Never rely solely on frontend route protection.
- Implement proper server-side authorization checks.

**Supabase Security**
- Enable and properly configure Row Level Security (RLS) on all relevant tables.
- Define explicit access policies for public registration and administrative operations.
- Never expose the Supabase Service Role Key or other privileged credentials to the client.
- Keep sensitive environment variables server-side.

**Input Validation**
- Validate all user inputs on both the client and server.
- Sanitize data where appropriate.
- Prevent SQL injection, XSS, and other common injection vulnerabilities.
- Apply reasonable limits to submitted data.

**Registration Protection**
- Prevent duplicate registrations.
- Protect registration endpoints against abuse and automated spam.
- Implement appropriate rate limiting.

**Data Protection**
- Do not expose participant information publicly.
- Restrict access to private registration data.
- Do not expose private meeting links to unauthorized visitors.

Follow security best practices for Next.js and Supabase.

---

## 5. URL Routing Convention

All application routes must end with `01`.

Examples:

- `/` — Homepage.
- `/courses01` — Available courses.
- `/course01/[id]` — Course details and registration.
- `/admin01` — Administration dashboard.
- `/register01` — Registration management.

Apply this naming convention consistently to all newly created application routes.

Do not create routes that violate this convention.

---

## 6. Assets & Visual Resources

All required images, logos, and icons will be provided inside the project folder.

Before creating or replacing any visual assets:

1. Inspect the existing project directory.
2. Identify the available logos, images, and icons.
3. Reuse the provided assets wherever appropriate.
4. Preserve the original branding and visual identity.

Do not use random placeholder logos or unnecessarily replace existing assets.

The visual design should be:
- Professional.
- Clean and modern.
- Bright and visually appealing.
- Easy to navigate.
- Consistent with the identity of Salon de l’Emploi and Challenges Center.

Pay particular attention to visual hierarchy, typography, spacing, and readability.

---

## 7. Privacy Policy & Legal Compliance

Registration must include mandatory consent checkboxes before submission.

Participants must explicitly agree to:

1. The platform's Privacy Policy.
2. The Terms and Conditions of Participation.
3. The applicable provisions of Algerian Law No. 18-07 concerning the protection of individuals in the processing of personal data.

Requirements:
- Consent must be mandatory.
- Links to the relevant policies must be accessible from the registration form.
- Store the participant's consent status and consent timestamp.
- Do not use pre-checked consent boxes.
- Do not treat consent to unrelated marketing communications as mandatory registration consent.

Ensure that the platform's data collection and processing practices are designed with applicable Algerian data protection requirements in mind.

---

## 8. Developer Attribution

Add the following developer credit to the footer of all public-facing pages:

"Developed by Adem Tachi"

The developer's name must link to the following portfolio:

https://adem-tachi.netlify.app/

Use a subtle and professional presentation that does not distract from the platform's main content.

---

## 9. Development Workflow & Final Requirements

Follow these instructions throughout development:

1. First, inspect the existing project structure and understand the available assets and technologies.
2. Review the existing codebase before making architectural decisions.
3. Plan the database schema and relationships before implementing the application.
4. Implement the application using clean, reusable, and maintainable code.
5. Configure Supabase authentication, database access, and RLS policies correctly.
6. Ensure that all registration and administration workflows function correctly.
7. Test the responsive layouts, particularly the mobile experience.
8. Verify Arabic RTL and English LTR layouts.
9. Test the CSV export and PDF attendance sheet generation.
10. Perform a security review before considering the project complete.
11. Ensure there are no broken routes, non-functional buttons, or unfinished features.
12. Verify that the project builds successfully.

### Git Requirements

After completing the initial implementation and verifying that the application builds successfully:

- Initialize Git if it has not already been initialized.
- Create the first commit.
- Use a descriptive commit message, for example:

`Initial commit: Course and Workshop Registration Management Platform`

Do not overwrite existing Git history or modify unrelated project files.

---

## 10. Expected Final Result

Deliver a fully functional, production-ready course and workshop registration management platform.

The final application must provide:

- A multilingual public website.
- A complete course and workshop listing system.
- Individual course detail pages.
- A functional participant registration system.
- A protected administration dashboard.
- Complete course and registration management.
- CSV export functionality.
- PDF attendance sheet generation.
- Secure data storage and access control.
- Responsive mobile-first layouts.
- A reusable architecture suitable for long-term operation by Challenges Center.

**Important:** Do not deliver a static visual prototype. Implement the actual application, including database integration, authentication, registration workflows, administration functionality, exports, and security configurations.
