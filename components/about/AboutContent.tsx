"use client";

import { motion } from "framer-motion";
import { Award, Users, Globe, Heart } from "lucide-react";
import { CLUB_INFO, CORE_VALUES } from "@/lib/constants";

const FALLBACK_MISSION =
  "The mission of Rotary International is to provide services to others, promote integrity, and advance world understanding, goodwill, and peace through the fellowship of business, professional, and community leaders.";

const FALLBACK_DESCRIPTION =
  "Rotary is a global network of 1.2 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change — across the globe, in our communities, and in ourselves. For more than 110 years, Rotary clubs have been bringing people together to strengthen communities and support important causes worldwide.";

interface Props {
  heroText: { mission: string; description: string };
}

export default function AboutContent({ heroText }: Props) {
  const mission = heroText.mission || FALLBACK_MISSION;
  const description = heroText.description || FALLBACK_DESCRIPTION;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#06112a] to-[#17458f] py-16 lg:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#f7a800] font-semibold text-sm uppercase tracking-widest mb-3">
              Who We Are
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-blue-200 max-w-xl mx-auto text-lg">
              Learn about our club, our mission, and why we serve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
                Our Mission
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Service Above Self
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                {mission}
              </p>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-4"
            >
              {/* Award card */}
              <div className="bg-gradient-to-r from-[#17458f] to-[#1e5ba8] rounded-2xl p-6 text-white flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center">
                  <Award className="w-7 h-7 text-[#f7a800]" />
                </div>
                <div>
                  <p className="font-bold text-lg">Best Club Award</p>
                  <p className="text-blue-200 text-sm">Rotary Year 2023-24</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: "50+", desc: "Active Members" },
                  { icon: Globe, label: CLUB_INFO.district, desc: "Rotary District" },
                  { icon: Heart, label: "100+", desc: "Projects Done" },
                  { icon: Award, label: CLUB_INFO.founded, desc: "Year Founded" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div
                    key={desc}
                    className="bg-accent border border-border rounded-xl p-4 text-center"
                  >
                    <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xl font-bold text-primary">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Rotary Foundation */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              About TRF
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              The Rotary Foundation
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
              The Rotary Foundation is a public charity operated exclusively for
              charitable purposes. Founded in 1917 with an initial contribution of
              just $26.50, it has grown to award more than $300 million in
              humanitarian grants annually. Associate foundations exist in Australia,
              Brazil, Canada, Germany, India, Japan, and the UK.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
