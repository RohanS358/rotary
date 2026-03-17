"use client";

import { motion, type Variants } from "framer-motion";
import { Users, Star, ShieldCheck, HandHeart } from "lucide-react";
import { CORE_VALUES } from "@/lib/constants";


const ICON_MAP = {
  users: Users,
  star: Star,
  "shield-check": ShieldCheck,
  "hand-heart": HandHeart,
};

const ACCENT_COLORS = ["#17458f", "#f7a800", "#16a34a", "#e74c3c"];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function ValueCards() {
  return (
    <section
      className="min-h-screen flex flex-col justify-center py-20 lg:py-24 relative overflow-hidden"
      style={{ background: "#eef4fc" }}
    >

      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(23,69,143,0.6) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(23,69,143,0.06) 0%, transparent 70%)",
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
            Our Foundation
          </p>
          <h2
            className="text-[#0f2252] font-extrabold tracking-tight leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Core Values
          </h2>
          <p className="text-[#17458f]/55 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            The values that guide every decision, project, and act of service we
            undertake as Rotarians.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {CORE_VALUES.map((value, i) => {
            const Icon = ICON_MAP[value.icon as keyof typeof ICON_MAP] || Star;
            const color = ACCENT_COLORS[i % ACCENT_COLORS.length];

            return (
              <motion.div
                key={value.title}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.18 } }}
                className="group relative rounded-2xl p-7 cursor-default transition-all duration-300 overflow-hidden text-center"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(23,69,143,0.1)",
                }}
              >
                {/* Hover bg tint */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `${color}0d` }}
                />
                {/* Hover border */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${color}44` }}
                />

                {/* Number badge */}
                <div
                  className="relative text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
                  style={{ color: `${color}99` }}
                >
                  0{i + 1}
                </div>

                {/* Icon */}
                <div className="relative mb-5 flex justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: `${color}20` }}
                  >
                    <Icon
                      className="w-8 h-8 transition-transform group-hover:scale-110 duration-200"
                      style={{ color }}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <h3 className="relative font-bold text-[1.05rem] text-[#0f2252] mb-3 leading-tight">
                  {value.title}
                </h3>
                <p className="relative text-[#17458f]/55 text-sm leading-relaxed group-hover:text-[#17458f]/75 transition-colors duration-300">
                  {value.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"
                  style={{ backgroundColor: color }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
