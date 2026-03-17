"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Filter, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ARCHIVE_TYPES } from "@/lib/constants";
import type { Archive } from "@/lib/types";

interface Props {
  archives: Archive[];
}

const TYPE_COLORS = {
  meeting: { bg: "#eff6ff", text: "#2563eb", label: "Meeting" },
  event: { bg: "#f0fdf4", text: "#16a34a", label: "Event" },
  document: { bg: "#fff7ed", text: "#ea580c", label: "Document" },
};

const PLACEHOLDER_ARCHIVES: Partial<Archive>[] = [
  { id: "1", title: "Meeting No. 1231 — Inhouse Speaker", description: "Regular club meeting with an inhouse speaker session.", type: "meeting", date: "2024-01-15", file_url: null, created_at: "" },
  { id: "2", title: "26th Installation Ceremony", description: "Annual Installation Ceremony for club officers.", type: "event", date: "2023-07-07", file_url: null, created_at: "" },
  { id: "3", title: "Annual Report 2023-24", description: "Annual report summarizing club activities and financials.", type: "document", date: "2024-06-30", file_url: null, created_at: "" },
];

export default function ArchivesContent({ archives }: Props) {
  const [activeFilter, setActiveFilter] = useState("All");

  const displayArchives = archives.length > 0 ? archives : PLACEHOLDER_ARCHIVES as Archive[];

  const filtered =
    activeFilter === "All"
      ? displayArchives
      : displayArchives.filter((a) => a.type === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#06112a] to-[#17458f] py-16 lg:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-[#f7a800] font-semibold text-sm uppercase tracking-widest mb-3">History</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Archives</h1>
            <p className="text-blue-200 max-w-xl mx-auto text-lg">
              Meeting minutes, event records, and historical documents.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {ARCHIVE_TYPES.map((type) => (
              <Button
                key={type}
                variant={activeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(type)}
                className="rounded-full capitalize"
              >
                {type === "All" ? "All" : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
              </Button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-4">
            {filtered.map((archive, i) => {
              const typeStyle = TYPE_COLORS[archive.type] || TYPE_COLORS.document;
              return (
                <motion.div
                  key={archive.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:bg-accent transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: typeStyle.bg }}
                  >
                    <FileText className="w-5 h-5" style={{ color: typeStyle.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{archive.title}</h3>
                      <Badge
                        className="text-white text-xs flex-shrink-0"
                        style={{ backgroundColor: typeStyle.text }}
                      >
                        {typeStyle.label}
                      </Badge>
                    </div>
                    {archive.description && (
                      <p className="text-muted-foreground text-sm mt-1">{archive.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {archive.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(archive.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                  {archive.file_url && (
                    <a
                      href={archive.file_url}
                      download
                      className="flex-shrink-0"
                    >
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="w-3.5 h-3.5" /> Download
                      </Button>
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No archives found in this category.</p>
          )}
        </div>
      </section>
    </>
  );
}
