"use client";

import { useMemo } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  XAxis, YAxis, LabelList,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Clock, Landmark, TrendingUp, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import {
  byCategory, byMethod, formatMoney, fundTotals, inCurrency, monthlyCashFlow, totalsBy,
} from "@/lib/treasury";
import type { TreasuryEntry, TreasuryFund } from "@/lib/types";

const SLICE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "#7c3aed", "#0d9488", "#db2777"];

const chartConfig = {
  income: { label: "Money in", color: "var(--chart-4)" },
  expense: { label: "Money out", color: "var(--chart-5)" },
  net: { label: "Net", color: "var(--chart-1)" },
  paid: { label: "Received", color: "var(--chart-1)" },
  outstanding: { label: "Outstanding", color: "var(--chart-2)" },
  value: { label: "Amount" },
} satisfies ChartConfig;

function Stat({
  label, value, sub, icon: Icon, tone,
}: {
  label: string; value: string; sub: string;
  icon: LucideIcon; tone: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tone}15` }}>
            <Icon className="w-4 h-4" style={{ color: tone }} />
          </div>
        </div>
        <p className="text-2xl font-bold tabular-nums" style={{ color: tone }}>{value}</p>
        <p className="text-xs font-medium text-foreground mt-1">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

export default function TreasuryOverview({
  entries, funds,
}: {
  entries: TreasuryEntry[];
  funds: TreasuryFund[];
}) {
  const npr = useMemo(() => inCurrency(entries, "NPR"), [entries]);
  const usd = useMemo(() => inCurrency(entries, "USD"), [entries]);

  const income = totalsBy(npr, "income");
  const expense = totalsBy(npr, "expense");
  const usdIncome = totalsBy(usd, "income");
  const net = income.paid - expense.paid;
  const funded = fundTotals(funds);

  const incomeCats = useMemo(() => byCategory(npr, "income"), [npr]);
  const expenseCats = useMemo(() => byCategory(npr, "expense"), [npr]);
  const flow = useMemo(() => monthlyCashFlow(npr), [npr]);
  const methods = useMemo(() => byMethod(npr), [npr]);

  const collectionRate = income.committed > 0 ? (income.paid / income.committed) * 100 : 0;

  const pledgeData = incomeCats.map((c) => ({
    label: c.label,
    paid: c.paid,
    outstanding: c.outstanding,
  }));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <Stat
          label="Received this year"
          value={formatMoney(income.paid)}
          sub={`of ${formatMoney(income.committed)} committed`}
          icon={ArrowUpRight}
          tone="#16a34a"
        />
        <Stat
          label="Spent this year"
          value={formatMoney(expense.paid)}
          sub={`${formatMoney(expense.outstanding)} still to settle`}
          icon={ArrowDownRight}
          tone="#e74c3c"
        />
        <Stat
          label="Net position"
          value={formatMoney(net)}
          sub={net >= 0 ? "Surplus in hand" : "Deficit — spending exceeds receipts"}
          icon={TrendingUp}
          tone={net >= 0 ? "#17458f" : "#e74c3c"}
        />
        <Stat
          label="Yet to be collected"
          value={formatMoney(income.outstanding)}
          sub={`across ${income.count} commitments`}
          icon={Clock}
          tone="#f7a800"
        />
        <Stat
          label="Endowment principal"
          value={formatMoney(funded.principal)}
          sub={`${formatMoney(funded.annualInterest)}/yr interest · ${funded.count} funds`}
          icon={Landmark}
          tone="#009dd9"
        />
      </div>

      {/* Collection progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Collection progress</CardTitle>
          <CardDescription>
            {collectionRate.toFixed(0)}% of everything pledged this Rotary year has actually reached the club account.
            {usdIncome.paid > 0 && ` TRF giving of ${formatMoney(usdIncome.paid, "USD")} is tracked separately in USD.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={collectionRate} className="h-2" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {incomeCats.map((c) => (
              <div key={c.category} className="rounded-lg border border-border p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium truncate">{c.label}</p>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{c.collectionRate.toFixed(0)}%</span>
                </div>
                <Progress value={c.collectionRate} className="h-1.5 my-2" />
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {formatMoney(c.paid)} in · {c.outstanding > 0 ? `${formatMoney(c.outstanding)} pending` : "fully collected"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pledged vs received */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pledged vs received</CardTitle>
            <CardDescription>Where the money was promised, and how much of it arrived.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <BarChart data={pledgeData} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" width={130} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatMoney(Number(v))} />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="paid" stackId="a" fill="var(--color-paid)" radius={[4, 0, 0, 4]} />
                <Bar dataKey="outstanding" stackId="a" fill="var(--color-outstanding)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense split */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Where the money went</CardTitle>
            <CardDescription>Expenditure by category, settled amounts only.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="label" formatter={(v) => formatMoney(Number(v))} />} />
                <Pie
                  data={expenseCats.filter((c) => c.paid > 0).map((c) => ({ label: c.label, value: c.paid }))}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={55}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {expenseCats.map((_, i) => <Cell key={i} fill={SLICE[i % SLICE.length]} />)}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="label" />} className="flex-wrap gap-2" />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cash flow */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly cash flow</CardTitle>
          <CardDescription>Dated receipts and payments. Entries without a date are excluded.</CardDescription>
        </CardHeader>
        <CardContent>
          {flow.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">
              No dated transactions yet — add dates to ledger entries to build this chart.
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <AreaChart data={flow} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={70} tickFormatter={(v) => formatMoney(Number(v))} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatMoney(Number(v))} />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area dataKey="income" type="monotone" stroke="var(--color-income)" fill="var(--color-income)" fillOpacity={0.15} strokeWidth={2} />
                <Area dataKey="expense" type="monotone" stroke="var(--color-expense)" fill="var(--color-expense)" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Payment methods */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">How money moved</CardTitle>
          <CardDescription>Settled amounts by payment channel — useful when reconciling the Prime account.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart data={methods.map((m) => ({ ...m, label: m.method }))} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatMoney(Number(v))} />} />
              <Bar dataKey="paid" radius={6}>
                {methods.map((_, i) => <Cell key={i} fill={SLICE[i % SLICE.length]} />)}
                <LabelList dataKey="paid" position="top" className="fill-muted-foreground" fontSize={10} formatter={(v: number) => formatMoney(v)} />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
