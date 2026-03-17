"use client";

import { motion, type Variants } from "framer-motion";
import {
  Heart,
  BookOpen,
  TrendingUp,
  Globe,
  Shield,
  Droplets,
} from "lucide-react";
import { WORKING_AREAS } from "@/lib/constants";
import ParticleBackground from "@/components/ui/particle-background";

const ICON_MAP = {
  heart: Heart,
  "book-open": BookOpen,
  "trending-up": TrendingUp,
  globe: Globe,
  shield: Shield,
  droplets: Droplets,
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function WorkingAreas() {
  return (
    <section
      className="min-h-screen flex flex-col justify-center py-20 lg:py-24 relative overflow-hidden"
      style={{ background: "#f0f5fc" }}
    >
      <ParticleBackground />
      {/* Background texture */}
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
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(23,69,143,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#f7a800] text-[10px] font-semibold tracking-[0.3em] uppercase mb-4">
            Focus Areas
          </p>
          <h2
            className="text-[#0f2252] font-extrabold tracking-tight leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Six Areas of Focus
          </h2>
          <p className="text-[#17458f]/55 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Rotary concentrates humanitarian service in six areas where we can
            make the most significant and lasting impact.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {WORKING_AREAS.map((area) => {
            const Icon = ICON_MAP[area.icon as keyof typeof ICON_MAP] || Heart;

            return (
              <motion.div
                key={area.title}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.18 } }}
                className="group relative rounded-2xl p-7 cursor-default transition-all duration-300 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(23,69,143,0.1)",
                }}
              >
                {/* Hover bg tint */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
                  style={{ background: `${area.color}08` }}
                />
                {/* Hover border highlight */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${area.color}55` }}
                />

                {/* Icon */}
                <div className="relative mb-5 flex items-start">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center relative"
                    style={{ background: `${area.color}22` }}
                  >
                    <Icon
                      className="w-7 h-7 transition-all duration-300 group-hover:scale-110"
                      style={{ color: area.color }}
                      strokeWidth={1.5}
                    />
                    {/* Icon glow on hover */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        boxShadow: `0 0 24px ${area.color}55`,
                      }}
                    />
                  </div>
                </div>

                <h3 className="relative font-bold text-[1.05rem] text-[#0f2252] mb-2 leading-tight">
                  {area.title}
                </h3>
                <p className="relative text-[#17458f]/55 text-sm leading-relaxed group-hover:text-[#17458f]/75 transition-colors duration-300">
                  {area.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-full"
                  style={{ backgroundColor: area.color }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
