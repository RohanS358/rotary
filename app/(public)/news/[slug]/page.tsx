import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "@/components/ui/SmartImage";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news_posts")
      .select("title, excerpt")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    if (data) return { title: data.title, description: data.excerpt ?? undefined };
  } catch { /* fallback */ }
  return { title: "News Post" };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post: NewsPost | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    if (data) post = data;
  } catch { /* not found */ }

  if (!post) notFound();

  const fmtDate = (iso: string | null) => iso
    ? new Date(iso).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div className="min-h-screen bg-[#f0f5fc]">
      {/* Cover image */}
      {post.cover_image_url && (
        <div className="relative w-full h-64 lg:h-96 overflow-hidden">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Header bar */}
      <div style={{ background: "linear-gradient(135deg, #0f2252 0%, #17458f 100%)" }}
        className={post.cover_image_url ? "" : "py-20 lg:py-28"}>
        {!post.cover_image_url && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <span className="inline-block text-[#f7a800] text-[11px] font-bold tracking-[0.32em] uppercase mb-3">
              {post.category}
            </span>
            <h1 className="font-extrabold tracking-tight mb-4"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
              {post.title}
            </h1>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#17458f] mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        {post.cover_image_url && (
          <div className="mb-4">
            <span
              className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full text-white mb-3"
              style={{ backgroundColor: "#17458f" }}
            >
              {post.category}
            </span>
            <h1 className="font-extrabold text-[#0f2252] tracking-tight leading-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
              {post.title}
            </h1>
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#0f2252]/55 mb-8 pb-8 border-b border-[#c4d6ee]/60">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#17458f]" /> {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#17458f]" />
            {fmtDate(post.published_at ?? post.created_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#17458f]" /> {post.category}
          </span>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-[#0f2252]/70 text-lg leading-relaxed mb-6 font-medium italic border-l-4 border-[#17458f] pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Body */}
        {post.body ? (
          <div className="prose prose-slate max-w-none text-[#0f2252]/80 leading-relaxed">
            {post.body.split("\n").map((para, i) =>
              para.trim() ? (
                <p key={i} className="mb-4 text-base">
                  {para}
                </p>
              ) : (
                <br key={i} />
              )
            )}
          </div>
        ) : (
          <p className="text-[#0f2252]/50 italic">No content available.</p>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-[#c4d6ee]/60">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #17458f 0%, #1e5ba8 100%)" }}
          >
            <ArrowLeft className="w-4 h-4" /> All News
          </Link>
        </div>
      </div>
    </div>
  );
}
