import Link from "next/link";
import { Newspaper, BookOpen, CalendarDays, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost, Publication, CalendarEvent } from "@/lib/types";

function fmtDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function fmtEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

const CATEGORY_COLORS: Record<string, string> = {
  Newsletter: "#17458f", "Annual Report": "#f7a800", Bulletin: "#16a34a", Other: "#7c3aed",
  Minutes: "#0891b2",
  General: "#17458f", "Club Update": "#f7a800", Community: "#16a34a", Health: "#e74c3c",
  Education: "#3b82f6", Environment: "#16a34a",
};

export default async function NewsPublicationsCalendar() {
  const supabase = await createClient();

  const [newsRes, pubsRes, eventsRes] = await Promise.all([
    supabase
      .from("news_posts")
      .select("id,title,slug,excerpt,category,author,published_at,created_at,cover_image_url")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(5),
    supabase
      .from("publications")
      .select("id,title,description,category,published_at,created_at,file_url")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(5),
    supabase
      .from("calendar_events")
      .select("id,title,starts_at,ends_at,all_day,category,color,location")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(5),
  ]);

  const news:   NewsPost[]      = (newsRes.data   ?? []) as NewsPost[];
  const pubs:   Publication[]   = (pubsRes.data   ?? []) as Publication[];
  const events: CalendarEvent[] = (eventsRes.data ?? []) as CalendarEvent[];

  return (
    <section className="bg-[#f0f5fc] py-16 lg:py-24">
      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <span className="text-[#17458f] text-[11px] font-bold tracking-[0.32em] uppercase">
          Stay Informed
        </span>
        <h2
          className="text-[#0f2252] font-extrabold tracking-tight mt-2"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
        >
          Latest Updates
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">

          {/* ── News column ──────────────────────────────────────────── */}
          <Column
            icon={<Newspaper className="w-5 h-5" />}
            title="News"
            href="/news"
            accentColor="#17458f"
          >
            {news.length === 0 ? (
              <EmptyState label="No news yet" />
            ) : (
              news.map(post => (
                <Link key={post.id} href={`/news/${post.slug}`} className="group block">
                  <ItemCard
                    label={post.category}
                    title={post.title}
                    date={fmtDate(post.published_at ?? post.created_at)}
                    color={CATEGORY_COLORS[post.category] ?? "#17458f"}
                  />
                </Link>
              ))
            )}
          </Column>

          {/* ── Publications column ───────────────────────────────────── */}
          <Column
            icon={<BookOpen className="w-5 h-5" />}
            title="Publications"
            href="/publications"
            accentColor="#f7a800"
          >
            {pubs.length === 0 ? (
              <EmptyState label="No publications yet" />
            ) : (
              pubs.map(pub => (
                <div key={pub.id}>
                  {pub.file_url ? (
                    <a href={pub.file_url} target="_blank" rel="noopener noreferrer" className="group block">
                      <ItemCard
                        label={pub.category}
                        title={pub.title}
                        date={fmtDate(pub.published_at ?? pub.created_at)}
                        color={CATEGORY_COLORS[pub.category] ?? "#f7a800"}
                        download
                      />
                    </a>
                  ) : (
                    <ItemCard
                      label={pub.category}
                      title={pub.title}
                      date={fmtDate(pub.published_at ?? pub.created_at)}
                      color={CATEGORY_COLORS[pub.category] ?? "#f7a800"}
                    />
                  )}
                </div>
              ))
            )}
          </Column>

          {/* ── Calendar column ───────────────────────────────────────── */}
          <Column
            icon={<CalendarDays className="w-5 h-5" />}
            title="Upcoming Events"
            href="/calendar"
            accentColor="#16a34a"
          >
            {events.length === 0 ? (
              <EmptyState label="No upcoming events" />
            ) : (
              events.map(ev => (
                <Link key={ev.id} href="/calendar" className="group block">
                  <div className="flex gap-3 p-3 rounded-xl bg-white border border-[#c4d6ee]/50 hover:border-[#17458f]/30 hover:shadow-sm transition-all group-hover:-translate-y-0.5">
                    {/* Date block */}
                    <div
                      className="flex-shrink-0 w-12 rounded-lg flex flex-col items-center justify-center text-white py-2"
                      style={{ backgroundColor: ev.color }}
                    >
                      <span className="text-[10px] font-bold uppercase leading-none">
                        {new Date(ev.starts_at).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-lg font-extrabold leading-tight">
                        {new Date(ev.starts_at).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0f2252] text-sm leading-snug line-clamp-1 group-hover:text-[#17458f] transition-colors">
                        {ev.title}
                      </p>
                      {ev.location && (
                        <p className="text-xs text-[#0f2252]/50 mt-0.5 truncate">{ev.location}</p>
                      )}
                      {!ev.all_day && (
                        <p className="text-[11px] text-[#0f2252]/40 mt-0.5">
                          {fmtEventDate(ev.starts_at)} · {fmtEventTime(ev.starts_at)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </Column>

        </div>
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Column({
  icon, title, href, accentColor, children,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2" style={{ borderColor: accentColor }}>
        <div className="flex items-center gap-2">
          <span className="text-white w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor }}>
            {icon}
          </span>
          <h3 className="font-bold text-[#0f2252] text-base">{title}</h3>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-0.5 text-xs font-semibold transition-colors"
          style={{ color: accentColor }}
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Items */}
      <div className="space-y-3 flex-1 max-h-[22rem] overflow-y-auto pr-1">{children}</div>
    </div>
  );
}

function ItemCard({
  label, title, date, color, download,
}: {
  label: string; title: string; date: string; color: string; download?: boolean;
}) {
  return (
    <div className="p-3 rounded-xl bg-white border border-[#c4d6ee]/50 hover:border-[#17458f]/30 hover:shadow-sm transition-all hover:-translate-y-0.5">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
          {label}
        </span>
        {download && (
          <span className="text-[9px] text-[#0f2252]/40 font-medium">PDF</span>
        )}
      </div>
      <p className="font-semibold text-[#0f2252] text-sm leading-snug line-clamp-2">{title}</p>
      <p className="text-[11px] text-[#0f2252]/40 mt-1.5">{date}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-10 text-center bg-white/50 rounded-xl border border-dashed border-[#c4d6ee]">
      <p className="text-sm text-[#0f2252]/40">{label}</p>
    </div>
  );
}
