"use client";

import { useMemo, useState } from "react";
import { ExternalLink, FolderOpen, Search, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  categoryLabel, formatMoney, normalizePayer, outstandingOf, PAYMENT_METHOD_LABELS, personRecords, type PersonRecord,
} from "@/lib/treasury";
import type { Project, TreasuryEntry } from "@/lib/types";

export default function TreasuryPeople({
  entries, projects,
}: {
  entries: TreasuryEntry[];
  projects: Project[];
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<PersonRecord | null>(null);

  const projectById = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);
  const people = useMemo(() => personRecords(entries), [entries]);

  const rows = people.filter((p) => {
    if (filter === "owing" && p.outstanding <= 0) return false;
    if (filter === "settled" && p.outstanding > 0) return false;
    if (filter === "dues_unpaid" && !(p.duesCommitted > 0 && p.duesPaid < p.duesCommitted)) return false;
    if (filter === "projects" && p.projectIds.length === 0) return false;
    return normalizePayer(p.payer).includes(normalizePayer(q));
  });

  const totals = people.reduce(
    (a, p) => ({ paid: a.paid + p.paid, outstanding: a.outstanding + p.outstanding }),
    { paid: 0, outstanding: 0 }
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Member &amp; donor records</CardTitle>
          <CardDescription>
            {people.length} people and organisations have given or pledged this year —
            {" "}{formatMoney(totals.paid)} received, {formatMoney(totals.outstanding)} still open.
            Open a row for the full history and the projects it funded.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Find a person or company…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Everyone</SelectItem>
              <SelectItem value="owing">Has something outstanding</SelectItem>
              <SelectItem value="settled">Fully settled</SelectItem>
              <SelectItem value="dues_unpaid">Dues not fully paid</SelectItem>
              <SelectItem value="projects">Funded a project</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-36">Dues</TableHead>
              <TableHead>Contributed toward</TableHead>
              <TableHead className="text-right">Committed</TableHead>
              <TableHead className="text-right">Given</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead className="text-right">TRF</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => {
              const duesRate = p.duesCommitted > 0 ? (p.duesPaid / p.duesCommitted) * 100 : 0;
              return (
                <TableRow key={p.payer} className="cursor-pointer" onClick={() => setOpen(p)}>
                  <TableCell className="font-medium">
                    {p.payer}
                    {!p.memberId && <span className="ml-2 text-[10px] text-muted-foreground">(unlinked)</span>}
                  </TableCell>
                  <TableCell>
                    {p.duesCommitted > 0 ? (
                      <>
                        <Progress value={duesRate} className="h-1.5" />
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {formatMoney(p.duesPaid)} / {formatMoney(p.duesCommitted)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.categories.filter((c) => c.category !== "membership_dues").slice(0, 3).map((c) => (
                        <Badge key={c.category} variant="secondary" className="text-[10px] font-normal">{c.label}</Badge>
                      ))}
                      {p.projectIds.length > 0 && (
                        <Badge className="text-[10px] font-normal bg-primary/10 text-primary hover:bg-primary/10">
                          <FolderOpen className="w-3 h-3 mr-1" />{p.projectIds.length} project{p.projectIds.length > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(p.committed)}</TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-600 font-medium">{formatMoney(p.paid)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {p.outstanding > 0
                      ? <span className="text-amber-600 font-semibold">{formatMoney(p.outstanding)}</span>
                      : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-xs">
                    {p.trfUsd > 0 ? formatMoney(p.trfUsd, "USD") : "—"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-xs">View</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {rows.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Nobody matches these filters</p>
          </div>
        )}
      </div>

      {/* Person detail */}
      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{open?.payer}</DialogTitle>
          </DialogHeader>
          {open && (
            <div className="space-y-5 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { l: "Committed", v: formatMoney(open.committed), c: "text-foreground" },
                  { l: "Given", v: formatMoney(open.paid), c: "text-emerald-600" },
                  { l: "Outstanding", v: formatMoney(open.outstanding), c: "text-amber-600" },
                  { l: "TRF (USD)", v: open.trfUsd > 0 ? formatMoney(open.trfUsd, "USD") : "—", c: "text-[#f7a800]" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg border border-border p-3">
                    <p className={`text-lg font-bold tabular-nums ${s.c}`}>{s.v}</p>
                    <p className="text-[11px] text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>

              {open.lastPaymentDate && (
                <p className="text-xs text-muted-foreground">
                  Last payment recorded {new Date(open.lastPaymentDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
                </p>
              )}

              {open.projectIds.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Projects supported</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {open.projectIds.map((id) => {
                      const project = projectById.get(id);
                      if (!project) return null;
                      const given = open.entries
                        .filter((e) => e.project_id === id)
                        .reduce((s, e) => s + e.paid, 0);
                      return (
                        <Link
                          key={id}
                          href="/admin/projects"
                          className="rounded-lg border border-border p-3 hover:border-primary/40 transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary">{project.title}</p>
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{project.category}</p>
                          <p className="text-xs font-semibold text-emerald-600 mt-1 tabular-nums">{formatMoney(given)} contributed</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold mb-2">Full history</p>
                <div className="rounded-lg border border-border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Committed</TableHead>
                        <TableHead className="text-right">Given</TableHead>
                        <TableHead className="text-right">Due</TableHead>
                        <TableHead>Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {open.entries.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="text-xs whitespace-nowrap">
                            {e.entry_date ? new Date(e.entry_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {e.label}
                            {e.project_id && projectById.get(e.project_id) && (
                              <span className="block text-[10px] text-primary">→ {projectById.get(e.project_id)!.title}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-[10px] font-normal">{categoryLabel(e.category)}</Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm">{formatMoney(e.committed, e.currency)}</TableCell>
                          <TableCell className="text-right tabular-nums text-sm text-emerald-600">{formatMoney(e.paid, e.currency)}</TableCell>
                          <TableCell className="text-right tabular-nums text-sm">
                            {outstandingOf(e) > 0 ? <span className="text-amber-600">{formatMoney(outstandingOf(e), e.currency)}</span> : "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {e.payment_method ? PAYMENT_METHOD_LABELS[e.payment_method] : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
