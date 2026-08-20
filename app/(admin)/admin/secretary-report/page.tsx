"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TreasuryOverview from "@/components/admin/treasury/TreasuryOverview";
import TreasuryLedger from "@/components/admin/treasury/TreasuryLedger";
import TreasuryPeople from "@/components/admin/treasury/TreasuryPeople";
import TreasuryFunds from "@/components/admin/treasury/TreasuryFunds";
import { categoryLabel, outstandingOf, PAYMENT_METHOD_LABELS } from "@/lib/treasury";
import type { Member, Project, TreasuryEntry, TreasuryFund } from "@/lib/types";

/** July–June Rotary year containing today, e.g. "2025/26". */
function currentRy(d = new Date()) {
  const start = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
  return `${start}/${String((start + 1) % 100).padStart(2, "0")}`;
}

const RY_OPTIONS = (() => {
  const [start] = currentRy().split("/").map(Number);
  return [1, 0, -1, -2].map((o) => `${start + o}/${String((start + o + 1) % 100).padStart(2, "0")}`);
})();

function toCsv(entries: TreasuryEntry[]) {
  const head = ["Date", "Flow", "Category", "Description", "Payer/Payee", "Currency", "Committed", "Settled", "Outstanding", "Method", "Reference", "Notes"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = entries.map((e) =>
    [
      e.entry_date ?? "",
      e.kind === "income" ? "Money in" : "Money out",
      categoryLabel(e.category),
      e.label,
      e.payer ?? "",
      e.currency,
      e.committed,
      e.paid,
      outstandingOf(e),
      e.payment_method ? PAYMENT_METHOD_LABELS[e.payment_method] : "",
      e.reference ?? "",
      e.notes ?? "",
    ].map(esc).join(",")
  );
  return [head.map(esc).join(","), ...lines].join("\n");
}

export default function SecretaryReportPage() {
  const [ry, setRy] = useState(currentRy());
  const [entries, setEntries] = useState<TreasuryEntry[]>([]);
  const [funds, setFunds] = useState<TreasuryFund[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  const load = async () => {
    const [e, f, m, pr] = await Promise.all([
      supabase.from("treasury_entries").select("*").eq("ry", ry).order("entry_date", { ascending: true, nullsFirst: false }),
      supabase.from("treasury_funds").select("*").order("principal", { ascending: false }),
      supabase.from("members").select("*").eq("active", true).order("name"),
      supabase.from("projects").select("*").eq("active", true).order("title"),
    ]);
    if (e.error) toast.error(`Ledger: ${e.error.message}`);
    if (f.error) toast.error(`Funds: ${f.error.message}`);
    setEntries(e.data ?? []);
    setFunds(f.data ?? []);
    setMembers(m.data ?? []);
    setProjects(pr.data ?? []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [ry]);

  const exportCsv = () => {
    if (entries.length === 0) return toast.error("Nothing to export");
    const url = URL.createObjectURL(new Blob([toCsv(entries)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `secretary-report-${ry.replace("/", "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Secretary Report</h1>
            <p className="text-muted-foreground text-sm">
              Treasury, commitments and endowments for Rotary Year {ry}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={ry} onValueChange={(v) => { setLoading(true); setRy(v); }}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              {RY_OPTIONS.map((o) => <SelectItem key={o} value={o}>RY {o}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={exportCsv}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="funds">Endowments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TreasuryOverview entries={entries} funds={funds} projects={projects} />
          </TabsContent>
          <TabsContent value="ledger">
            <TreasuryLedger entries={entries} members={members} projects={projects} ry={ry} onChanged={load} />
          </TabsContent>
          <TabsContent value="people">
            <TreasuryPeople entries={entries} projects={projects} />
          </TabsContent>
          <TabsContent value="funds">
            <TreasuryFunds funds={funds} onChanged={load} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
