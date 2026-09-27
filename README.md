# ABES CodeChef Chapter — College Club Event Management Platform

A modern, responsive, and production-grade web application built for the **ABES CodeChef Chapter** to manage technical workshops, competitive programming contests, hackathons, and student registrations.

Inspired by modern SaaS dashboard design principles, this platform delivers a cohesive experience across public student engagement and administrative event operations.

---

## 🚀 Live Demo & Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Evaluation / Demo Mode:**
> If Supabase credentials are not configured immediately, the application automatically activates **Persistent Local Storage Fallback Mode** with realistic seed events and registrations. Reviewers can test all public and admin functionality out-of-the-box without setup friction!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite
- **UI & Design System**: Material UI (MUI) custom design system matching Dribbble SaaS dashboard reference
- **Icons**: Lucide React
- **Analytics & Visualizations**: Recharts
- **Routing**: React Router v7
- **Database & Backend**: Supabase (PostgreSQL) + Row-Level Security (RLS)
- **Authentication**: Supabase Auth + Protected Routes with session persistence

---

## 🗄️ Database Architecture (`supabase/schema.sql`)

The database schema is fully defined in [`supabase/schema.sql`](file:///c:/Users/dubey/AppData/Local/Packages/5319275A.WhatsAppDesktop_cv1g1gvanyjgm/LocalState/sessions/CCE0DD3C0D27DC32F799B63E74F364F8C1AEFF09/transfers/2026-35/CodeChef%20Abes/supabase/schema.sql):

### 1. `events` Table
- `id` UUID PRIMARY KEY DEFAULT `gen_random_uuid()`
- `name` TEXT NOT NULL
- `category` TEXT NOT NULL (Coding, Workshop, Hackathon, Seminar, etc.)
- `date` DATE NOT NULL
- `time` TIME NOT NULL
- `venue` TEXT NOT NULL
- `short_description` TEXT
- `description` TEXT
- `banner_url` TEXT
- `registration_deadline` TIMESTAMPTZ
- `max_participants` INTEGER DEFAULT 100
- `is_featured` BOOLEAN DEFAULT false
- `registration_open` BOOLEAN DEFAULT true
- `created_at` TIMESTAMPTZ DEFAULT now()
- `updated_at` TIMESTAMPTZ DEFAULT now()

### 2. `registrations` Table
- `id` UUID PRIMARY KEY DEFAULT `gen_random_uuid()`
- `event_id` UUID REFERENCES events(id) ON DELETE CASCADE
- `name` TEXT NOT NULL
- `email` TEXT NOT NULL
- `college` TEXT NOT NULL
- `year` TEXT NOT NULL
- `phone` TEXT NOT NULL
- `created_at` TIMESTAMPTZ DEFAULT now()
- **Constraint**: `UNIQUE(event_id, email)` — Enforces duplicate registration prevention at the database engine level.

### 3. Row-Level Security (RLS) Policies
- **Public Users**:
  - `SELECT` on `events` (allowed for all)
  - `INSERT` on `registrations` (allowed for student signups)
- **Authenticated Admins**:
  - Full CRUD (`ALL`) on `events`
  - `SELECT` and management on `registrations`

---

## 🌐 Routes Breakdown

### Public / Student Side
- `/` — **Homepage**:
  - Dribbble-inspired rounded hero banner with abstract tech visuals
  - Club introduction with four core pillars (Competitive Programming, Workshops, Hackathons, Community)
  - Next upcoming events grid
  - Featured flagship event spotlight
  - "Why Participate?" feature cards
  - Call-to-action & Footer
- `/events` — **All Events**:
  - Dynamic real-time search by title, description, or venue
  - Category filter pills (Coding, Workshop, Hackathon, Seminar, Cultural, Sports, etc.)
  - Status filter dropdown (Upcoming, Past, Registration Open, Registration Closed)
  - Responsive event cards (3 columns desktop, 2 tablet, 1 mobile) with capacity progress bars
- `/events/:id` — **Event Details**:
  - Large banner, schedule, venue, capacity progress, full agenda, and "Register Now" CTA
- `/register/:eventId` — **Event Registration**:
  - Validation: required fields, email format, 10-digit phone verification
  - Duplicate registration protection: blocks re-registration with user-friendly error
  - Capacity enforcement: prevents signup if maximum participants reached
  - Confirmation pass view upon success

### Admin Side (Protected)
- `/admin/login` — **Admin Authentication**:
  - Supabase email/password authentication
  - Demo quick-fill credentials button: `admin@abes.ac.in` / `admin123`
- `/admin/dashboard` — **SaaS Dashboard Overview**:
  - Large rounded banner
  - 4 Statistic Cards (Total Events, Upcoming Events, Total Registrations, Past Events)
  - Recharts visualizations: *Registrations Over Time* and *Registrations by Event*
  - Upcoming events list
  - Recent student registrations table with quick link
- `/admin/events` — **Events Management Table**:
  - Search and filter table
  - Actions: View public page, Edit event, Delete event
  - Deletion modal confirmation dialog (`"Delete Event? This action cannot be undone."`)
  - Snackbar alerts
- `/admin/events/new` — **Create Event**:
  - Grouped fields: Event Information, Schedule & Venue, Registration Settings, Display Settings
- `/admin/events/edit/:id` — **Edit Event**:
  - Pre-populates existing data and updates event parameters
- `/admin/registrations` — **Student Registrations**:
  - Search by student name, email, or phone
  - Filter by event and academic year
  - Attendee detail view modal
  - Export CSV button

---

## 🔐 Admin Credentials (Demo Mode)
- **Email**: `admin@abes.ac.in`
- **Password**: `admin123`
