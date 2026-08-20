-- Adds a project link to the treasury ledger, so a member's giving can be traced
-- to the service project it funded. Run after supabase-treasury.sql.

alter table public.treasury_entries
  add column if not exists project_id uuid references public.projects(id) on delete set null;

create index if not exists treasury_entries_project_idx on public.treasury_entries (project_id);

-- Best-effort match of the seeded pledge/expense rows to existing projects by title.
-- Safe to re-run; only fills rows that are still unlinked.
update public.treasury_entries e
set project_id = p.id
from public.projects p
where e.project_id is null
  and (
    (e.label ilike '%Water Treatment%' and p.title ilike '%water%')
    or (e.label ilike '%Food Bank%'    and p.title ilike '%food donation%')
    or (e.label ilike '%Food donation%' and p.title ilike '%food donation%')
    or (e.label ilike '%Tree plantation%' and p.title ilike '%plantation%')
  );
a