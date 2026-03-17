import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import NewsContent from "@/components/news/NewsContent";
import type { NewsPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Latest news, announcements, and stories from Rotary Club of Pashupati Kathmandu.",
};

export default async function NewsPage() {
  let news: NewsPost[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (data) news = data;
  } catch { /* return empty */ }

  return <NewsContent news={news} />;
}
