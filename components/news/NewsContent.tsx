"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Calendar, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsPost } from "@/lib/types";

const CATEGORIES = ["All", "General", "Club Update", "Community", "Health", "Education", "Environment"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.52, ease: "easeOut" } },
};

function fmtDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface Props { news: NewsPost[] }

export default function NewsContent({ news }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? news
    : news.filter(n => n.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f0f5fc]">
      {/* Hero banner */}
      <div
        className="relative py-20 lg:py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2252 0%, #17458f 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block text-[#f7a800] text-[11px] font-bold tracking-[0.32em] uppercase mb-3">
            Latest from the Club
          </span>
          <h1 className="font-extrabold tracking-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            News &amp; Updates
          </h1>
          <p className="text-white/70 mt-4 max-w-xl mx-auto text-base lg:text-lg">
            Stay up to date with the latest activities, announcements, and stories from Rotary Club of Pashupati Kathmandu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                activeCategory === cat
                  ? "bg-[#17458f] text-white border-[#17458f]"
                  : "bg-white text-[#0f2252]/70 border-[#c4d6ee] hover:border-[#17458f]/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#0f2252]/40">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No news in this category yet.</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map(post => (
              <motion.div key={post.id} variants={item}>
                <Link href={`/news/${post.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#c4d6ee]/40">
                  {/* Cover image */}
                  <div className="aspect-[16/9] bg-[#eef4fc] overflow-hidden relative">
                    {post.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-[#17458f]/20" />
                      </div>
                    )}
                    {/* Category badge */}
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#17458f] text-white">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="font-bold text-[#0f2252] text-base leading-snug mb-2 group-hover:text-[#17458f] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-[#0f2252]/60 text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-[#0f2252]/45">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> {post.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {fmtDate(post.published_at ?? post.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Read more footer */}
                  <div className="px-5 pb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#17458f] group-hover:gap-2 transition-all">
                      Read More <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
