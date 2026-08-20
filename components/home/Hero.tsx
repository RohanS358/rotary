"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { Backdrop } from "@react-three/drei";
import ParticleBackground from "@/components/ui/particle-background";

interface LatestProject {
  title: string;
  date: string;
  category: string;
}

interface HeroProps {
  latestProject?: LatestProject | null;
}


export default function Hero({ latestProject }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (bgRef.current && sectionRef.current?.parentElement) {
        gsap.to(bgRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: sectionRef.current.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const formattedDate = latestProject?.date
    ? (() => {
        try {
          return format(new Date(latestProject.date), "d MMM yyyy");
        } catch {
          return latestProject.date;
        }
      })()
    : null;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden flex flex-col"
    >
      <ParticleBackground />
      {/* Background — swap backgroundImage for a real photo later */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: `url("./hero_bg2.png")`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundPositionY: "0%",
        }}
      />
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 300px",
        }}
      />
      {/* Radial glow at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle 35rem at 50% 42%, rgba(255, 255, 255, 0.12) 0%, transparent 80%)",
          backdropFilter: "blur(2px)",
        }}
      />
      {/* Light overlay */}
      <div className="absolute inset-0 bg-white/30 pointer-events-none" />

      {/* ── TOP BAR ── */}
      

      {/* ── CENTER ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 }}
          className="mb-3"
          style={{ filter: "drop-shadow(0 0 48px rgba(247,168,0,0.25))" }}
        >
          <Image src="/wheel.png" width={190} height={190} priority alt="Rotary wheel" className="w-[110px] h-[110px] lg:w-[160px] lg:h-[160px] xl:w-[190px] xl:h-[190px]" />
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="text-[#000000] text-[13px] lg:text-[15px] xl:text-[17px] font-semibold tracking-[0.3em] uppercase mb-4"
        >
          District 3292 · Established 1998
        </motion.p>

        {/* Club name */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.65 }}
          className="space-y-1"
        >
          <h1
            className="text-[#0f2252] font-bold tracking-tight leading-[1.1]"
            style={{ fontSize: "clamp(2.8rem, 5vw, 5.5rem)" }}
          >
            Rotary Club of
          </h1>
          <h1
            className="font-extrabold tracking-tight leading-[1.05]"
            style={{
              fontSize: "clamp(3.5rem, 6vw, 7rem)",
              background: "linear-gradient(135deg, #17458f 0%, #2d65b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Pashupati Kathmandu
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="text-[#17458f]/95 text-sm lg:text-base xl:text-lg tracking-[0.3em] uppercase mt-3 font-bold"
        >
          Kathmandu, Nepal
        </motion.p>
      </div>

      {/* ── BOTTOM STRIP ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.7 }}
        className="relative z-10"
      >
        {/* Gold separator line */}
        <div
          className="w-full h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(247,168,0,0.6) 15%, rgba(23,69,143,0.15) 50%, rgba(247,168,0,0.6) 85%, transparent 100%)",
          }}
        />

        <div
          className="flex items-end justify-between px-8 lg:px-14 py-5 sm:py-6"
          style={{ background: "rgba(224,235,248,0.75)", backdropFilter: "blur(14px)" }}
        >
          {/* Left: Latest project */}
          <div className="max-w-[260px] lg:max-w-sm xl:max-w-md">
            {latestProject ? (
              <Link href="/projects" className="group flex flex-col gap-0.5">
                <span className="inline-flex items-center gap-2 text-[9.5px] lg:text-[11px] xl:text-[12px] font-semibold tracking-[0.22em] uppercase text-[#000000] mb-1.5">
                  <span className="w-5 h-px bg-[#000000]" />
                  Latest
                </span>
                <p className="text-[#0f2252]/85 font-semibold text-sm lg:text-base xl:text-lg leading-snug group-hover:text-[#0f2252] transition-colors line-clamp-2">
                  {latestProject.title}
                </p>
                <p className="text-[#17458f]/50 text-[11px] mt-1">
                  {formattedDate}
                  {latestProject.category && (
                    <span className="ml-2 text-[#17458f]/35">· {latestProject.category}</span>
                  )}
                </p>
                <span className="flex items-center gap-1 text-[10px] text-[#17458f]/50 group-hover:text-[#f7a800] transition-colors mt-1">
                  View project <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </Link>
            ) : (
              <Link href="/projects" className="group flex flex-col gap-0.5">
                <span className="inline-flex items-center gap-2 text-[9.5px] lg:text-[11px] xl:text-[12px] font-semibold tracking-[0.22em] uppercase text-[#f7a800] mb-1.5">
                  <span className="w-5 h-px bg-[#f7a800]" />
                  Our Work
                </span>
                <p className="text-[#0f2252]/85 font-semibold text-sm lg:text-base xl:text-lg group-hover:text-[#0f2252] transition-colors">
                  Serving Kathmandu since 1998
                </p>
                <span className="flex items-center gap-1 text-[10px] text-[#17458f]/50 group-hover:text-[#f7a800] transition-colors mt-1">
                  Explore projects <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </Link>
            )}
          </div>

          {/* Right: Motto */}
          <div className="hidden sm:block text-right">
            <p
              className="italic font-light leading-[1.15] tracking-wide"
              style={{
                fontSize: "clamp(1.4rem, 2.8vw, 3.2rem)",
                color: "rgba(15,34,82,0.45)",
              }}
            >
              Service
            </p>
            <p
              className="italic font-light leading-[1.15] tracking-wide"
              style={{
                fontSize: "clamp(1.4rem, 2.8vw, 3.2rem)",
                color: "rgba(15,34,82,0.85)",
              }}
            >
              Before Self
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
