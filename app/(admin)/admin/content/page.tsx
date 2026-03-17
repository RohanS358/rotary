"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SITE_CONTENT_DEFAULTS } from "@/lib/constants";

const CONTENT_FIELDS = [
  { key: "hero_title", label: "Hero Title", type: "input", placeholder: "Service Above Self" },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea", placeholder: "About the club..." },
  { key: "hero_cta_primary", label: "Hero Button 1 Text", type: "input", placeholder: "Our Projects" },
  { key: "hero_cta_secondary", label: "Hero Button 2 Text", type: "input", placeholder: "About Us" },
  { key: "about_mission", label: "Mission Statement", type: "textarea", placeholder: "The mission of Rotary International..." },
  { key: "about_description", label: "About Description", type: "textarea", placeholder: "Rotary is a global network..." },
  { key: "stats_members", label: "Stats: Members Value", type: "input", placeholder: "50+" },
  { key: "stats_projects", label: "Stats: Projects Value", type: "input", placeholder: "100+" },
  { key: "stats_years", label: "Stats: Years Value", type: "input", placeholder: "25+" },
  { key: "stats_lives", label: "Stats: Lives Impacted", type: "input", placeholder: "10,000+" },
];

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, string>>(SITE_CONTENT_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from("site_content").select("key, value");
      if (data) {
        const mapped: Record<string, string> = { ...SITE_CONTENT_DEFAULTS };
        data.forEach(({ key, value }) => {
          if (value) mapped[key] = value;
        });
        setValues(mapped);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const upserts = CONTENT_FIELDS.map(({ key, label }) => ({
        key,
        value: values[key] || SITE_CONTENT_DEFAULTS[key] || "",
        type: "text" as const,
        label,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("site_content").upsert(upserts, { onConflict: "key" });
      if (error) throw error;
      toast.success("Site content saved successfully!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error saving content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Site Content
          </h1>
          <p className="text-muted-foreground text-sm">Edit text content shown on the public website</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </Button>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Group by section */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider text-muted-foreground">
            Hero Section
          </h2>
          <div className="space-y-5">
            {CONTENT_FIELDS.slice(0, 4).map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <Label className="text-sm font-medium">{label}</Label>
                {type === "textarea" ? (
                  <Textarea
                    value={values[key] || ""}
                    onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="mt-1.5 resize-none"
                    rows={3}
                  />
                ) : (
                  <Input
                    value={values[key] || ""}
                    onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="mt-1.5"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider text-muted-foreground">
            About Section
          </h2>
          <div className="space-y-5">
            {CONTENT_FIELDS.slice(4, 6).map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <Label className="text-sm font-medium">{label}</Label>
                <Textarea
                  value={values[key] || ""}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="mt-1.5 resize-none"
                  rows={4}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider text-muted-foreground">
            Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {CONTENT_FIELDS.slice(6).map(({ key, label, placeholder }) => (
              <div key={key}>
                <Label className="text-sm font-medium">{label}</Label>
                <Input
                  value={values[key] || ""}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="mt-1.5"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
