"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Tag, Filter, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROJECT_CATEGORIES } from "@/lib/constants";
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

const FALLBACK_PROJECTS: Partial<Project>[] = [
  { id: "1", title: "Wheelchair Distribution", description: "Distributed wheelchairs to differently-abled individuals at Budhanilkantha Hospital.", category: "Disease Prevention and Treatment", date: "2023-07-07", impact_metric: "50+ beneficiaries", image_url: null, facebook_url: null, active: true, featured: true, created_at: "", updated_at: "" },
  { id: "2", title: "Rotary Prahari Batika", description: "Community garden initiative establishing green spaces across Kathmandu.", category: "Economic and Community Development", date: "2023-05-01", impact_metric: "5 gardens", image_url: null, facebook_url: null, active: true, featured: true, created_at: "", updated_at: "" },
  { id: "3", title: "SOCHKO PARIBARTAN", description: "Basic literacy initiative empowering underprivileged women and children.", category: "Basic Education and Literacy", date: "2023-09-01", impact_metric: "200+ students", image_url: null, facebook_url: null, active: true, featured: false, created_at: "", updated_at: "" },
  { id: "4", title: "HOPE FOR EMPOWERMENT", description: "Economic development program supporting local women entrepreneurs.", category: "Economic and Community Development", date: "2023-03-01", impact_metric: "100+ women", image_url: null, facebook_url: null, active: true, featured: false, created_at: "", updated_at: "" },
  { id: "5", title: "Free Health Camp 2075", description: "Annual free health camp providing basic medical services to the community.", category: "Maternal and Child Health", date: "2019-01-01", impact_metric: "500+ patients", image_url: null, facebook_url: null, active: true, featured: false, created_at: "", updated_at: "" },
  { id: "6", title: "ROTARY AGRICULTURAL LIBRARY", description: "Joint Rotary/Rotaract project establishing an agricultural reference library.", category: "Basic Education and Literacy", date: "2020-06-01", impact_metric: "1 library", image_url: null, facebook_url: null, active: true, featured: false, created_at: "", updated_at: "" },
];

interface Props {
  projects: Project[];
}

const MAX_CHARS = 120;

function ProjectCardItem({ project }: { project: Partial<Project> }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[project.category || "Others"] || "#17458f";
  const description = project.description || "";
  const isLong = description.length > MAX_CHARS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${color}22, ${color}0d)` }}>
        {project.image_url ? (
          <Image src={project.image_url} alt={project.title || ""} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: color }}>
              {(project.title || "P").charAt(0)}
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className="text-white text-xs font-semibold" style={{ backgroundColor: color }}>
            {project.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-base text-foreground mb-2 leading-tight">{project.title}</h3>

        {/* Description with see more */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">
          {isLong && !expanded ? description.slice(0, MAX_CHARS).trimEnd() : description}
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="font-semibold ml-1 transition-colors focus:outline-none"
              style={{ color }}
            >
              {expanded ? "see less" : "...see more"}
            </button>
          )}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
          {project.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(project.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          )}
          {project.impact_metric && (
            <span className="flex items-center gap-1.5 font-semibold" style={{ color }}>
              <Tag className="w-3.5 h-3.5" />
              {project.impact_metric}
            </span>
          )}
        </div>

        {/* Facebook link */}
        {project.facebook_url && (
          <a
            href={project.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline"
            style={{ color }}
          >
            View on Facebook <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function ProjectsContent({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const displayProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS;

  const filtered =
    activeFilter === "All"
      ? displayProjects
      : displayProjects.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#06112a] to-[#17458f] py-16 lg:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-[#f7a800] font-semibold text-sm uppercase tracking-widest mb-3">Our Work</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Projects</h1>
            <p className="text-blue-200 max-w-xl mx-auto text-lg">
              Explore the projects and initiatives driving lasting change across Kathmandu and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {PROJECT_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(cat)}
                className="rounded-full text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Grid */}
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCardItem key={project.id || i} project={project} />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No projects found in this category.</p>
          )}
        </div>
      </section>
    </>
  );
}
