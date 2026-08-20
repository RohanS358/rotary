"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Real club projects, straight from the district site record.
const IMG = "https://pashupati-kathmandu.rotarydistrict3292.org.np/storage/project_images";
const TROPHIES = [
  {
    id: 0,
    image: `${IMG}/HGQ89ER4PSKC4lrWvVnQJMBVkRPOMOKF7dRKTDSG.jpg`,
    title: "Mission Humla for Health & Education",
    year: "2025\u201326",
    category: "Disease Prevention & Treatment",
    description:
      "A free comprehensive health camp in Namkha Rural Municipality, Humla \u2014 200+ patients served, 170 blood pressure checks, 100+ ultrasound screenings, plus warm clothing for the students of Shree Motiram Primary School. Budget: NPR 500,000.",
  },
  {
    id: 1,
    image: `${IMG}/XYD6Hgkx1D5lRobWqNPJdjJNj6lj2Ps056NVeMou.jpg`,
    title: "Safe Drinking Water",
    year: "2025\u201326",
    category: "Water & Sanitation",
    description:
      "A 250 L/hour water filter with four output taps, inaugurated by District Governor Rtn. Binod Koirala \u2014 clean drinking water for roughly 1,000 people.",
  },
  {
    id: 2,
    image: `${IMG}/6kN1ZKFSn5ciCatAMT9Qm5vQ4hC4ZH2k9kwP9ogJ.jpg`,
    title: "Winter Clothes Distribution",
    year: "2025\u201326",
    category: "Basic Education & Literacy",
    description:
      "100 sets of warm jackets and track suits for children at Shree Adharbhut Madhyamik Vidyalaya, Dhankuta and Hermichour Madhyamik Vidyalaya, Gulmi. Budget: NPR 100,000.",
  },
  {
    id: 3,
    image: `${IMG}/P0PwPMUtIyAgoueLhHBX4mr5OqOUfAGwIEzy892u.jpg`,
    title: "World Breastfeeding Week",
    year: "2025\u201326",
    category: "Maternal & Child Health",
    description:
      "An awareness and training session with HPN Clinic for 30 breastfeeding mothers, facilitated by Rtn. Dr. Binod Dangal and Rtn. Dr. Archana KC, with both Rotaract clubs taking part.",
  },
  {
    id: 4,
    image: `${IMG}/6IBcfGnhUYeZbnTPqQGV1TPuoojwxPF6dUMc7X1M.jpg`,
    title: "Let's Unite to Save the Environment",
    year: "2025\u201326",
    category: "Environment",
    description:
      "A tree plantation drive at Kageshwari Manohara\u20136 with Ward Office No. 6 and both Rotaract clubs, reaching around 200 people.",
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
        <div
          className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/15"
          style={{ boxShadow: "0 8px 32px rgba(247,168,0,0.22), 0 2px 10px rgba(0,0,0,0.55)" }}
        >
          <Image
            src={TROPHIES[active].image}
            alt={TROPHIES[active].title}
            fill
            sizes="(max-width: 1024px) 60vw, 208px"
            className="object-cover"
          />
        </div>
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
          Service in Action
        </span>
        <h2
          className="text-white font-extrabold tracking-tight leading-tight mt-2"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
        >
          Our Signature Projects
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
            <Image
              src={TROPHIES[prev].image}
              alt={TROPHIES[prev].title}
              width={1587}
              height={2245}
              sizes="112px"
              className="w-full h-auto object-contain drop-shadow-xl"
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
            <Image
              src={TROPHIES[next].image}
              alt={TROPHIES[next].title}
              width={1587}
              height={2245}
              sizes="112px"
              className="w-full h-auto object-contain drop-shadow-xl"
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
