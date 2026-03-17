import { createClient } from "@/lib/supabase/server";
import { Users, FolderOpen, Image, Archive, MessageSquare, Award, Newspaper, BookOpen, CalendarDays } from "lucide-react";
import Link from "next/link";

async function getStats() {
  try {
    const supabase = await createClient();

    const [members, projects, gallery, archives, contacts, newsPosts, publications, upcomingEvents] = await Promise.all([
      supabase.from("members").select("*", { count: "exact", head: true }).eq("active", true),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("active", true),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
      supabase.from("archives").select("*", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("read", false),
      supabase.from("news_posts").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("publications").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("calendar_events").select("*", { count: "exact", head: true }).gte("starts_at", new Date().toISOString()),
    ]);

    return {
      members: members.count ?? 0,
      projects: projects.count ?? 0,
      gallery: gallery.count ?? 0,
      archives: archives.count ?? 0,
      unreadContacts: contacts.count ?? 0,
      newsPosts: newsPosts.count ?? 0,
      publications: publications.count ?? 0,
      upcomingEvents: upcomingEvents.count ?? 0,
    };
  } catch {
    return { members: 0, projects: 0, gallery: 0, archives: 0, unreadContacts: 0, newsPosts: 0, publications: 0, upcomingEvents: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const STAT_CARDS = [
    { label: "Active Members", value: stats.members, icon: Users, href: "/admin/members", color: "#17458f" },
    { label: "Projects", value: stats.projects, icon: FolderOpen, href: "/admin/projects", color: "#16a34a" },
    { label: "Gallery Images", value: stats.gallery, icon: Image, href: "/admin/gallery", color: "#7c3aed" },
    { label: "Archives", value: stats.archives, icon: Archive, href: "/admin/archives", color: "#ea580c" },
    { label: "Unread Messages", value: stats.unreadContacts, icon: MessageSquare, href: "/admin/contacts", color: "#e74c3c" },
    { label: "News Posts", value: stats.newsPosts, icon: Newspaper, href: "/admin/news", color: "#17458f" },
    { label: "Publications", value: stats.publications, icon: BookOpen, href: "/admin/publications", color: "#f7a800" },
    { label: "Upcoming Events", value: stats.upcomingEvents, icon: CalendarDays, href: "/admin/calendar", color: "#16a34a" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Award className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, Admin</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              {value > 0 && label === "Unread Messages" && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                  {value}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick guide */}
      <div className="bg-[#f8faff] border border-border rounded-xl p-6">
        <h2 className="font-bold text-foreground mb-4">Quick Guide</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          {[
            { title: "Add Members", desc: "Go to Members → click 'Add Member'", href: "/admin/members" },
            { title: "Upload Gallery Photos", desc: "Go to Gallery → click 'Add Images'", href: "/admin/gallery" },
            { title: "Edit Home Page Text", desc: "Go to Site Content → edit hero text and stats", href: "/admin/content" },
            { title: "Add Projects", desc: "Go to Projects → click 'Add Project'", href: "/admin/projects" },
          ].map(({ title, desc, href }) => (
            <Link key={title} href={href} className="flex gap-3 p-3 rounded-lg hover:bg-white transition-colors">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-xs">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
