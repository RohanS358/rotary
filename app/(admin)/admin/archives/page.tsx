"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Archive } from "@/lib/types";

const TYPE_COLORS = {
  meeting: "#2563eb",
  event: "#16a34a",
  document: "#ea580c",
};

type FormState = { title: string; description: string; type: Archive["type"]; date: string };
const EMPTY_FORM: FormState = { title: "", description: "", type: "meeting", date: "" };

export default function AdminArchivesPage() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Archive | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const supabase = createClient();

  const fetchArchives = async () => {
    const { data } = await supabase.from("archives").select("*").order("date", { ascending: false });
    if (data) setArchives(data);
    setLoading(false);
  };

  useEffect(() => { fetchArchives(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setIsOpen(true); };
  const openEdit = (a: Archive) => {
    setEditing(a);
    setForm({ title: a.title, description: a.description || "", type: a.type, date: a.date || "" });
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const payload = { title: form.title, description: form.description || null, type: form.type, date: form.date || null };
      if (editing) {
        await supabase.from("archives").update(payload).eq("id", editing.id);
        toast.success("Archive updated");
      } else {
        await supabase.from("archives").insert(payload);
        toast.success("Archive entry added");
      }
      setIsOpen(false);
      fetchArchives();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("archives").delete().eq("id", id);
    toast.success("Entry removed");
    fetchArchives();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Archives</h1>
          <p className="text-muted-foreground text-sm">{archives.length} entries</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Entry</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Edit Entry" : "Add Archive Entry"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Archive["type"] })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1.5" />
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editing ? "Update" : "Add Entry"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {archives.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-border p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${TYPE_COLORS[a.type]}15` }}>
              <FileText className="w-5 h-5" style={{ color: TYPE_COLORS[a.type] }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm">{a.title}</p>
                <Badge className="text-xs text-white capitalize" style={{ backgroundColor: TYPE_COLORS[a.type] }}>{a.type}</Badge>
              </div>
              {a.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{a.description}</p>}
              {a.date && <p className="text-xs text-muted-foreground mt-1">{new Date(a.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEdit(a)}><Edit className="w-3.5 h-3.5" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5"><Trash2 className="w-3.5 h-3.5" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently delete &quot;{a.title}&quot;.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(a.id)} className="bg-destructive">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
      {archives.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No archive entries yet</p>
        </div>
      )}
    </div>
  );
}
