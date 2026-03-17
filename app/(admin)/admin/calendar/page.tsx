"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Loader2, ChevronLeft, ChevronRight, MapPin, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { CalendarEvent } from "@/lib/types";

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const PRESET_COLORS = ["#17458f","#f7a800","#16a34a","#e74c3c","#7c3aed","#0891b2","#ea580c","#0f2252"];
const EVENT_CATEGORIES = ["General","Meeting","Service","Fellowship","Fundraising","Training","Other"];

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }

type FormState = {
  title: string; description: string; location: string;
  starts_at: string; ends_at: string; all_day: boolean;
  category: string; color: string;
};
const EMPTY: FormState = {
  title: "", description: "", location: "",
  starts_at: "", ends_at: "", all_day: false,
  category: "General", color: "#17458f",
};

export default function AdminCalendarPage() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen]   = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const[prefillDate, setPrefillDate] = useState("");
  const supabase = createClient();

  const fetchEvents = async () => {
    const [evRes, rsvpRes] = await Promise.all([
      supabase.from("calendar_events").select("*").order("starts_at"),
      supabase.from("event_rsvps").select("event_id"),
    ]);
    if (evRes.data)   setEvents(evRes.data);
    if (rsvpRes.data) {
      const counts: Record<string, number> = {};
      rsvpRes.data.forEach(r => { counts[r.event_id] = (counts[r.event_id] ?? 0) + 1; });
      setRsvpCounts(counts);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

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

  const totalDays  = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);
  const cells = Array.from({ length: startOffset + totalDays }, (_, i) => i < startOffset ? null : i - startOffset + 1);
  while (cells.length % 7 !== 0) cells.push(null);

  const openCreate = (day?: number) => {
    setEditing(null);
    const dateStr = day
      ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T09:00`
      : "";
    setForm({ ...EMPTY, starts_at: dateStr });
    setPrefillDate(dateStr);
    setIsOpen(true);
  };
  const openEdit = (ev: CalendarEvent) => {
    setEditing(ev);
    setForm({
      title: ev.title, description: ev.description ?? "", location: ev.location ?? "",
      starts_at: ev.starts_at.slice(0, 16), ends_at: ev.ends_at ? ev.ends_at.slice(0, 16) : "",
      all_day: ev.all_day, category: ev.category, color: ev.color,
    });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim())    { toast.error("Title required"); return; }
    if (!form.starts_at.trim()) { toast.error("Start date/time required"); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title, description: form.description || null,
        location: form.location || null,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        all_day: form.all_day, category: form.category, color: form.color,
        updated_at: new Date().toISOString(),
      };
      if (editing) {
        await supabase.from("calendar_events").update(payload).eq("id", editing.id);
        toast.success("Event updated");
      } else {
        await supabase.from("calendar_events").insert(payload);
        toast.success("Event created");
      }
      setIsOpen(false);
      fetchEvents();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error saving event");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("calendar_events").delete().eq("id", id);
    toast.success("Event deleted");
    fetchEvents();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground text-sm">{events.length} events</p>
        </div>
        <Button onClick={() => openCreate()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      {/* ── Month navigation ── */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-accent transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-lg">{MONTHS[month]} {year}</h3>
          <button onClick={nextMonth} className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-accent transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-muted-foreground tracking-widest uppercase py-1">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 border-l border-t border-border rounded-xl overflow-hidden">
          {cells.map((day, i) => {
            const isToday = day !== null && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            const dayEvents = day ? (eventsByDay[day] ?? []) : [];
            return (
              <div
                key={i}
                className="border-r border-b border-border min-h-[90px] p-1.5 bg-white hover:bg-accent/30 cursor-pointer transition-colors"
                onClick={() => day && openCreate(day)}
              >
                {day !== null && (
                  <>
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1 ${isToday ? "bg-primary text-white" : "text-foreground/70"}`}>
                      {day}
                    </span>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map(ev => (
                        <button
                          key={ev.id}
                          onClick={e => { e.stopPropagation(); openEdit(ev); }}
                          className="w-full text-left text-[10px] font-medium px-1.5 py-0.5 rounded truncate text-white leading-tight hover:opacity-75 transition-opacity"
                          style={{ backgroundColor: ev.color }}
                        >
                          {ev.title}
                          {rsvpCounts[ev.id] ? ` (${rsvpCounts[ev.id]})` : ""}
                        </button>
                      ))}
                      {dayEvents.length > 3 && (
                        <p className="text-[9px] text-muted-foreground pl-1">+{dayEvents.length - 3} more</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">Click a day to add an event · Click an event to edit</p>
      </div>

      {/* ── Upcoming events list ── */}
      <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-widest mb-3">All Events</h2>
      <div className="space-y-3">
        {events
          .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
          .map(ev => (
          <div key={ev.id} className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: ev.color }}>
              {new Date(ev.starts_at).getDate()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm">{ev.title}</p>
                <Badge className="text-xs text-white" style={{ backgroundColor: ev.color }}>{ev.category}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(ev.starts_at).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
                  {!ev.all_day && ` · ${new Date(ev.starts_at).toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit" })}`}
                </span>
                {ev.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {ev.location}
                  </span>
                )}
                {rsvpCounts[ev.id] !== undefined && (
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <Users className="w-3 h-3" /> {rsvpCounts[ev.id]} RSVP{rsvpCounts[ev.id] !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEdit(ev)}>
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete &quot;{ev.title}&quot; and all RSVPs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(ev.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
      {events.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No events yet. Click a day or &ldquo;Add Event&rdquo; to get started.</p>
        </div>
      )}

      {/* ── Add/Edit dialog ── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Event" : "New Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[72vh] overflow-y-auto pr-1">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start *</Label>
                <Input type="datetime-local" value={form.starts_at} onChange={e => setForm(f => ({ ...f, starts_at: e.target.value }))} className="mt-1.5 text-sm" />
              </div>
              <div>
                <Label>End</Label>
                <Input type="datetime-local" value={form.ends_at} onChange={e => setForm(f => ({ ...f, ends_at: e.target.value }))} className="mt-1.5 text-sm" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.all_day} onCheckedChange={v => setForm(f => ({ ...f, all_day: v }))} />
              <Label>All Day Event</Label>
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="mt-1.5" placeholder="Venue or address" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="mt-1.5" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Color</Label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setForm(f => ({ ...f, color: c }))}
                      className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${form.color === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editing ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
