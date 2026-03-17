import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PublicationsContent from "@/components/publications/PublicationsContent";
import type { Publication } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Publications",
  description: "Download newsletters, annual reports, and bulletins from Rotary Club of Pashupati Kathmandu.",
};

export default async function PublicationsPage() {
  let publications: Publication[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("publications")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (data) publications = data;
  } catch { /* return empty */ }

  return <PublicationsContent publications={publications} />;
}
