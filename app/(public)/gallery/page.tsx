import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import GalleryContent from "@/components/gallery/GalleryContent";
import type { GalleryItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photo gallery of Rotary Club of Pashupati Kathmandu projects, events, and activities.",
};

export default async function GalleryPage() {
  let items: GalleryItem[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("date", { ascending: false });

    if (data) items = data;
  } catch {
    // use empty array
  }

  return <GalleryContent items={items} />;
}
