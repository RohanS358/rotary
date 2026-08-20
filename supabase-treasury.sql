-- Secretary Report / Treasury module
-- Models the club's secretary workbook: one ledger of committed-vs-paid amounts
-- (dues, souvenir ads, TRF, service-project pledges, expenses) + endowment funds.

-- ─────────────────────────── LEDGER ───────────────────────────
create table if not exists public.treasury_entries (
  id              uuid primary key default gen_random_uuid(),
  ry              text not null default '2025/26',          -- Rotary year
  kind            text not null check (kind in ('income','expense')),
  category        text not null check (category in (
                    -- income
                    'membership_dues','souvenir','service_project','trf',
                    'smile_a_while','installation','interest','contribution',
                    -- expense
                    'ri_dues','district_dues','rotaract','administrative',
                    'project_cost','event_cost','misc')),
  label           text not null,                            -- particular / company / project
  member_id       uuid references public.members(id) on delete set null,
  payer           text,                                     -- free-text name when not a linked member
  currency        text not null default 'NPR' check (currency in ('NPR','USD')),
  committed       numeric(12,2) not null default 0 check (committed >= 0),
  paid            numeric(12,2) not null default 0 check (paid >= 0),
  payment_method  text check (payment_method in ('cash','cheque','qr','fp_prime','deposit','bank','vendor','other')),
  reference       text,                                     -- cheque no, receipt no
  entry_date      date,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists treasury_entries_ry_idx        on public.treasury_entries (ry);
create index if not exists treasury_entries_kind_cat_idx  on public.treasury_entries (kind, category);
create index if not exists treasury_entries_member_idx    on public.treasury_entries (member_id);

-- ─────────────────────────── ENDOWMENT FUNDS ───────────────────────────
create table if not exists public.treasury_funds (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  principal      numeric(14,2) not null default 0 check (principal >= 0),
  institution    text,                                      -- e.g. Shree Investment
  interest_rate  numeric(5,2) not null default 0,           -- annual %, e.g. 11.00
  term_years     integer,
  started_on     date,
  status         text not null default 'active' check (status in ('active','due','matured','closed')),
  utilization    text,                                      -- what the yearly interest funds
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ─────────────────────────── RLS ───────────────────────────
-- Same model as the rest of the site: public read is NOT granted (financials are internal);
-- any authenticated user (= club admin) has full access.
alter table public.treasury_entries enable row level security;
alter table public.treasury_funds   enable row level security;

drop policy if exists "treasury_entries admin all" on public.treasury_entries;
create policy "treasury_entries admin all" on public.treasury_entries
  for all to authenticated using (true) with check (true);

drop policy if exists "treasury_funds admin all" on public.treasury_funds;
create policy "treasury_funds admin all" on public.treasury_funds
  for all to authenticated using (true) with check (true);
