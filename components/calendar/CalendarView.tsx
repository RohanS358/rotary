"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, MapPin, Clock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { CalendarEvent } from "@/lib/types";

// ── helpers ──────────────────────────────────────────────────────────────────
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function firstDayOfMonth(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit",
  });
}

// ── props ─────────────────────────────────────────────────────────────────────
interface Props {
  events: CalendarEvent[];
  /** When true, shows only the calendar grid (used by admin page which adds its own CRUD overlay) */
  readOnly?: boolean;
  /** Called by admin overlay when an event cell is clicked */
  onEventClick?: (event: CalendarEvent) => void;
}

// ── component ─────────────────────────────────────────────────────────────────
export default function CalendarView({ events, readOnly = false, onEventClick }: Props) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  // RSVP form state
  const [rsvp, setRsvp] = useState({ name: "", email: "", status: "going" });
  const [submitting, setSubmitting] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build day → events map for current month
  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    events.forEach(ev => {
      const d = new Date(ev.starts_at);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(ev);
      }
    });
    return map;
  }, [events, year, month]);

  const totalDays = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);
  const cells = Array.from({ length: startOffset + totalDays }, (_, i) =>
    i < startOffset ? null : i - startOffset + 1
  );
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const handleEventClick = (ev: CalendarEvent) => {
    if (onEventClick) { onEventClick(ev); return; }
    if (!readOnly) {
      setSelected(ev);
      setRsvp({ name: "", email: "", status: "going" });
      setRsvpDone(false);
    }
  };

  const submitRsvp = async () => {
    if (!selected) return;
    if (!rsvp.name.trim() || !rsvp.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("event_rsvps").insert({
      event_id: selected.id,
      name: rsvp.name.trim(),
      email: rsvp.email.trim(),
      status: rsvp.status,
    });
    setSubmitting(false);
    if (error) { toast.error("Could not submit RSVP — please try again"); return; }
    setRsvpDone(true);
    toast.success("RSVP submitted!");
  };

  return (
    <div className="relative">
      {/* ── Month navigation ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-full border border-[#c4d6ee] flex items-center justify-center text-[#17458f] hover:bg-[#17458f] hover:text-white hover:border-[#17458f] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-[#0f2252] font-bold text-lg tracking-tight">
          {MONTHS[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-full border border-[#c4d6ee] flex items-center justify-center text-[#17458f] hover:bg-[#17458f] hover:text-white hover:border-[#17458f] transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Day headers ───────────────────────────────────────────── */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-[#17458f]/50 tracking-widest uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-7 border-l border-t border-[#c4d6ee]/40 rounded-xl overflow-hidden">
        {cells.map((day, i) => {
          const isToday = day !== null && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const dayEvents = day ? (eventsByDay[day] ?? []) : [];

          return (
            <div
              key={i}
              className="border-r border-b border-[#c4d6ee]/40 min-h-[80px] p-1.5 bg-white"
            >
              {day !== null && (
                <>
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1 ${
                      isToday
                        ? "bg-[#17458f] text-white"
                        : "text-[#0f2252]/70"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map(ev => (
                      <button
                        key={ev.id}
                        onClick={() => handleEventClick(ev)}
                        className="w-full text-left text-[10px] font-medium px-1.5 py-0.5 rounded truncate text-white leading-tight hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: ev.color }}
                      >
                        {ev.title}
                      </button>
                    ))}
                    {dayEvents.length > 3 && (
                      <p className="text-[9px] text-[#17458f]/60 pl-1">+{dayEvents.length - 3} more</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Event detail + RSVP panel ─────────────────────────────── */}
      <AnimatePresence>
        {selected && !readOnly && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 38 }}
            >
              {/* Color bar */}
              <div className="h-2 w-full" style={{ backgroundColor: selected.color }} />

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: selected.color }}
                  >
                    {selected.category}
                  </span>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full border border-[#c4d6ee] flex items-center justify-center text-[#0f2252]/60 hover:bg-[#f0f5fc] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-[#0f2252] font-bold text-2xl leading-tight mb-4">
                  {selected.title}
                </h2>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-[#0f2252]/70">
                    <Calendar className="w-4 h-4 text-[#17458f]" />
                    {fmtDate(selected.starts_at)}
                  </div>
                  {!selected.all_day && (
                    <div className="flex items-center gap-2 text-sm text-[#0f2252]/70">
                      <Clock className="w-4 h-4 text-[#17458f]" />
                      {fmtTime(selected.starts_at)}
                      {selected.ends_at && ` – ${fmtTime(selected.ends_at)}`}
                    </div>
                  )}
                  {selected.location && (
                    <div className="flex items-center gap-2 text-sm text-[#0f2252]/70">
                      <MapPin className="w-4 h-4 text-[#17458f]" />
                      {selected.location}
                    </div>
                  )}
                </div>

                {selected.description && (
                  <p className="text-[#0f2252]/75 text-sm leading-relaxed mb-6 pb-6 border-b border-[#c4d6ee]/50">
                    {selected.description}
                  </p>
                )}

                {/* RSVP form */}
                {rsvpDone ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-semibold text-[#0f2252]">RSVP Received!</p>
                    <p className="text-sm text-[#0f2252]/60 mt-1">We&rsquo;ll see you there.</p>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold text-[#0f2252] mb-3">RSVP</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-[#0f2252]/70 block mb-1">Name *</label>
                        <input
                          type="text"
                          value={rsvp.name}
                          onChange={e => setRsvp(r => ({ ...r, name: e.target.value }))}
                          className="w-full border border-[#c4d6ee] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#17458f]/30"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#0f2252]/70 block mb-1">Email *</label>
                        <input
                          type="email"
                          value={rsvp.email}
                          onChange={e => setRsvp(r => ({ ...r, email: e.target.value }))}
                          className="w-full border border-[#c4d6ee] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#17458f]/30"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="flex gap-3">
                        {["going", "interested"].map(s => (
                          <button
                            key={s}
                            onClick={() => setRsvp(r => ({ ...r, status: s }))}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                              rsvp.status === s
                                ? "border-[#17458f] bg-[#17458f] text-white"
                                : "border-[#c4d6ee] text-[#0f2252]/70 hover:border-[#17458f]/50"
                            }`}
                          >
                            {s === "going" ? "Going" : "Interested"}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={submitRsvp}
                        disabled={submitting}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg, #17458f 0%, #1e5ba8 100%)" }}
                      >
                        {submitting ? "Submitting…" : "Confirm RSVP"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
