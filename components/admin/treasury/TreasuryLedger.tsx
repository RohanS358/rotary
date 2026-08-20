"use client";

import { useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CATEGORY_META, categoryLabel, formatMoney, outstandingOf, PAYMENT_METHOD_LABELS } from "@/lib/treasury";
import type { Member, Project, TreasuryCategory, TreasuryEntry } from "@/lib/types";
import EntryDialog from "./EntryDialog";

export default function TreasuryLedger({
  entries, members, projects, ry, onChanged,
}: {
  entries: TreasuryEntry[];
  members: Member[];
  projects: Project[];
  ry: string;
  onChanged: () => void;
}) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TreasuryEntry | null>(null);
  const supabase = createClient();

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter((e) => {
      if (kind !== "all" && e.kind !== kind) return false;
      if (category !== "all" && e.category !== category) return false;
      const due = outstandingOf(e);
      if (status === "outstanding" && due <= 0) return false;
      if (status === "settled" && due > 0) return false;
      if (status === "unrecorded" && e.paid > 0) return false;
      if (!needle) return true;
      return [e.label, e.payer, e.reference, e.notes].some((v) => v?.toLowerCase().includes(needle));
    });
  }, [entries, q, kind, category, status]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("treasury_entries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Entry deleted");
    onChanged();
  };

  const openEdit = (e: TreasuryEntry) => { setEditing(e); setOpen(true); };
  const openCreate = () => { setEditing(null); setOpen(true); };

  const shown = rows.reduce(
    (a, e) => {
      if (e.currency !== "NPR") return a;
      const sign = e.kind === "income" ? 1 : -1;
      a.paid += sign * e.paid;
      a.due += outstandingOf(e);
      return a;
    },
    { paid: 0, due: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-56">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search description, payer, cheque no…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={kind} onValueChange={(v) => { setKind(v); setCategory("all"); }}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All flows</SelectItem>
            <SelectItem value="income">Money in</SelectItem>
            <SelectItem value="expense">Money out</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(Object.keys(CATEGORY_META) as TreasuryCategory[])
              .filter((c) => kind === "all" || CATEGORY_META[c].kind === kind)
              .map((c) => <SelectItem key={c} value={c}>{categoryLabel(c)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="outstanding">Outstanding</SelectItem>
            <SelectItem value="settled">Settled</SelectItem>
            <SelectItem value="unrecorded">Nothing paid</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> New Entry</Button>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>{rows.length} of {entries.length} entries</span>
        <span>Net shown (NPR): <strong className={shown.paid >= 0 ? "text-emerald-600" : "text-destructive"}>{formatMoney(shown.paid)}</strong></span>
        <span>Outstanding shown: <strong className="text-amber-600">{formatMoney(shown.due)}</strong></span>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Payer / Payee</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Committed</TableHead>
              <TableHead className="text-right">Settled</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((e) => {
              const due = outstandingOf(e);
              return (
                <TableRow key={e.id}>
                  <TableCell className="font-medium max-w-64">
                    <span className="line-clamp-1">{e.label}</span>
                    {e.reference && <span className="text-[11px] text-muted-foreground">Ref {e.reference}</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.payer ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[11px] font-normal">{categoryLabel(e.category)}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(e.committed, e.currency)}</TableCell>
                  <TableCell className={`text-right tabular-nums ${e.kind === "income" ? "text-emerald-600" : "text-destructive"}`}>
                    {e.kind === "expense" && e.paid > 0 ? "−" : ""}{formatMoney(e.paid, e.currency)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {due > 0 ? <span className="text-amber-600 font-medium">{formatMoney(due, e.currency)}</span> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {e.payment_method ? PAYMENT_METHOD_LABELS[e.payment_method] : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {e.entry_date ? new Date(e.entry_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(e)}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              &ldquo;{e.label}&rdquo; will be permanently removed from the ledger and every total recalculated.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(e.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {rows.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No entries match these filters</p>
          </div>
        )}
      </div>

      <EntryDialog key={editing?.id ?? "new"} open={open} onOpenChange={setOpen} editing={editing} members={members} projects={projects} ry={ry} onSaved={onChanged} />
    </div>
  );
}
