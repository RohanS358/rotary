"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Edit, Landmark, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatMoney, fundAnnualInterest, fundTotals } from "@/lib/treasury";
import type { TreasuryFund } from "@/lib/types";

const BLANK = {
  name: "", principal: "", institution: "", interest_rate: "", term_years: "",
  started_on: "", status: "active" as TreasuryFund["status"], utilization: "", notes: "",
};

const STATUS_STYLE: Record<TreasuryFund["status"], string> = {
  active: "bg-emerald-100 text-emerald-800",
  due: "bg-amber-100 text-amber-800",
  matured: "bg-blue-100 text-blue-800",
  closed: "bg-muted text-muted-foreground",
};

const chartConfig = {
  principal: { label: "Principal", color: "var(--chart-1)" },
  interest: { label: "Annual interest", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function TreasuryFunds({ funds, onChanged }: { funds: TreasuryFund[]; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TreasuryFund | null>(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const totals = fundTotals(funds);

  const openCreate = () => { setEditing(null); setForm(BLANK); setOpen(true); };
  const openEdit = (f: TreasuryFund) => {
    setEditing(f);
    setForm({
      name: f.name,
      principal: String(f.principal),
      institution: f.institution ?? "",
      interest_rate: String(f.interest_rate),
      term_years: f.term_years != null ? String(f.term_years) : "",
      started_on: f.started_on ?? "",
      status: f.status,
      utilization: f.utilization ?? "",
      notes: f.notes ?? "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Fund name is required");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      principal: parseFloat(form.principal) || 0,
      institution: form.institution.trim() || null,
      interest_rate: parseFloat(form.interest_rate) || 0,
      term_years: form.term_years ? parseInt(form.term_years) : null,
      started_on: form.started_on || null,
      status: form.status,
      utilization: form.utilization.trim() || null,
      notes: form.notes.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = editing
      ? await supabase.from("treasury_funds").update(payload).eq("id", editing.id)
      : await supabase.from("treasury_funds").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Fund updated" : "Fund added");
    setOpen(false);
    onChanged();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("treasury_funds").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Fund removed");
    onChanged();
  };

  const chartData = funds
    .filter((f) => f.status !== "closed")
    .map((f) => ({ name: f.name.replace(/^Late /, "").split(" ").slice(0, 3).join(" "), principal: f.principal, interest: fundAnnualInterest(f) }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5">
          <p className="text-2xl font-bold text-primary tabular-nums">{formatMoney(totals.principal)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total endowment principal</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-2xl font-bold text-[#f7a800] tabular-nums">{formatMoney(totals.annualInterest)}</p>
          <p className="text-xs text-muted-foreground mt-1">Interest available each year for projects</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-2xl font-bold text-amber-600 tabular-nums">{formatMoney(totals.pending)}</p>
          <p className="text-xs text-muted-foreground mt-1">Pledged principal not yet received</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">Endowment funds</CardTitle>
            <CardDescription>Principal held at partner institutions; the club spends only the yearly interest.</CardDescription>
          </div>
          <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Fund</Button>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 && (
            <ChartContainer config={chartConfig} className="h-64 w-full mb-6">
              <BarChart data={chartData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} interval={0} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatMoney(Number(v))} />} />
                <Bar dataKey="principal" fill="var(--color-principal)" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="principal" position="top" fontSize={10} className="fill-muted-foreground" formatter={(v: number) => formatMoney(v)} />
                </Bar>
                <Bar dataKey="interest" fill="var(--color-interest)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {funds.map((f) => (
              <div key={f.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm leading-snug">{f.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {f.institution ?? "Institution not recorded"}
                      {f.term_years ? ` · ${f.term_years} yr term` : ""}
                      {` · ${f.interest_rate}% p.a.`}
                    </p>
                  </div>
                  <Badge className={`${STATUS_STYLE[f.status]} text-[10px] capitalize shrink-0`}>{f.status}</Badge>
                </div>
                <div className="flex gap-6 mt-3">
                  <div>
                    <p className="text-sm font-semibold tabular-nums">{formatMoney(f.principal)}</p>
                    <p className="text-[10px] text-muted-foreground">Principal</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold tabular-nums text-[#f7a800]">{formatMoney(fundAnnualInterest(f))}</p>
                    <p className="text-[10px] text-muted-foreground">Interest / year</p>
                  </div>
                </div>
                {f.utilization && <p className="text-xs text-muted-foreground mt-2">Funds: {f.utilization}</p>}
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => openEdit(f)}>
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this fund?</AlertDialogTitle>
                        <AlertDialogDescription>{f.name} will be removed from the endowment register.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(f.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          {funds.length === 0 && (
            <div className="text-center py-14 text-muted-foreground">
              <Landmark className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No endowment funds recorded</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader><DialogTitle>{editing ? "Edit Fund" : "Add Fund"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2 overflow-y-auto flex-1 pr-1">
            <div>
              <Label>Fund name *</Label>
              <Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Late Khadgajeet Baral Rotary Food Bank" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Principal (NPR)</Label>
                <Input className="mt-1.5" type="number" min="0" value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} />
              </div>
              <div>
                <Label>Interest rate (% p.a.)</Label>
                <Input className="mt-1.5" type="number" min="0" step="0.01" value={form.interest_rate} onChange={(e) => setForm({ ...form, interest_rate: e.target.value })} />
              </div>
            </div>
            {(parseFloat(form.principal) > 0 && parseFloat(form.interest_rate) > 0) && (
              <p className="text-xs rounded-lg bg-[#f8faff] border border-border px-3 py-2">
                Yields <strong>{formatMoney((parseFloat(form.principal) * parseFloat(form.interest_rate)) / 100)}</strong> per year.
              </p>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Institution</Label>
                <Input className="mt-1.5" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Shree Investment" />
              </div>
              <div>
                <Label>Term (years)</Label>
                <Input className="mt-1.5" type="number" min="0" value={form.term_years} onChange={(e) => setForm({ ...form, term_years: e.target.value })} />
              </div>
              <div>
                <Label>Started</Label>
                <Input className="mt-1.5" type="date" value={form.started_on} onChange={(e) => setForm({ ...form, started_on: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as TreasuryFund["status"] })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active — principal held</SelectItem>
                  <SelectItem value="due">Due — pledged, not yet received</SelectItem>
                  <SelectItem value="matured">Matured</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Interest utilisation</Label>
              <Input className="mt-1.5" value={form.utilization} onChange={(e) => setForm({ ...form, utilization: e.target.value })} placeholder="What the yearly interest pays for" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea className="mt-1.5" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <Button onClick={save} disabled={saving} className="w-full">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editing ? "Save Changes" : "Add Fund"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
