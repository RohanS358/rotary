"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import type { GalleryItem } from "@/lib/types";

interface Props {
  items: GalleryItem[];
}

// Placeholder items for when no data
const PLACEHOLDER_ITEMS: Partial<GalleryItem>[] = Array.from({ length: 9 }, (_, i) => ({
  id: `placeholder-${i}`,
  title: `Gallery Image ${i + 1}`,
  image_url: `https://picsum.photos/seed/${i + 10}/600/400`,
  category: ["Education", "Health", "Empowerment", "Environment", "General"][i % 5] as GalleryItem["category"],
  date: null,
  alt_text: `Gallery image ${i + 1}`,
  created_at: new Date().toISOString(),
}));

export default function GalleryContent({ items }: Props) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayItems = items.length > 0 ? items : PLACEHOLDER_ITEMS as GalleryItem[];

  const filtered =
    activeFilter === "All"
      ? displayItems
      : displayItems.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#06112a] to-[#17458f] py-16 lg:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-[#f7a800] font-semibold text-sm uppercase tracking-widest mb-3">Visual Story</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-blue-200 max-w-xl mx-auto text-lg">
              A visual journey through our projects, events, and community impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {GALLERY_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id || i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="relative group cursor-pointer break-inside-avoid mb-4 rounded-xl overflow-hidden"
                  onClick={() => openLightbox(i)}
                >
                  <div className="relative aspect-auto">
                    <Image
                      src={item.image_url}
                      alt={item.alt_text || item.title}
                      width={600}
                      height={400}
                      className="w-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 rounded-xl flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs text-white bg-black/50 rounded-full px-2 py-1 backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No images found in this category.</p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightboxIndex].image_url}
                alt={filtered[lightboxIndex].alt_text || filtered[lightboxIndex].title}
                width={1200}
                height={800}
                className="max-h-[80vh] w-auto object-contain rounded-xl"
              />
              <p className="text-white text-center mt-3 font-medium">
                {filtered[lightboxIndex].title}
              </p>
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
