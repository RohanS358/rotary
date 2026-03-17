import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CalendarView from "@/components/calendar/CalendarView";
import type { CalendarEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Upcoming events and activities by Rotary Club of Pashupati Kathmandu — RSVP online.",
};

export default async function CalendarPage() {
  let events: CalendarEvent[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("calendar_events")
      .select("*")
      .order("starts_at", { ascending: true });
    if (data) events = data;
  } catch { /* return empty */ }

  return (
    <div className="min-h-screen bg-[#f0f5fc]">
      {/* Hero */}
      <div
        className="relative py-20 lg:py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2252 0%, #17458f 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block text-[#f7a800] text-[11px] font-bold tracking-[0.32em] uppercase mb-3">
            Events &amp; Activities
          </span>
          <h1 className="font-extrabold tracking-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Club Calendar
          </h1>
          <p className="text-white/70 mt-4 max-w-xl mx-auto text-base lg:text-lg">
            Browse upcoming events, meetings, and service activities. Click any event to RSVP.
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-[#c4d6ee]/60 p-6 lg:p-8">
          <CalendarView events={events} />
        </div>
      </div>
    </div>
  );
}
