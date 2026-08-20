"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Image,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Newspaper,
  BookOpen,
  CalendarDays,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Secretary Report", href: "/admin/secretary-report", icon: FileSpreadsheet },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { label: "Site Content", href: "/admin/content", icon: Settings },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Publications", href: "/admin/publications", icon: BookOpen },
  { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
      return;
    }
    toast.success("Signed out successfully");
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground leading-none">Admin Panel</p>
            <p className="font-semibold text-sidebar-foreground text-xs leading-tight">
              RC Pashupati Ktm
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {ADMIN_NAV.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
              isActive(href)
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110",
                isActive(href) ? "text-white" : "text-muted-foreground"
              )}
            />
            {label}
            {isActive(href) && (
              <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />
            )}
          </Link>
        ))}
      </nav>

      {/* View Site + Logout */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
