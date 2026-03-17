"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS } from "@/lib/constants";
import ParticleBackground from "@/components/ui/particle-background";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(ref.current!, {
        textContent: 0,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        onUpdate: function () {
          if (ref.current) {
            ref.current.textContent =
              Math.ceil(Number(ref.current.textContent)).toLocaleString() + suffix;
          }
        },
        onComplete: function () {
          if (ref.current) {
            ref.current.textContent = value.toLocaleString() + suffix;
          }
        },
      });
    });
    return () => ctx.revert();
  }, [inView, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString() + suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
      style={{ background: "#eef4fc" }}
    >
      <ParticleBackground/>
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(23,69,143,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Decorative horizontal lines */}
      <div
        className="absolute left-0 right-0 top-1/2 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(247,168,0,0.3), transparent)" }}
      />
      {/* Corner glows */}
      <div className="absolute -right-32 top-0 w-96 h-96 bg-[#17458f]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-32 bottom-0 w-96 h-96 bg-[#17458f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#f7a800] text-[10px] font-semibold tracking-[0.3em] uppercase mb-4">
            Our Impact
          </p>
          <h2
            className="text-[#0f2252] font-extrabold tracking-tight leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Creating Lasting Change
          </h2>
          <div className="mt-4 mx-auto w-16 h-0.5 rounded-full" style={{ background: "rgba(247,168,0,0.6)" }} />
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {STATS.map(({ label, value, suffix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              className="text-center group"
            >
              {/* Card */}
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(23,69,143,0.1)",
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full"
                  style={{ background: "#f7a800" }}
                />
                <p
                  className="font-black leading-none mb-3"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#f7a800" }}
                >
                  <Counter value={value} suffix={suffix} />
                </p>
                <p className="text-[#0f2252]/55 text-sm font-medium tracking-wide uppercase">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-14 text-[#17458f]/40 text-xs font-medium tracking-[0.3em] uppercase"
        >
          Serving Kathmandu since 1998 · District 3292
        </motion.p>

        {/* Join Us CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex justify-center mt-8"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#17458f] text-white font-semibold text-base hover:bg-[#0f2252] transition-all duration-200 hover:shadow-lg hover:shadow-[#17458f]/25 hover:-translate-y-0.5"
          >
            Join Us
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
