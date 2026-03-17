"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SAMPLE_TESTIMONIALS } from "@/lib/constants";


export default function Testimonials() {
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
            Our Members
          </p>
          <h2
            className="text-[#0f2252] font-extrabold tracking-tight leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Voices of Service
          </h2>
          <p className="text-[#17458f]/55 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Hear from the dedicated Rotarians who make our mission a reality every day.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {SAMPLE_TESTIMONIALS.map((testimonial, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div
                    className="rounded-2xl p-8 h-full flex flex-col"
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      border: "1px solid rgba(23,69,143,0.1)",
                    }}
                  >
                    {/* Quote icon */}
                    <Quote
                      className="w-8 h-8 mb-5 flex-shrink-0"
                      style={{ color: "rgba(247,168,0,0.6)" }}
                      fill="currentColor"
                    />

                    {/* Quote text */}
                    <p className="text-[#0f2252]/65 text-base leading-relaxed flex-1 mb-6 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div
                      className="flex items-center gap-4 pt-5"
                      style={{ borderTop: "1px solid rgba(23,69,143,0.1)" }}
                    >
                      <Avatar className="w-11 h-11" style={{ boxShadow: "0 0 0 2px rgba(247,168,0,0.4)" }}>
                        {testimonial.photo_url && (
                          <AvatarImage src={testimonial.photo_url} alt={testimonial.name} />
                        )}
                        <AvatarFallback
                          className="text-sm font-bold"
                          style={{ background: "#17458f", color: "#fff" }}
                        >
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm text-[#0f2252]">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-[#17458f]/50">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-3 mt-10">
              <CarouselPrevious
                className="static translate-y-0 rounded-full border-[#17458f]/20 bg-white/60 text-[#17458f] hover:bg-white hover:text-[#17458f] hover:border-[#f7a800]/50"
              />
              <CarouselNext
                className="static translate-y-0 rounded-full border-[#17458f]/20 bg-white/60 text-[#17458f] hover:bg-white hover:text-[#17458f] hover:border-[#f7a800]/50"
              />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
