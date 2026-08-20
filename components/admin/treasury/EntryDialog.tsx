"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoriesFor, categoryLabel, PAYMENT_METHOD_LABELS, outstandingOf, formatMoney } from "@/lib/treasury";
import type { Member, PaymentMethod, Project, TreasuryCategory, TreasuryEntry, TreasuryKind } from "@/lib/types";

const BLANK = {
  kind: "income" as TreasuryKind,
  category: "membership_dues" as TreasuryCategory,
  label: "",
  member_id: "",
  project_id: "",
  payer: "",
  currency: "NPR" as "NPR" | "USD",
  committed: "",
  paid: "",
  payment_method: "",
  reference: "",
  entry_date: "",
  notes: "",
};

export default function EntryDialog({
  open,
  onOpenChange,
  editing,
  members,
  projects,
  ry,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: TreasuryEntry | null;
  members: Member[];
  projects: Project[];
  ry: string;
  onSaved: () => void;
}) {
  // Mounted fresh per entry (keyed by the caller), so initial state is the whole story.
  const [form, setForm] = useState(() =>
    editing
      ? {
          kind: editing.kind,
          category: editing.category,
          label: editing.label,
          member_id: editing.member_id ?? "",
          project_id: editing.project_id ?? "",
          payer: editing.payer ?? "",
          currency: editing.currency,
          committed: String(editing.committed),
          paid: String(editing.paid),
          payment_method: editing.payment_method ?? "",
          reference: editing.reference ?? "",
          entry_date: editing.entry_date ?? "",
          notes: editing.notes ?? "",
        }
      : BLANK
  );
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const set = <K extends keyof typeof BLANK>(k: K, v: (typeof BLANK)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const committed = parseFloat(form.committed) || 0;
  const paid = parseFloat(form.paid) || 0;
  const due = outstandingOf({ committed, paid });

  const save = async () => {
    if (!form.label.trim()) return toast.error("A description is required");
    if (committed < 0 || paid < 0) return toast.error("Amounts cannot be negative");
    setSaving(true);
    const payload = {
      ry,
      kind: form.kind,
      category: form.category,
      label: form.label.trim(),
      member_id: form.member_id || null,
      project_id: form.project_id || null,
      payer: form.payer.trim() || null,
      currency: form.currency,
      committed,
      paid,
      payment_method: (form.payment_method || null) as PaymentMethod | null,
      reference: form.reference.trim() || null,
      entry_date: form.entry_date || null,
      notes: form.notes.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = editing
      ? await supabase.from("treasury_entries").update(payload).eq("id", editing.id)
      : await supabase.from("treasury_entries").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Entry updated" : "Entry added");
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Entry" : "New Ledger Entry"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2 overflow-y-auto flex-1 pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select
                value={form.kind}
                onValueChange={(v) => {
                  const kind = v as TreasuryKind;
                  setForm((f) => ({ ...f, kind, category: categoriesFor(kind)[0] }));
                }}
              >
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Money In</SelectItem>
                  <SelectItem value="expense">Money Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v as TreasuryCategory)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categoriesFor(form.kind).map((c) => (
                    <SelectItem key={c} value={c}>{categoryLabel(c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Description *</Label>
            <Input
              className="mt-1.5"
              value={form.label}
              onChange={(e) => set("label", e.target.value)}
              placeholder="e.g. Annual dues RY 2025/26, Water filter purchase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Member</Label>
              <Select
                value={form.member_id || "none"}
                onValueChange={(v) => {
                  if (v === "none") return setForm((f) => ({ ...f, member_id: "" }));
                  const m = members.find((x) => x.id === v);
                  setForm((f) => ({ ...f, member_id: v, payer: m?.name ?? f.payer }));
                }}
              >
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Not a member" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not linked</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payer / Payee</Label>
              <Input
                className="mt-1.5"
                value={form.payer}
                onChange={(e) => set("payer", e.target.value)}
                placeholder="Name or company"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={(v) => set("currency", v as "NPR" | "USD")}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NPR">NPR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Committed</Label>
              <Input className="mt-1.5" type="number" min="0" step="0.01" value={form.committed} onChange={(e) => set("committed", e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label>{form.kind === "income" ? "Received" : "Paid"}</Label>
              <Input className="mt-1.5" type="number" min="0" step="0.01" value={form.paid} onChange={(e) => set("paid", e.target.value)} placeholder="0" />
            </div>
          </div>

          {due > 0 && (
            <p className="text-xs rounded-lg bg-amber-50 text-amber-800 border border-amber-200 px-3 py-2">
              Outstanding: <strong>{formatMoney(due, form.currency)}</strong> still {form.kind === "income" ? "to collect" : "to settle"}.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Payment Method</Label>
              <Select value={form.payment_method || "none"} onValueChange={(v) => set("payment_method", v === "none" ? "" : v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Unrecorded" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unrecorded</SelectItem>
                  {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
                    <SelectItem key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input className="mt-1.5" type="date" value={form.entry_date} onChange={(e) => set("entry_date", e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Linked project</Label>
            <Select value={form.project_id || "none"} onValueChange={(v) => set("project_id", v === "none" ? "" : v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Not tied to a project" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not tied to a project</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground mt-1">
              Links this pledge or cost to a service project, so each member&rsquo;s giving can be traced to what it funded.
            </p>
          </div>

          <div>
            <Label>Reference</Label>
            <Input className="mt-1.5" value={form.reference} onChange={(e) => set("reference", e.target.value)} placeholder="Cheque / receipt no." />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea className="mt-1.5" rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>

          <Button onClick={save} disabled={saving} className="w-full">
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {editing ? "Save Changes" : "Add Entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
