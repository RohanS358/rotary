-- Required before the admin "Sync from Rotary site" button works.
-- Run once in the Supabase SQL Editor.

-- Where the project came from on pashupati-kathmandu.rotarydistrict3292.org.np.
-- Unique so re-running the sync updates each project instead of duplicating it.
alter table public.projects add column if not exists source_url text;
-- Plain (not partial) unique index: Postgres cannot infer a partial index in
-- ON CONFLICT, and NULLs are distinct anyway, so manual projects are unaffected.
create unique index if not exists projects_source_url_key
  on public.projects (source_url);

-- The old check constraint only allowed Education/Health/Empowerment/Environment.
alter table public.projects drop constraint if exists projects_category_check;
alter table public.projects add constraint projects_category_check check (
  category in (
    'Maternal and Child Health',
    'Basic Education and Literacy',
    'Economic and Community Development',
    'Peace and Conflict Prevention',
    'Disease Prevention and Treatment',
    'Water and Sanitation',
    'Others'
  )
);
