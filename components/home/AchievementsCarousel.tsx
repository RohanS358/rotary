"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Award,
  Star,
  Medal,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/constants";
import ParticleBackground from "@/components/ui/particle-background";

const ICON_MAP = {
  trophy: Trophy,
  award: Award,
  star: Star,
  medal: Medal,
  leaf: Leaf,
} as const;

type AchievementIcon = keyof typeof ICON_MAP;

export default function AchievementsCarousel() {
  const [activeIndex, setActiveIndex] = useState(2); // Start at middle item

  const count = ACHIEVEMENTS.length;

  const prev = () => setActiveIndex((i) => (i - 1 + count) % count);
  const next = () => setActiveIndex((i) => (i + 1) % count);

  const active = ACHIEVEMENTS[activeIndex];

  // Compute display order: always show all items, ordered around active
  const getDistanceFromActive = (i: number) => {
    const raw = i - activeIndex;
    // Wrap to [-2, 2] range
    if (raw > count / 2) return raw - count;
    if (raw < -count / 2) return raw + count;
    return raw;
  };

  // Visual config per distance
  const getItemStyle = (distance: number) => {
    const absD = Math.abs(distance);
    if (absD === 0) return { scale: 1, opacity: 1, zIndex: 10, blur: 0 };
    if (absD === 1) return { scale: 0.75, opacity: 0.55, zIndex: 5, blur: 1 };
    return { scale: 0.58, opacity: 0.28, zIndex: 1, blur: 2 };
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#eef4fc] py-20 px-4">
      <ParticleBackground />
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle 40rem at 50% 60%, rgba(247,168,0,0.04) 0%, rgba(23,69,143,0.06) 30%, transparent 65%)",
        }}
      />
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(23,69,143,0.6) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Section header */}
      <div className="relative z-10 text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#f7a800] text-[10px] font-semibold tracking-[0.3em] uppercase mb-4"
        >
          Our Impact
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-[#0f2252] font-extrabold tracking-tight leading-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
        >
          By the Numbers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[#17458f]/50 text-sm mt-3 max-w-md mx-auto"
        >
          Twenty-eight years of service in Kathmandu, counted in projects and people
        </motion.p>
      </div>

      {/* Carousel row */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-center gap-0 mb-12">
        {/* Left arrow */}
        <button
          onClick={prev}
          aria-label="Previous achievement"
          className="absolute left-0 lg:-left-4 z-20 w-11 h-11 rounded-full border border-[#f7a800]/40 flex items-center justify-center text-[#f7a800]/70 hover:border-[#f7a800] hover:text-[#f7a800] hover:bg-[#f7a800]/10 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Items */}
        <div className="flex items-center justify-center w-full gap-6 sm:gap-8 lg:gap-10 px-16">
          {ACHIEVEMENTS.map((item, i) => {
            const distance = getDistanceFromActive(i);
            const { scale, opacity, blur } = getItemStyle(distance);
            const IconComp = ICON_MAP[item.icon as AchievementIcon] ?? Trophy;
            const isActive = distance === 0;

            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveIndex(i)}
                animate={{
                  scale,
                  opacity,
                  filter: blur ? `blur(${blur}px)` : "blur(0px)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer group focus:outline-none"
                style={{ width: "clamp(72px, 14vw, 110px)" }}
              >
                {/* Icon circle */}
                <motion.div
                  animate={{
                    boxShadow: isActive
                      ? "0 0 0 2px rgba(247,168,0,0.5), 0 0 40px rgba(247,168,0,0.15)"
                      : "0 0 0 1px rgba(23,69,143,0.12)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full flex items-center justify-center bg-white/70 border border-[#17458f]/10 transition-colors group-hover:border-[#f7a800]/40"
                  style={{ width: isActive ? 88 : 68, height: isActive ? 88 : 68 }}
                >
                  <IconComp
                    className={`transition-all ${isActive ? "text-[#f7a800]" : "text-[#17458f]/50"}`}
                    style={{ width: isActive ? 36 : 28, height: isActive ? 36 : 28 }}
                  />
                </motion.div>

                {/* Item title — only visible for active */}
                <motion.p
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
                  transition={{ duration: 0.25 }}
                  className="text-[#0f2252] text-xs font-semibold text-center leading-tight max-w-[96px] pointer-events-none"
                >
                  {item.title}
                </motion.p>
              </motion.button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          aria-label="Next achievement"
          className="absolute right-0 lg:-right-4 z-20 w-11 h-11 rounded-full border border-[#f7a800]/40 flex items-center justify-center text-[#f7a800]/70 hover:border-[#f7a800] hover:text-[#f7a800] hover:bg-[#f7a800]/10 transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Active item detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="relative z-10 flex flex-col items-center text-center max-w-lg px-4"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="px-3 py-1 rounded-full bg-[#f7a800]/12 border border-[#f7a800]/30 text-[#f7a800] text-xs font-semibold tracking-wide">
              {active.year}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#17458f]/8 border border-[#17458f]/12 text-[#17458f]/60 text-xs font-medium">
              {active.org}
            </span>
          </div>

          <h3
            className="text-[#0f2252] font-extrabold tracking-tight mb-4"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}
          >
            {active.title}
          </h3>

          <p className="text-[#17458f]/60 leading-relaxed text-sm sm:text-base max-w-md">
            {active.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="relative z-10 flex items-center gap-2 mt-10">
        {ACHIEVEMENTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to achievement ${i + 1}`}
            className="transition-all duration-200"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 h-1.5 bg-[#f7a800]"
                  : "w-1.5 h-1.5 bg-[#17458f]/25 hover:bg-[#17458f]/45"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
