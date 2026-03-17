"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";


// ── Replace these with actual club event photos ───────────────────────────
const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=900&fit=crop",
    event: "Maternal Health Camp",
    caption: "Free health checkups for mothers and children across Kathmandu Valley",
  },
  {
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=900&fit=crop",
    event: "Prahari Batika",
    caption: "10,000 trees planted across Kathmandu — environmental service in action",
  },
  {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=900&fit=crop",
    event: "Rotaract Fellowship",
    caption: "Empowering young leaders through fellowship and community service",
  },
  {
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&h=900&fit=crop",
    event: "Education Drive",
    caption: "Distributing learning materials to under-resourced schools in Kathmandu",
  },
];

export default function MissionSection() {
  const [current, setCurrent] = useState(0);

  // Auto-advance every 5 s
  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % SLIDES.length), 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="flex flex-col relative overflow-hidden lg:h-[calc(100vh-5rem)]">
      {/* ── Dynamic blurred background from active slide ── */}
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.8, ease: "easeInOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SLIDES[current].image}
            alt=""
            className="w-full h-full object-cover scale-110"
            style={{ filter: "blur(10px) saturate(0.6)", opacity: 0.5 }}
          />
        </motion.div>
      </AnimatePresence>



      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(23,69,143,0.6) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 25% 50%, rgba(23,69,143,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 flex flex-col py-6 lg:py-8">
        <div className="flex-1 max-w-7xl mx-auto px-2 lg:px-3 w-full flex flex-col">
          <div className="flex-1 grid lg:grid-cols-[5fr_7fr] gap-6 lg:gap-8 lg:items-stretch">

            {/* ── Left: text (unchanged) ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col justify-center"
            >
              
              <h2
                className="text-[#0f2252] font-extrabold tracking-tight leading-tight mb-3 lg:mb-4"
                style={{ fontSize: "clamp(2.8rem, 4vw, 5rem)" }}
              >
                Our Mission &amp; <br />
                <span style={{ color: "#f7a800" }}>Purpose</span>
              </h2>
              <p className="text-[#0f2252]/85 text-base lg:text-xl leading-relaxed mb-3 lg:mb-4">
                The mission of Rotary International is to provide services to others,
                promote integrity, and advance world understanding, goodwill, and peace
                through the fellowship of business, professional, and community leaders.
              </p>
              <p className="text-[#0f2252]/70 text-lg lg:text-base leading-relaxed mb-5 lg:mb-6">
                Rotary is a global network of 1.2 million neighbors, friends, leaders,
                and problem-solvers who see a world where people unite and take action
                to create lasting change — across the globe, in our communities, and in
                ourselves. For more than 110 years, Rotarians are committed to making a
                positive impact in communities at home and abroad.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 self-start"
                style={{
                  background: "linear-gradient(135deg, #17458f 0%, #1e5ba8 100%)",
                  boxShadow: "0 4px 24px rgba(23,69,143,0.25)",
                }}
              >
                Learn More About Us <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* ── Right: slideshow ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
              className="relative rounded-2xl overflow-hidden min-h-[420px] lg:min-h-0 lg:h-full"
            >
              {/* ── Photo slides ── */}
              <AnimatePresence>
                <motion.div
                  key={current}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.8, ease: "easeInOut" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SLIDES[current].image}
                    alt={SLIDES[current].event}
                    className="w-full h-full object-cover"
                  />
                  {/* Bottom-weighted gradient for text readability */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(8,18,45,0.88) 0%, rgba(8,18,45,0.35) 38%, transparent 65%)",
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* ── Slide counter (top-right) ── */}
              <div className="absolute top-4 right-4 z-10">
                <span className="text-xs font-semibold text-white/60 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {current + 1} / {SLIDES.length}
                </span>
              </div>

              {/* ── Caption + dots (bottom-left) ── */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.45, delay: 0.25 }}
                  >
                    <span className="inline-block text-[18px] font-bold tracking-[0.28em] uppercase text-[#f7a800] mb-1.5">
                      {SLIDES[current].event}
                    </span>
                    <p className="text-white/85 text-sm leading-snug max-w-[28ch]">
                      {SLIDES[current].caption}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Dot navigation */}
                <div className="flex items-center gap-2 mt-4">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={cn(
                        "rounded-full transition-all duration-300",
                        i === current
                          ? "w-6 h-1.5 bg-[#f7a800]"
                          : "w-1.5 h-1.5 bg-white/35 hover:bg-white/65"
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
