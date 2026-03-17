"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import ParticleBackground from "@/components/ui/particle-background";

const VIDEOS = [
  {
    title: "Nepal's National Anthem",
    description: "The national anthem of the Federal Democratic Republic of Nepal.",
    embedId: "3RL8MWtNsZo",
    badge: "National",
  },
  {
    title: "Rotary Anthem",
    description: "The official anthem of Rotary International — Service Above Self.",
    embedId: "7Pio8w6DMDI",
    badge: "Rotary",
  },
];

export default function VideoSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#f0f5fc] relative overflow-hidden">
      <ParticleBackground />
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#17458f]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f7a800]/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[#f7a800] font-semibold text-sm uppercase tracking-widest mb-3">
            Watch & Listen
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f2252] mb-4">
            Our Anthems
          </h2>
          <p className="text-[#17458f]/60 max-w-xl mx-auto text-lg">
            Celebrate the spirit of service and national pride through song.
          </p>
        </motion.div>

        {/* Videos grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {VIDEOS.map((video, i) => (
            <motion.div
              key={video.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group"
            >
              {/* Badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#f7a800]" />
                <span className="text-[#f7a800] text-xs font-semibold uppercase tracking-wider">
                  {video.badge}
                </span>
              </div>

              <h3 className="text-[#0f2252] font-bold text-xl mb-2">{video.title}</h3>
              <p className="text-[#17458f]/60 text-sm mb-4">{video.description}</p>

              {/* Video embed */}
              <div className="relative rounded-2xl overflow-hidden bg-[#17458f]/10 aspect-video shadow-lg border border-[#17458f]/10">
                <iframe
                  src={`https://www.youtube.com/embed/${video.embedId}?rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
