import type { TreasuryEntry, TreasuryCategory, TreasuryFund, PaymentMethod, TreasuryKind } from "@/lib/types";

export const CATEGORY_META: Record<TreasuryCategory, { label: string; kind: TreasuryKind }> = {
  membership_dues: { label: "Membership Dues", kind: "income" },
  souvenir: { label: "Souvenir Advertising", kind: "income" },
  service_project: { label: "Service Project Pledges", kind: "income" },
  trf: { label: "The Rotary Foundation", kind: "income" },
  smile_a_while: { label: "Smile-a-While", kind: "income" },
  installation: { label: "Installation Charge", kind: "income" },
  interest: { label: "Fund Interest", kind: "income" },
  contribution: { label: "Member Contribution", kind: "income" },
  ri_dues: { label: "RI Dues", kind: "expense" },
  district_dues: { label: "District Dues", kind: "expense" },
  rotaract: { label: "Rotaract Support", kind: "expense" },
  administrative: { label: "Administrative", kind: "expense" },
  project_cost: { label: "Project Cost", kind: "expense" },
  event_cost: { label: "Event Cost", kind: "expense" },
  misc: { label: "Miscellaneous", kind: "expense" },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  cheque: "Cheque",
  qr: "QR",
  fp_prime: "Fund Transfer — Prime",
  deposit: "Cash / Deposit",
  bank: "Bank Transfer",
  vendor: "Paid to Vendor",
  other: "Other",
};

export const categoriesFor = (kind: TreasuryKind) =>
  (Object.keys(CATEGORY_META) as TreasuryCategory[]).filter((c) => CATEGORY_META[c].kind === kind);

export const categoryLabel = (c: TreasuryCategory) => CATEGORY_META[c]?.label ?? c;

export function formatMoney(amount: number, currency: "NPR" | "USD" = "NPR") {
  const n = Math.round(amount).toLocaleString("en-IN");
  return currency === "USD" ? `$${n}` : `Rs ${n}`;
}

/** Committed but not yet received/paid. Never negative — overpayment is not a receivable. */
export const outstandingOf = (e: Pick<TreasuryEntry, "committed" | "paid">) =>
  Math.max(0, e.committed - e.paid);

export interface Totals {
  committed: number;
  paid: number;
  outstanding: number;
  count: number;
}

const empty = (): Totals => ({ committed: 0, paid: 0, outstanding: 0, count: 0 });

function accumulate(t: Totals, e: TreasuryEntry) {
  t.committed += e.committed;
  t.paid += e.paid;
  t.outstanding += outstandingOf(e);
  t.count += 1;
  return t;
}

/** Currency-scoped — NPR and USD are never summed together. */
export const inCurrency = (entries: TreasuryEntry[], currency: "NPR" | "USD") =>
  entries.filter((e) => e.currency === currency);

export function totalsBy(entries: TreasuryEntry[], kind: TreasuryKind): Totals {
  return entries.filter((e) => e.kind === kind).reduce(accumulate, empty());
}

export interface CategoryTotals extends Totals {
  category: TreasuryCategory;
  label: string;
  collectionRate: number; // 0–100
}

export function byCategory(entries: TreasuryEntry[], kind: TreasuryKind): CategoryTotals[] {
  const map = new Map<TreasuryCategory, Totals>();
  for (const e of entries) {
    if (e.kind !== kind) continue;
    map.set(e.category, accumulate(map.get(e.category) ?? empty(), e));
  }
  return [...map.entries()]
    .map(([category, t]) => ({
      ...t,
      category,
      label: categoryLabel(category),
      collectionRate: t.committed > 0 ? (t.paid / t.committed) * 100 : t.paid > 0 ? 100 : 0,
    }))
    .sort((a, b) => b.committed - a.committed);
}

export function byMethod(entries: TreasuryEntry[]) {
  const map = new Map<string, number>();
  for (const e of entries) {
    if (e.paid <= 0) continue;
    const key = e.payment_method ? PAYMENT_METHOD_LABELS[e.payment_method] : "Unrecorded";
    map.set(key, (map.get(key) ?? 0) + e.paid);
  }
  return [...map.entries()]
    .map(([method, paid]) => ({ method, paid }))
    .sort((a, b) => b.paid - a.paid);
}

export interface MonthPoint {
  month: string; // YYYY-MM
  label: string;
  income: number;
  expense: number;
  net: number;
}

/** Cash-flow series over dated entries. Undated entries are excluded — they have no month. */
export function monthlyCashFlow(entries: TreasuryEntry[]): MonthPoint[] {
  const map = new Map<string, MonthPoint>();
  for (const e of entries) {
    if (!e.entry_date || e.paid <= 0) continue;
    const month = e.entry_date.slice(0, 7);
    const point =
      map.get(month) ??
      {
        month,
        label: new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        income: 0,
        expense: 0,
        net: 0,
      };
    if (e.kind === "income") point.income += e.paid;
    else point.expense += e.paid;
    point.net = point.income - point.expense;
    map.set(month, point);
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export interface PayerTotals extends Totals {
  payer: string;
  memberId: string | null;
}

/**
 * The same person is written differently across the secretary's sheets — "Surya Bahadur
 * Adhikari" in the dues list, "Rtn Surya Bahadur Adhikari" in the project pledges. Group
 * on a stripped, case-folded key so one person is one record.
 */
export const normalizePayer = (name: string) =>
  name
    .toLowerCase()
    .replace(/[.,]/g, " ")
    .replace(/\b(rtn|rtn's|dr|mr|mrs|ms|er|prof|pp|ipp|aks|phf)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Everyone who has money moving through the ledger, keyed by normalized name. */
function groupByPayer(entries: TreasuryEntry[], kind?: TreasuryKind) {
  const map = new Map<string, { row: PayerTotals; entries: TreasuryEntry[] }>();
  for (const e of entries) {
    if (kind && e.kind !== kind) continue;
    const name = (e.payer ?? "").trim();
    if (!name) continue;
    const key = normalizePayer(name);
    if (!key) continue;
    const bucket =
      map.get(key) ?? { row: { ...empty(), payer: name, memberId: e.member_id }, entries: [] };
    accumulate(bucket.row, e);
    // Keep the fullest spelling seen for display.
    if (name.length > bucket.row.payer.length) bucket.row.payer = name;
    // A linked member id anywhere in the group wins over a bare name.
    bucket.row.memberId ??= e.member_id;
    bucket.entries.push(e);
    map.set(key, bucket);
  }
  return map;
}

/** Who owes what, across every commitment ledger. Sorted by largest outstanding. */
export function receivablesByPayer(entries: TreasuryEntry[]): PayerTotals[] {
  return [...groupByPayer(entries, "income").values()]
    .map((b) => b.row)
    .filter((p) => p.outstanding > 0)
    .sort((a, b) => b.outstanding - a.outstanding);
}

export interface PersonRecord extends PayerTotals {
  entries: TreasuryEntry[];
  categories: CategoryTotals[];
  /** Project ids this person put money behind (pledged or paid). */
  projectIds: string[];
  duesCommitted: number;
  duesPaid: number;
  /** TRF giving stays in its own currency — never folded into the NPR totals. */
  trfUsd: number;
  lastPaymentDate: string | null;
}

/**
 * One row per person or organisation: what they committed, what they actually gave,
 * what is still open, and which projects it went to. Income only — a member's own
 * reimbursements are expenses of the club, not contributions by them.
 */
export function personRecords(entries: TreasuryEntry[]): PersonRecord[] {
  return [...groupByPayer(entries, "income").values()]
    .map(({ row, entries: own }) => {
      const npr = own.filter((e) => e.currency === "NPR");
      const dues = npr.filter((e) => e.category === "membership_dues");
      const dates = own.map((e) => (e.paid > 0 ? e.entry_date : null)).filter(Boolean) as string[];
      return {
        ...row,
        entries: own.sort((a, b) => (b.entry_date ?? "").localeCompare(a.entry_date ?? "")),
        categories: byCategory(npr, "income"),
        projectIds: [...new Set(own.map((e) => e.project_id).filter(Boolean) as string[])],
        duesCommitted: dues.reduce((s, e) => s + e.committed, 0),
        duesPaid: dues.reduce((s, e) => s + e.paid, 0),
        trfUsd: own.filter((e) => e.currency === "USD" && e.category === "trf").reduce((s, e) => s + e.paid, 0),
        lastPaymentDate: dates.sort().at(-1) ?? null,
      };
    })
    .sort((a, b) => b.paid - a.paid);
}

/** Money raised and money spent per project, for the project-level view. */
export interface ProjectTotals {
  projectId: string;
  raised: number;
  pledged: number;
  spent: number;
  contributors: number;
}

export function byProject(entries: TreasuryEntry[]): ProjectTotals[] {
  const map = new Map<string, ProjectTotals & { payers: Set<string> }>();
  for (const e of entries) {
    if (!e.project_id) continue;
    const t =
      map.get(e.project_id) ??
      { projectId: e.project_id, raised: 0, pledged: 0, spent: 0, contributors: 0, payers: new Set<string>() };
    if (e.kind === "income") {
      t.raised += e.paid;
      t.pledged += e.committed;
      if (e.payer) t.payers.add(e.payer.toLowerCase());
    } else {
      t.spent += e.paid;
    }
    map.set(e.project_id, t);
  }
  return [...map.values()]
    .map(({ payers, ...t }) => ({ ...t, contributors: payers.size }))
    .sort((a, b) => b.raised - a.raised);
}

export const fundAnnualInterest = (f: Pick<TreasuryFund, "principal" | "interest_rate">) =>
  (f.principal * f.interest_rate) / 100;

export function fundTotals(funds: TreasuryFund[]) {
  const live = funds.filter((f) => f.status === "active" || f.status === "due");
  return {
    principal: live.reduce((s, f) => s + f.principal, 0),
    annualInterest: live.reduce((s, f) => s + fundAnnualInterest(f), 0),
    pending: funds.filter((f) => f.status === "due").reduce((s, f) => s + f.principal, 0),
    count: live.length,
  };
}
