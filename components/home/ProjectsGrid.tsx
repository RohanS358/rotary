"use client";

import { useState } from "react";
import Image from "@/components/ui/SmartImage";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Calendar, Tag, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  "Maternal and Child Health": "#e74c3c",
  "Basic Education and Literacy": "#3b82f6",
  "Economic and Community Development": "#16a34a",
  "Peace and Conflict Prevention": "#7c3aed",
  "Disease Prevention and Treatment": "#ea580c",
  "Water and Sanitation": "#0891b2",
  "Others": "#17458f",
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const MAX_CHARS = 120;

function ProjectCard({ project }: { project: Partial<Project> }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[project.category || "Others"] || "#17458f";
  const description = project.description || "";
  const isLong = description.length > MAX_CHARS;

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.18 } }}
      className="group relative rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(23,69,143,0.1)",
      }}
    >
      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
        style={{ boxShadow: `inset 0 0 0 1.5px ${color}55` }}
      />

      {/* Image area */}
      <div
        className="relative h-44 overflow-hidden flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${color}22 0%, ${color}0d 100%)` }}
      >
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title || "Project"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg"
              style={{ backgroundColor: color }}
            >
              {(project.title || "P").charAt(0)}
            </div>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide text-white uppercase"
            style={{ backgroundColor: color }}
          >
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[0.95rem] text-[#0f2252] mb-2 leading-tight group-hover:text-[#17458f] transition-colors">
          {project.title}
        </h3>

        {/* Description with see more toggle */}
        <p className="text-[#17458f]/60 text-sm leading-relaxed mb-3">
          {isLong && !expanded
            ? description.slice(0, MAX_CHARS).trimEnd()
            : description}
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-[#17458f] hover:text-[#0f2252] font-semibold ml-1 transition-colors focus:outline-none"
            >
              {expanded ? "see less" : "...see more"}
            </button>
          )}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-[#17458f]/40 mt-auto pt-3 border-t border-[#17458f]/8">
          {project.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(project.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          {project.impact_metric && (
            <span className="flex items-center gap-1.5 font-semibold" style={{ color }}>
              <Tag className="w-3.5 h-3.5" />
              {project.impact_metric}
            </span>
          )}
        </div>

        {/* Facebook link — inside card, not wrapping it */}
        {project.facebook_url && (
          <a
            href={project.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color }}
          >
            View on Facebook <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}

export default function ProjectsGrid({ projects }: { projects: Partial<Project>[] }) {
  return (
    <section
      className="min-h-screen flex flex-col justify-center py-20 lg:py-24 relative overflow-hidden"
      style={{
        backgroundImage: 'url("/pattern.jpg")',
        backgroundRepeat: "repeat",
        backgroundSize: "300px 300px",
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-[#f7a800] text-[10px] font-semibold tracking-[0.3em] uppercase mb-4">
              Our Work
            </p>
            <h2
              className="text-[#0f2252] font-extrabold tracking-tight leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#17458f]/70 hover:text-[#17458f] transition-colors duration-200 shrink-0"
            style={{ border: "1px solid rgba(23,69,143,0.2)" }}
          >
            All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((project, i) => (
            <motion.div key={project.id || i} variants={itemVariants} className="h-full">
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
