"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Download, BookOpen, FileText, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Publication } from "@/lib/types";

const CATEGORIES = ["All", "Newsletter", "Annual Report", "Bulletin", "Minutes", "Other"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.52, ease: "easeOut" } },
};

const CATEGORY_COLORS: Record<string, string> = {
  Newsletter:    "#17458f",
  "Annual Report": "#f7a800",
  Bulletin:      "#16a34a",
  Minutes:       "#0891b2",
  Other:         "#7c3aed",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

interface Props { publications: Publication[] }

export default function PublicationsContent({ publications }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? publications
    : publications.filter(p => p.category === activeCategory);

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
            Documents &amp; Reports
          </span>
          <h1 className="font-extrabold tracking-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Publications
          </h1>
          <p className="text-white/70 mt-4 max-w-xl mx-auto text-base lg:text-lg">
            Download newsletters, annual reports, bulletins, and other publications from Rotary Club of Pashupati Kathmandu.
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
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No publications in this category yet.</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map(pub => {
              const color = CATEGORY_COLORS[pub.category] ?? "#17458f";
              return (
                <motion.div key={pub.id} variants={item}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#c4d6ee]/40 flex flex-col">
                    {/* Thumbnail / placeholder */}
                    <div className="aspect-[3/4] bg-[#eef4fc] relative overflow-hidden flex-shrink-0">
                      {pub.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={pub.cover_image_url}
                          alt={pub.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                          <FileText className="w-14 h-14 opacity-20" style={{ color }} />
                          <span className="text-xs font-semibold text-[#0f2252]/30 uppercase tracking-widest">
                            {pub.category}
                          </span>
                        </div>
                      )}
                      {/* Category ribbon */}
                      <span
                        className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full text-white"
                        style={{ backgroundColor: color }}
                      >
                        {pub.category}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-[#0f2252] text-sm leading-snug mb-1 line-clamp-2">
                        {pub.title}
                      </h3>
                      {pub.description && (
                        <p className="text-[#0f2252]/55 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
                          {pub.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#c4d6ee]/40">
                        <span className="text-[10px] text-[#0f2252]/40 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {fmtDate(pub.published_at ?? pub.created_at)}
                        </span>
                        {pub.file_url ? (
                          <a
                            href={pub.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all"
                            style={{ backgroundColor: color }}
                            onClick={e => e.stopPropagation()}
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                        ) : (
                          <span className="text-[10px] text-[#0f2252]/35 italic">Coming soon</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
