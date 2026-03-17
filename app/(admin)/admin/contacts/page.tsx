"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Mail, Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ContactSubmission } from "@/lib/types";

export default function AdminContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ read: true }).eq("id", id);
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, read: true } : s));
    toast.success("Marked as read");
  };

  const unreadCount = submissions.filter((s) => !s.read).length;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Contact Submissions
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">{unreadCount} new</Badge>
            )}
          </h1>
          <p className="text-muted-foreground text-sm">{submissions.length} total messages</p>
        </div>
      </div>

      <div className="space-y-3">
        {submissions.map((s) => (
          <div
            key={s.id}
            className={`bg-white rounded-xl border p-5 transition-colors ${!s.read ? "border-primary/30 bg-[#f8faff]" : "border-border"}`}
          >
            <div
              className="flex items-start gap-4 cursor-pointer"
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!s.read ? "bg-primary/10" : "bg-[#f4f4f5]"}`}>
                <MessageSquare className={`w-5 h-5 ${!s.read ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-medium text-sm ${!s.read ? "text-foreground" : "text-foreground/70"}`}>
                    {s.name}
                  </p>
                  {!s.read && <Badge className="bg-primary text-white text-[10px] h-4">New</Badge>}
                  <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" /> {s.email}
                </p>
                {s.subject && <p className="text-sm text-foreground/80 mt-1 font-medium">{s.subject}</p>}
                {expanded !== s.id && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.message}</p>
                )}
              </div>
            </div>

            {expanded === s.id && (
              <div className="mt-4 ml-14">
                <div className="bg-[#f8faff] rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{s.message}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <a href={`mailto:${s.email}?subject=Re: ${s.subject || "Your message"}`}>
                      <Mail className="w-3.5 h-3.5" /> Reply via Email
                    </a>
                  </Button>
                  {!s.read && (
                    <Button variant="outline" size="sm" className="gap-1.5 text-green-600 hover:bg-green-50" onClick={() => markRead(s.id)}>
                      <CheckCircle className="w-3.5 h-3.5" /> Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No messages yet</p>
        </div>
      )}
    </div>
  );
}
