"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryLabel, formatMoney, inCurrency, outstandingOf, receivablesByPayer } from "@/lib/treasury";
import type { TreasuryEntry } from "@/lib/types";

export default function TreasuryReceivables({ entries }: { entries: TreasuryEntry[] }) {
  const [q, setQ] = useState("");
  const npr = useMemo(() => inCurrency(entries, "NPR"), [entries]);
  const owed = useMemo(() => receivablesByPayer(npr), [npr]);

  const filtered = owed.filter((p) => p.payer.toLowerCase().includes(q.trim().toLowerCase()));
  const total = owed.reduce((s, p) => s + p.outstanding, 0);

  const detailFor = (payer: string) =>
    npr.filter((e) => e.kind === "income" && e.payer?.toLowerCase() === payer.toLowerCase() && outstandingOf(e) > 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Outstanding commitments</CardTitle>
          <CardDescription>
            {formatMoney(total)} pledged but not yet received, from {owed.length} people and organisations.
            This is the follow-up list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Find a person or company…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payer</TableHead>
              <TableHead>Pending against</TableHead>
              <TableHead className="w-40">Paid so far</TableHead>
              <TableHead className="text-right">Committed</TableHead>
              <TableHead className="text-right">Received</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const rate = p.committed > 0 ? (p.paid / p.committed) * 100 : 0;
              return (
                <TableRow key={p.payer}>
                  <TableCell className="font-medium">
                    {p.payer}
                    {!p.memberId && <span className="ml-2 text-[10px] text-muted-foreground">(unlinked)</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {[...new Set(detailFor(p.payer).map((e) => e.category))].map((c) => (
                        <Badge key={c} variant="secondary" className="text-[10px] font-normal">{categoryLabel(c)}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell><Progress value={rate} className="h-1.5" /></TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(p.committed)}</TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-600">{formatMoney(p.paid)}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold text-amber-600">{formatMoney(p.outstanding)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-medium">{owed.length === 0 ? "Everything pledged has been collected" : "No match"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
