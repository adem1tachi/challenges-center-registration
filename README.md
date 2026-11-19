# Challenges Center — Course & Workshop Management Platform

A production-grade web platform for managing registrations for in-person and online courses and workshops organized by **Challenges Center**, a premier private educational institution, initially introduced during the **Salon de l’Emploi 2026** event.

---

## 🌟 Key Features

- **Multilingual Support (Arabic & English)**: Complete RTL layout support for Arabic and LTR layout for English with an intuitive language switcher.
- **Strict Route Naming Convention**: All application routes end with `01` (`/`, `/courses01`, `/course01/[id]`, `/admin01`, `/register01`, `/login01`, `/privacy01`, `/terms01`).
- **Course & Workshop Catalog**:
  - Horizontal cards on desktop, compact cards on mobile.
  - Delivery format badges (In-person & Live Online).
  - Real-time seat availability indicator and capacity progress bar.
- **Participant Registration**:
  - Client and server-side validation with Zod.
  - Algerian phone number validation (`05/06/07xxxxxxxx`).
  - Strict duplicate registration prevention using participant email per course.
  - Dynamic capacity checks preventing overbooking.
- **Legal Compliance & Algerian Law No. 18-07**:
  - Mandatory legal consent checkboxes for Privacy Policy, Terms of Participation, and Algerian Law No. 18-07 regarding personal data protection.
  - Verifiable consent timestamp logging.
- **Administration Dashboard (`/admin01`)**:
  - Protected by server-side middleware and authentication checks.
  - Full CRUD operations for courses (create, edit, delete, publish/unpublish).
  - Mobile-first responsive design: desktop structured data table and mobile compact cards.
- **Participant & Registration Management (`/register01`)**:
  - Filter registrations by course and status (`new`, `accepted`, `rejected`, `no_response`).
  - Instant status updates and internal staff notes.
  - **CSV Export**: Export accepted participants formatted in UTF-8 with BOM (`\uFEFF`) for Arabic character support in Excel.
  - **Attendance Sheets (PDF / Print)**: Print-ready attendance verification roster with signature spaces, headers, and pagination.

---

## 🛠️ Technology Stack

- **Frontend & Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling & UI**: Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend & Database**: Supabase (PostgreSQL, Supabase Auth, Row Level Security) with unified local reactive fallback
- **Validation**: Zod & React Hook Form
- **Package Manager**: pnpm

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and configure your Supabase credentials:
```bash
cp .env.example .env.local
```

```env
ADMIN_SESSION_SECRET=replace-with-a-secure-random-32-byte-secret-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Create Admin Account (Supabase Auth)
Create an authorized admin user directly via your Supabase Dashboard:
1. Go to **Authentication** -> **Users** -> **Add user**.
2. Enter your admin email and a strong password.
3. Log in to the platform via `/login01`.

### 3. Database Setup (Supabase)
Run the SQL migrations located in:
- `supabase/migrations/20261118_initial_schema.sql` (Tables, Constraints, Indexes, and RLS policies)
- `supabase/seed.sql` (Initial courses and sample participants)

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
pnpm build
pnpm start
```

---

## 🧭 Application Routes

| Route | Description |
|---|---|
| `/` | Professional landing page with dual branding (Salon de l'Emploi & Challenges Center), featured masterclasses, and event overview |
| `/courses01` | Available courses catalog with search and filters |
| `/course01/[id]` | Course details page and participant registration form |
| `/admin01` | Protected Administration dashboard for course management |
| `/register01` | Protected participant & registration roster management with CSV & PDF attendance sheet generation |
| `/login01` | Staff & Administrator authentication |
| `/privacy01` | Privacy policy complying with Algerian Law No. 18-07 |
| `/terms01` | General terms and conditions of participation |

---

## 👨‍💻 Developer Attribution

Developed by **[Adem Tachi](https://adem-tachi.netlify.app/)**
Portfolio: [https://adem-tachi.netlify.app/](https://adem-tachi.netlify.app/)
