"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, User, Loader2, Upload, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import type { Member } from "@/lib/types";

const TYPE_LABELS: Record<Member["type"], string> = {
  board: "Board",
  member: "Member",
  rotaract: "Rotaract",
  rotaract_pktm: "Rotaract – Pashupati KTM",
  rotaract_law: "Rotaract – Law Campus",
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    type: "member" as Member["type"],
    bio: "",
    order_index: "0",
    photo_url: "",
    donation_amount: "",
    is_trf: false,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").order("order_index");
    if (data) setMembers(data);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", role: "", type: "member", bio: "", order_index: "0", photo_url: "", donation_amount: "", is_trf: false });
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsOpen(true);
  };

  const openEdit = (member: Member) => {
    setEditing(member);
    setForm({
      name: member.name,
      role: member.role || "",
      type: member.type,
      bio: member.bio || "",
      order_index: String(member.order_index),
      photo_url: member.photo_url || "",
      donation_amount: member.donation_amount != null ? String(member.donation_amount) : "",
      is_trf: member.is_trf,
    });
    setPhotoFile(null);
    setPhotoPreview(member.photo_url || null);
    setIsOpen(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Photo must be under 5 MB"); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setForm((f) => ({ ...f, photo_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("member-photos")
      .upload(fileName, file, { upsert: false, contentType: file.type });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("member-photos").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      let finalPhotoUrl = form.photo_url || null;

      if (photoFile) {
        setUploading(true);
        finalPhotoUrl = await uploadPhoto(photoFile);
        setUploading(false);
      }

      const payload = {
        name: form.name,
        role: form.role || null,
        type: form.type,
        bio: form.bio || null,
        order_index: parseInt(form.order_index) || 0,
        active: true,
        photo_url: finalPhotoUrl,
        donation_amount: form.donation_amount !== "" ? parseFloat(form.donation_amount) : null,
        is_trf: form.is_trf,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from("members").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Member updated");
      } else {
        const { error } = await supabase.from("members").insert(payload);
        if (error) throw error;
        toast.success("Member added");
      }
      setIsOpen(false);
      fetchMembers();
    } catch (e: unknown) {
      setUploading(false);
      toast.error(e instanceof Error ? e.message : "Error saving member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("members").update({ active: false }).eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Member removed");
    fetchMembers();
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
          <h1 className="text-2xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground text-sm">{members.length} total members</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="w-4 h-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Member" : "Add Member"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 overflow-y-auto flex-1 pr-1">
              {/* Photo upload */}
              <div>
                <Label>Photo</Label>
                <div className="mt-1.5 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#eef2fa] flex items-center justify-center overflow-hidden ring-2 ring-primary/10 flex-shrink-0">
                    {photoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-7 h-7 text-primary/30" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2 w-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {photoPreview ? "Change Photo" : "Upload Photo"}
                    </Button>
                    {photoPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive w-full"
                        onClick={clearPhoto}
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">Max 500 KB · JPG, PNG, WebP</p>
              </div>

              <div>
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="mt-1.5" />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g., President, Secretary" className="mt-1.5" />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Member["type"] })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="board">Board Member</SelectItem>
                    <SelectItem value="member">Regular Member</SelectItem>
                    <SelectItem value="rotaract_pktm">Rotaract – Pashupati Kathmandu</SelectItem>
                    <SelectItem value="rotaract_law">Rotaract – Pashupati Law Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short bio..." className="mt-1.5" rows={3} />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Donation Amount (USD)</Label>
                <Input type="number" min="0" step="0.01" value={form.donation_amount} onChange={(e) => setForm({ ...form, donation_amount: e.target.value })} placeholder="e.g., 1000" className="mt-1.5" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label className="text-sm font-medium">TRF Contributor</Label>
                  <p className="text-xs text-muted-foreground">The Rotary Foundation contributor</p>
                </div>
                <Switch checked={form.is_trf} onCheckedChange={(v) => setForm({ ...form, is_trf: v })} />
              </div>
              <Button onClick={handleSave} disabled={saving || uploading} className="w-full">
                {(saving || uploading) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {uploading ? "Uploading photo..." : editing ? "Update Member" : "Add Member"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eef2fa] flex items-center justify-center overflow-hidden">
                {member.photo_url ? (
                  <Image src={member.photo_url} alt={member.name} width={40} height={40} className="object-cover w-10 h-10 rounded-full" />
                ) : (
                  <User className="w-5 h-5 text-primary/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{member.name}</p>
                {member.role && <p className="text-xs text-muted-foreground truncate">{member.role}</p>}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs w-fit">{TYPE_LABELS[member.type] ?? member.type}</Badge>
            {member.is_trf && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="text-xs w-fit bg-[#f7a800] text-white hover:bg-[#f7a800]/90">TRF Contributor</Badge>
                {member.donation_amount != null && (
                  <span className="text-xs font-semibold text-[#f7a800]">${member.donation_amount.toLocaleString()}</span>
                )}
              </div>
            )}
            <div className="flex gap-2 mt-auto">
              <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => openEdit(member)}>
                <Edit className="w-3.5 h-3.5" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Member?</AlertDialogTitle>
                    <AlertDialogDescription>This will hide {member.name} from the public site.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(member.id)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No members yet</p>
          <p className="text-sm">Add your first member to get started.</p>
        </div>
      )}
    </div>
  );
}
