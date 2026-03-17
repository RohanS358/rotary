"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Replace image paths with your actual backgroundless trophy PNGs ──────────
const TROPHIES = [
  {
    id: 0,
    image: "/trophies/trophy-1.png",
    title: "District Governor's Award",
    year: "2023–24",
    category: "District Recognition",
    description:
      "Awarded by the District 3292 Governor for outstanding community service, membership growth, and overall club excellence throughout the Rotary year.",
  },
  {
    id: 1,
    image: "/trophies/trophy-2.png",
    title: "Best Club in Service",
    year: "2022–23",
    category: "Service Excellence",
    description:
      "Recognised for the highest number of community service projects completed in a single Rotary year, including the Prahari Batika tree-planting drive.",
  },
  {
    id: 2,
    image: "/trophies/trophy-3.png",
    title: "Vocational Service Award",
    year: "2021–22",
    category: "Vocational",
    description:
      "Presented for exemplary vocational training initiatives supporting youth employment and skills development across Kathmandu Valley.",
  },
  {
    id: 3,
    image: "/trophies/trophy-4.png",
    title: "International Service Citation",
    year: "2020–21",
    category: "International",
    description:
      "Honoured by Rotary International for cross-border collaboration and humanitarian projects in partnership with clubs across South Asia.",
  },
  {
    id: 4,
    image: "/trophies/trophy-5.png",
    title: "Paul Harris Fellowship",
    year: "2019–20",
    category: "Foundation",
    description:
      "The club collectively achieved Paul Harris Fellow recognition through sustained contributions to The Rotary Foundation's humanitarian programmes.",
  },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "55%" : "-55%", opacity: 0, scale: 0.82 }),
  center: {
    x: 0, opacity: 1, scale: 1,
    transition: { type: "spring" as const, stiffness: 290, damping: 34 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-55%" : "55%", opacity: 0, scale: 0.82,
    transition: { duration: 0.24, ease: "easeIn" as const },
  }),
};

const TrophyImage = ({ active, direction }: { active: number; direction: number }) => (
  <div className="relative overflow-hidden">
    <div
      className="absolute pointer-events-none bottom-0 left-1/2 -translate-x-1/2"
      style={{
        width: "80%", height: "40%",
        background: "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(247,168,0,0.22) 0%, transparent 70%)",
        filter: "blur(16px)",
      }}
    />
    <AnimatePresence custom={direction} mode="wait">
      <motion.div
        key={active}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="relative z-10"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={TROPHIES[active].image}
          alt={TROPHIES[active].title}
          className="w-full object-contain mx-auto"
          onError={(e) => { (e.target as HTMLImageElement).style.visibility = "hidden"; }}
          style={{
            filter: "drop-shadow(0 8px 32px rgba(247,168,0,0.32)) drop-shadow(0 2px 10px rgba(0,0,0,0.55))",
          }}
        />
      </motion.div>
    </AnimatePresence>
  </div>
);

const InfoCard = ({ active, center = false }: { active: number; center?: boolean }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={active}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className={center ? "text-center" : ""}
    >
      <span className={`inline-block text-[#f7a800] text-[10px] font-bold tracking-[0.34em] uppercase ${center ? "mb-2" : "mb-3"}`}>
        {TROPHIES[active].category}
      </span>
      <h3 className={`text-white font-bold leading-tight mb-1 ${center ? "text-xl" : "text-xl lg:text-2xl xl:text-3xl"}`}>
        {TROPHIES[active].title}
      </h3>
      <span className="text-white/38 text-xs font-semibold tracking-widest uppercase">
        {TROPHIES[active].year}
      </span>
      <p className={`text-white/60 text-sm leading-relaxed mt-3 ${center ? "max-w-lg mx-auto" : ""}`}>
        {TROPHIES[active].description}
      </p>
      {!center && <div className="mt-6 w-10 h-[2px] rounded-full bg-[#f7a800]/60" />}
    </motion.div>
  </AnimatePresence>
);

export default function TrophiesSection() {
  const [[active, direction], setActive] = useState<[number, number]>([0, 0]);

  const prev    = (active - 1 + TROPHIES.length) % TROPHIES.length;
  const next    = (active + 1) % TROPHIES.length;
  const goLeft  = () => setActive(([cur]) => [(cur - 1 + TROPHIES.length) % TROPHIES.length, -1]);
  const goRight = () => setActive(([cur]) => [(cur + 1) % TROPHIES.length, 1]);
  const goTo    = (i: number) => setActive(([cur]) => [i, i >= cur ? 1 : -1]);

  return (
    <section className="relative bg-[#06101f] py-14 lg:py-20 overflow-hidden">

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 50% 45%, rgba(247,168,0,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Heading ─────────────────────────────────────────────────── */}
      <div className="text-center mb-10 lg:mb-14 relative z-10 px-4">
        <span className="text-[#f7a800] text-[11px] font-bold tracking-[0.32em] uppercase">
          Recognition &amp; Honours
        </span>
        <h2
          className="text-white font-extrabold tracking-tight leading-tight mt-2"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
        >
          Awards &amp; Trophies
        </h2>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE layout  (hidden on lg+)
          [< arrow]  [trophy]  [> arrow]
          info + description below, centered
      ══════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden max-w-sm mx-auto px-4 relative z-10">
        <div className="flex items-center gap-4 select-none">
          <button
            onClick={goLeft}
            aria-label="Previous trophy"
            className="flex-shrink-0 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-[#f7a800] hover:border-[#f7a800]/60 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <TrophyImage active={active} direction={direction} />
          </div>

          <button
            onClick={goRight}
            aria-label="Next trophy"
            className="flex-shrink-0 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-[#f7a800] hover:border-[#f7a800]/60 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-7 min-h-[150px]">
          <InfoCard active={active} center />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP layout  (hidden below lg)
          [prev small]  [trophy + info card side-by-side]  [next small]
      ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-center gap-10 lg:gap-20 select-none">

          {/* Prev trophy thumbnail */}
          <motion.button
            onClick={goLeft}
            aria-label="Previous trophy"
            className="flex-shrink-0 w-28 cursor-pointer"
            style={{ opacity: 0.35 }}
            whileHover={{ opacity: 0.65, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TROPHIES[prev].image}
              alt={TROPHIES[prev].title}
              className="w-full object-contain drop-shadow-xl"
              onError={(e) => { (e.target as HTMLImageElement).style.visibility = "hidden"; }}
            />
          </motion.button>

          {/* Center: trophy + info card */}
          <div className="flex-1 max-w-3xl flex items-start gap-12 min-h-[380px]">
            <div className="flex-shrink-0 w-52">
              <TrophyImage active={active} direction={direction} />
            </div>
            <div className="flex-1 pt-4">
              <InfoCard active={active} />
            </div>
          </div>

          {/* Next trophy thumbnail */}
          <motion.button
            onClick={goRight}
            aria-label="Next trophy"
            className="flex-shrink-0 w-28 cursor-pointer"
            style={{ opacity: 0.35 }}
            whileHover={{ opacity: 0.65, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TROPHIES[next].image}
              alt={TROPHIES[next].title}
              className="w-full object-contain drop-shadow-xl"
              onError={(e) => { (e.target as HTMLImageElement).style.visibility = "hidden"; }}
            />
          </motion.button>

        </div>
      </div>

      {/* ── Dot navigation (shared) ──────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 mt-8 lg:mt-12 relative z-10">
        {TROPHIES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Trophy ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 h-[5px] bg-[#f7a800]"
                : "w-[5px] h-[5px] bg-white/20 hover:bg-white/45"
            }`}
          />
        ))}
      </div>

    </section>
  );
}
