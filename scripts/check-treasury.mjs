// self-check for lib/treasury.ts aggregation, run against the seeded workbook figures:
//   node scripts/check-treasury.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Node strips the type-only import, so the module loads straight from source.
const { totalsBy, byCategory, monthlyCashFlow, receivablesByPayer, outstandingOf, fundTotals } =
  await import(new URL("../lib/treasury.ts", import.meta.url).href);

// Parse the seed SQL so the check is anchored to the real workbook numbers.
const sql = readFileSync(new URL("../supabase-treasury-seed.sql", import.meta.url), "utf8");
const rows = [...sql.matchAll(
  /^ {2}\('(income|expense)','(\w+)','((?:[^']|'')*)',(null|'(?:[^']|'')*'),'(NPR|USD)',([\d.]+),([\d.]+),(null|'\w+'),(?:null|'(?:[^']|'')*'),(null|'[\d-]+'::date)/gm
)].map((m) => ({
  kind: m[1],
  category: m[2],
  label: m[3],
  payer: m[4] === "null" ? null : m[4].slice(1, -1),
  currency: m[5],
  committed: +m[6],
  paid: +m[7],
  payment_method: m[8] === "null" ? null : m[8].slice(1, -1),
  entry_date: m[9] === "null" ? null : m[9].slice(1, 11),
  member_id: null,
}));

assert.equal(rows.length, 173, "seed row count");
const npr = rows.filter((r) => r.currency === "NPR");

// Workbook totals (Secretary reports 30 july.xlsx) must survive the aggregation.
const income = totalsBy(npr, "income");
const expense = totalsBy(npr, "expense");
assert.equal(income.paid, 857308, "NPR income received");
assert.equal(expense.paid, 548300, "NPR expense paid");
assert.equal(income.outstanding, income.committed - income.paid, "outstanding = committed - paid when no overpayment");

const cats = Object.fromEntries(byCategory(npr, "income").map((c) => [c.category, c]));
assert.equal(cats.membership_dues.paid, 273500, "dues sheet total");   // workbook C63
assert.equal(cats.souvenir.committed, 590000, "souvenir pledged");     // workbook D39
assert.equal(cats.souvenir.paid, 160000, "souvenir received");         // workbook E39
assert.equal(cats.installation.paid, 82500, "installation charges");   // workbook E63
assert.equal(cats.smile_a_while.paid, 15808, "smile-a-while");
assert.equal(cats.service_project.paid, 277000, "service project pledges received");
assert.equal(Math.round(cats.souvenir.collectionRate), 27, "collection rate %");
assert.equal(totalsBy(rows.filter((r) => r.currency === "USD"), "income").paid, 360, "TRF USD");

// Currencies must not be mixed.
assert.notEqual(totalsBy(rows, "income").paid, income.paid, "USD rows leak in when unfiltered — always scope by currency");

// Overpayment never becomes a negative receivable.
assert.equal(outstandingOf({ committed: 1000, paid: 1500 }), 0);

// Cash flow only counts dated, actually-received money.
const flow = monthlyCashFlow(npr);
assert.ok(flow.length > 0 && flow.every((p) => p.net === p.income - p.expense), "net = income - expense");
assert.ok(flow.every((p, i) => i === 0 || flow[i - 1].month < p.month), "months ascending");
assert.ok(flow.reduce((s, p) => s + p.income, 0) < income.paid, "undated receipts excluded from the flow chart");

// Receivables.
const owed = receivablesByPayer(npr);
assert.ok(owed.every((p, i) => i === 0 || owed[i - 1].outstanding >= p.outstanding), "sorted by outstanding");
assert.ok(owed.every((p) => p.outstanding > 0), "settled payers dropped");
assert.equal(owed.find((p) => p.payer === "Raj Kumar Acharya"), undefined, "fully-paid dues are not a receivable");

// Funds.
const f = fundTotals([
  { principal: 1000000, interest_rate: 11, status: "active" },
  { principal: 500000, interest_rate: 11, status: "due" },
  { principal: 900000, interest_rate: 11, status: "closed" },
]);
assert.equal(f.principal, 1500000, "closed funds excluded");
assert.equal(f.annualInterest, 165000);
assert.equal(f.pending, 500000);

console.log(`✓ treasury aggregation OK — ${rows.length} seeded entries, Rs ${income.paid.toLocaleString()} in / Rs ${expense.paid.toLocaleString()} out`);
