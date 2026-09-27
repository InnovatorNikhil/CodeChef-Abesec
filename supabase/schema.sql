-- ========================================================
-- College Club Event Management Platform
-- Database Schema & Policies for ABES CodeChef Chapter
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- TABLE: events
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    venue TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    banner_url TEXT,
    registration_deadline TIMESTAMPTZ,
    max_participants INTEGER DEFAULT 100,
    is_featured BOOLEAN DEFAULT false,
    registration_open BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------
-- TABLE: registrations
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    college TEXT NOT NULL,
    year TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_event_registration UNIQUE (event_id, email)
);

-- --------------------------------------------------------
-- INDEXES
-- --------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- --------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- --------------------------------------------------------
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Events Policies:
-- 1. Anyone (public + authenticated) can view events
CREATE POLICY "Public users can view all events"
    ON events FOR SELECT
    USING (true);

-- 2. Authenticated users (admin) can insert, update, delete events
CREATE POLICY "Authenticated admins can insert events"
    ON events FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated admins can update events"
    ON events FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete events"
    ON events FOR DELETE
    TO authenticated
    USING (true);

-- Registrations Policies:
-- 1. Anyone can create a registration
CREATE POLICY "Public users can create registrations"
    ON registrations FOR INSERT
    WITH CHECK (true);

-- 2. Authenticated admins can view all registrations
CREATE POLICY "Authenticated admins can view all registrations"
    ON registrations FOR SELECT
    TO authenticated
    USING (true);

-- 3. Authenticated admins can delete registrations if needed
CREATE POLICY "Authenticated admins can delete registrations"
    ON registrations FOR DELETE
    TO authenticated
    USING (true);

-- --------------------------------------------------------
-- SEED DATA
-- --------------------------------------------------------
INSERT INTO events (id, name, category, date, time, venue, short_description, description, banner_url, registration_deadline, max_participants, is_featured, registration_open)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'CodeChef Starter Contest 2026',
    'Coding',
    CURRENT_DATE + INTERVAL '5 days',
    '15:00:00',
    'ABES Computer Lab 3',
    'Kickstart your competitive programming journey with algorithmic challenges and live leaderboard scoring.',
    'Join the ABES CodeChef Chapter for an adrenaline-fueled competitive coding contest! Designed for both beginners and experienced problem solvers, you will tackle 6 curated algorithmic problems covering data structures, dynamic programming, and greedy algorithms. Top performers receive certificates, CodeChef laddus, and club membership perks.',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    NOW() + INTERVAL '4 days',
    120,
    true,
    true
),
(
    'b2222222-2222-2222-2222-222222222222',
    'Full-Stack Modern Web Dev Workshop',
    'Workshop',
    CURRENT_DATE + INTERVAL '12 days',
    '10:30:00',
    'Seminar Hall 2, B-Block',
    'Hands-on masterclass building production-grade web applications with React 19, TypeScript, and modern APIs.',
    'An intensive full-day hands-on workshop guiding students through the modern web ecosystem. We will cover component architecture, reactive state management, asynchronous data fetching, and deployment strategies on edge networks. Bring your laptop and charge ahead!',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    NOW() + INTERVAL '11 days',
    80,
    false,
    true
),
(
    'c3333333-3333-3333-3333-333333333333',
    'TrackShift 36-Hour Innovation Hackathon',
    'Hackathon',
    CURRENT_DATE + INTERVAL '20 days',
    '09:00:00',
    'Innovation Lab & Incubation Center',
    '36 hours of non-stop building, ideation, and mentoring with cash prizes and industry judges.',
    'TrackShift is ABES flagship inter-college hackathon. Over 36 hours, teams will build real-world solutions across domains such as FinTech, HealthTech, AI Agents, and Smart Campus Solutions. Mentorship from senior software engineers and venture capitalists throughout the event.',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    NOW() + INTERVAL '18 days',
    200,
    false,
    true
),
(
    'd4444444-4444-4444-4444-444444444444',
    'AI & Future Technologies Keynote',
    'Seminar',
    CURRENT_DATE + INTERVAL '28 days',
    '14:00:00',
    'Main College Auditorium',
    'Exploring Generative AI, Large Language Models, and the evolution of software engineering careers.',
    'Distinguished guest lecture featuring researchers and tech leaders from the AI industry. Learn how generative models and automated agentic pipelines are reshaping how we architect software, how to prepare your engineering portfolio, and what skills will define the next decade.',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    NOW() + INTERVAL '27 days',
    350,
    false,
    true
),
(
    'e5555555-5555-5555-5555-555555555555',
    'Open Source Contribution Day',
    'Workshop',
    CURRENT_DATE - INTERVAL '10 days',
    '11:00:00',
    'Computer Center Lab 1',
    'Learn Git, GitHub collaboration, and make your first verified pull request to open-source repositories.',
    'A retrospective look at our high-energy Open Source Day where over 70 students learned Git rebase, pull requests, issue triaging, and successfully made contributions to popular repositories.',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    NOW() - INTERVAL '11 days',
    75,
    false,
    false
)
ON CONFLICT (id) DO NOTHING;

-- Seed sample registrations
INSERT INTO registrations (event_id, name, email, college, year, phone)
VALUES
('a1111111-1111-1111-1111-111111111111', 'Aarav Sharma', 'aarav.sharma@abes.ac.in', 'ABES Engineering College', '3rd Year', '+91 9876543210'),
('a1111111-1111-1111-1111-111111111111', 'Priya Verma', 'priya.verma@abes.ac.in', 'ABES Engineering College', '2nd Year', '+91 9876543211'),
('a1111111-1111-1111-1111-111111111111', 'Rohan Gupta', 'rohan.gupta@abes.ac.in', 'ABES Engineering College', '4th Year', '+91 9876543212'),
('b2222222-2222-2222-2222-222222222222', 'Sneha Patel', 'sneha.patel@abes.ac.in', 'ABES Engineering College', '2nd Year', '+91 9876543213'),
('b2222222-2222-2222-2222-222222222222', 'Aditya Singh', 'aditya.singh@abes.ac.in', 'ABES Engineering College', '1st Year', '+91 9876543214'),
('c3333333-3333-3333-3333-333333333333', 'Ananya Mishra', 'ananya.mishra@abes.ac.in', 'ABES Engineering College', '3rd Year', '+91 9876543215')
ON CONFLICT (event_id, email) DO NOTHING;
