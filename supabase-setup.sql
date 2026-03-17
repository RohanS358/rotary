-- ============================================================
-- Rotary Club of Pashupati Kathmandu — Supabase SQL Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Members
create table if not exists public.members (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text,
  photo_url text,
  type text not null check (type in ('board', 'member', 'rotaract')) default 'member',
  bio text,
  year integer,
  active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text not null check (category in ('Education', 'Health', 'Empowerment', 'Environment')),
  image_url text,
  date date,
  impact_metric text,
  active boolean default true,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Gallery
create table if not exists public.gallery (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  image_url text not null,
  category text not null check (category in ('Education', 'Health', 'Empowerment', 'Environment', 'General')) default 'General',
  date date,
  alt_text text,
  created_at timestamptz default now()
);

-- Archives
create table if not exists public.archives (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  type text not null check (type in ('meeting', 'event', 'document')) default 'meeting',
  date date,
  file_url text,
  created_at timestamptz default now()
);

-- Testimonials
create table if not exists public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text,
  quote text not null,
  photo_url text,
  active boolean default true,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Site content (editable home page text)
create table if not exists public.site_content (
  id uuid default uuid_generate_v4() primary key,
  key text not null unique,
  value text,
  type text not null check (type in ('text', 'image', 'json')) default 'text',
  label text,
  updated_at timestamptz default now()
);

-- Contact form submissions
create table if not exists public.contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_members_type on public.members(type);
create index if not exists idx_members_active on public.members(active);
create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_active on public.projects(active);
create index if not exists idx_projects_featured on public.projects(featured);
create index if not exists idx_gallery_category on public.gallery(category);
create index if not exists idx_archives_type on public.archives(type);
create index if not exists idx_contact_read on public.contact_submissions(read);
create index if not exists idx_contact_created on public.contact_submissions(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.members enable row level security;
alter table public.projects enable row level security;
alter table public.gallery enable row level security;
alter table public.archives enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_submissions enable row level security;

-- PUBLIC READ: anyone can read active public data
create policy "public_read_members" on public.members
  for select using (active = true);

create policy "public_read_projects" on public.projects
  for select using (active = true);

create policy "public_read_gallery" on public.gallery
  for select using (true);

create policy "public_read_archives" on public.archives
  for select using (true);

create policy "public_read_testimonials" on public.testimonials
  for select using (active = true);

create policy "public_read_site_content" on public.site_content
  for select using (true);

-- ANON INSERT: allow contact form submissions from unauthenticated users
create policy "anon_insert_contact" on public.contact_submissions
  for insert with check (true);

-- AUTHENTICATED ADMIN: full access for authenticated admin users
create policy "admin_all_members" on public.members
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_all_projects" on public.projects
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_all_gallery" on public.gallery
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_all_archives" on public.archives
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_all_testimonials" on public.testimonials
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_all_site_content" on public.site_content
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin_read_contact" on public.contact_submissions
  for select using (auth.role() = 'authenticated');

create policy "admin_update_contact" on public.contact_submissions
  for update using (auth.role() = 'authenticated');

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

-- Default site content
insert into public.site_content (key, value, type, label) values
  ('hero_title', 'Service Above Self', 'text', 'Hero Title'),
  ('hero_subtitle', 'Rotary Club of Pashupati Kathmandu — a global network of neighbors, friends, and problem-solvers committed to creating lasting change across Kathmandu and beyond.', 'text', 'Hero Subtitle'),
  ('hero_cta_primary', 'Our Projects', 'text', 'Hero Button 1 Text'),
  ('hero_cta_secondary', 'About Us', 'text', 'Hero Button 2 Text'),
  ('about_mission', 'The mission of Rotary International is to provide services to others, promote integrity, and advance world understanding, goodwill, and peace through the fellowship of business, professional, and community leaders.', 'text', 'Mission Statement'),
  ('about_description', 'Rotary is a global network of 1.2 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change — across the globe, in our communities, and in ourselves.', 'text', 'About Description'),
  ('stats_members', '50+', 'text', 'Stats: Members Value'),
  ('stats_projects', '100+', 'text', 'Stats: Projects Value'),
  ('stats_years', '25+', 'text', 'Stats: Years Value'),
  ('stats_lives', '10,000+', 'text', 'Stats: Lives Impacted')
on conflict (key) do nothing;

-- Sample projects
insert into public.projects (title, description, category, date, impact_metric, active, featured) values
  ('Wheelchair Distribution', 'Distributed wheelchairs to differently-abled individuals at Budhanilkantha Hospital, restoring mobility and independence to those in need.', 'Health', '2023-07-07', '50+ beneficiaries', true, true),
  ('Rotary Prahari Batika', 'Environmental initiative establishing community gardens and green spaces across Kathmandu to combat urban heat and improve air quality.', 'Environment', '2023-05-01', '5 gardens planted', true, true),
  ('SOCHKO PARIBARTAN', 'Basic literacy month initiative empowering underprivileged women and children with foundational education skills in Kathmandu.', 'Education', '2023-09-01', '200+ students', true, true),
  ('HOPE FOR EMPOWERMENT', 'Economic development program providing vocational training and micro-financing to local women entrepreneurs.', 'Empowerment', '2023-03-01', '100+ women', true, false),
  ('Free Health Camp 2075', 'Annual free health camp providing basic medical services, general check-ups, and medicine distribution to the community.', 'Health', '2019-01-01', '500+ patients', true, false),
  ('ROTARY AGRICULTURAL LIBRARY', 'Joint Rotary and Rotaract project establishing an agricultural reference library to support local farmers with modern techniques.', 'Education', '2020-06-01', '1 library', true, false),
  ('Jay Baba Pashupati Women Vocational Center', 'Vocational training center for women providing skills in tailoring, cooking, and handicrafts for economic independence.', 'Empowerment', '2019-05-01', '200+ women trained', true, false),
  ('Personal Hygiene Program', 'Disease prevention initiative distributing hygiene kits and educating communities on personal hygiene practices.', 'Health', '2022-03-01', '1000+ kits', true, false),
  ('Tree Plantation Drive', 'Annual tree plantation initiative planting trees across Kathmandu valley to promote environmental sustainability.', 'Environment', '2023-06-05', '500+ trees', true, false)
on conflict do nothing;

-- ============================================================
-- NEWS · PUBLICATIONS · CALENDAR  (added 2025)
-- ============================================================

-- News posts
create table if not exists public.news_posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  excerpt       text,
  body          text,
  cover_image_url text,
  category      text not null default 'General',
  author        text not null default 'Rotary Club',
  published     boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists news_posts_published_idx on public.news_posts (published);
create index if not exists news_posts_published_at_idx on public.news_posts (published_at desc);

-- Publications (PDF newsletters, annual reports, etc.)
create table if not exists public.publications (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  file_url      text,
  cover_image_url text,
  category      text not null default 'Newsletter',
  published     boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists publications_published_idx on public.publications (published);

-- Calendar events
create table if not exists public.calendar_events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  location    text,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  all_day     boolean not null default false,
  category    text not null default 'General',
  color       text not null default '#17458f',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists calendar_events_starts_at_idx on public.calendar_events (starts_at);

-- Event RSVPs
create table if not exists public.event_rsvps (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.calendar_events(id) on delete cascade,
  name       text not null,
  email      text not null,
  status     text not null default 'going',
  created_at timestamptz not null default now()
);
create index if not exists event_rsvps_event_id_idx on public.event_rsvps (event_id);

-- RLS
alter table public.news_posts     enable row level security;
alter table public.publications    enable row level security;
alter table public.calendar_events enable row level security;
alter table public.event_rsvps     enable row level security;

-- Public read (published only for news/publications, all for calendar/rsvps)
create policy "public_read_news"         on public.news_posts     for select using (published = true);
create policy "public_read_publications" on public.publications    for select using (published = true);
create policy "public_read_events"       on public.calendar_events for select using (true);
create policy "public_read_rsvps"        on public.event_rsvps     for select using (true);
create policy "public_insert_rsvp"       on public.event_rsvps     for insert with check (true);

-- Authenticated admin full access
create policy "admin_all_news"         on public.news_posts     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_all_publications" on public.publications    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_all_events"       on public.calendar_events for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin_all_rsvps"        on public.event_rsvps     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
