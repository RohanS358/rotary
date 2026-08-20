"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Heart, Users, Award, Users2, Star, Zap, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

// ── Mega-menu extra data (icons, descriptions, right-panel copy) ──────────
type MegaItem = { label: string; href: string; icon: React.ReactNode; description: string };
type MegaSection = { title: string; items: MegaItem[] };
type MegaData = { tagline: string; description: string; stat: { value: string; label: string }; sections: MegaSection[] };

const MEGA: Record<string, MegaData> = {
  "Who We Are": {
    tagline: "District 3292 · Est. 1998",
    description:
      "Rotary Club of Pashupati Kathmandu — dedicated to fellowship, integrity, and service above self across Nepal and beyond.",
    stat: { value: "25+", label: "Years of service" },
    sections: [
      {
        title: "Our Club",
        items: [
          { label: "About Us", href: "/about", icon: <Users className="w-5 h-5" />, description: "Mission, history, and values since 1998" },
          { label: "TRF Contributors", href: "/about/trf-contributors", icon: <Award className="w-5 h-5" />, description: "Members recognised by The Rotary Foundation" },
        ],
      },
    ],
  },
  Members: {
    tagline: "District 3292 · Est. 1998",
    description:
      "A diverse community of 50+ leaders, professionals, and change-makers committed to lasting impact in Kathmandu.",
    stat: { value: "50+", label: "Active members" },
    sections: [
      {
        title: "Membership",
        items: [
          { label: "Our Members", href: "/members", icon: <Users2 className="w-5 h-5" />, description: "Meet all active club members" },
          { label: "Board Members", href: "/members#board", icon: <Star className="w-5 h-5" />, description: "Current leadership and board" },
          { label: "Rotaract Club", href: "/members#rotaract", icon: <Zap className="w-5 h-5" />, description: "Our youth-led Rotaract chapter" },
        ],
      },
    ],
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.22, delay: i * 0.06 } }),
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setExpandedMenu(null);
    setMobileExpanded(null);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const currentMega = expandedMenu ? MEGA[expandedMenu] : null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#f0f5fc]/95 backdrop-blur-md shadow-md border-b border-[#c4d6ee]",
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 xl:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
              <Image
                src="/wheel.png"
                width={44}
                height={44}
                priority
                alt="Rotary wheel"
                className="opacity-85 group-hover:opacity-100 transition-opacity"
              />
              <div className="hidden sm:block leading-tight">
                <p className="text-base font-bold text-[#0f2252]">Rotary Club of Pashupati</p>
                <p className="text-sm font-medium text-[#17458f]/70">Kathmandu</p>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden xl:flex items-center gap-0.5">
              {NAV_ITEMS.map((item) =>
                MEGA[item.label] ? (
                  <button
                    key={item.label}
                    onClick={() => {
                      const next = expandedMenu === item.label ? null : item.label;
                      setExpandedMenu(next);
                      if (next) setHoveredItem(MEGA[next].sections[0].items[0].label);
                    }}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[13px] font-semibold transition-colors",
                      expandedMenu === item.label || isActive(item.href)
                        ? "text-[#17458f] bg-[#d8e8f8]"
                        : "text-[#0f2252]/80 hover:text-[#17458f] hover:bg-[#d8e8f8]"
                    )}
                  >
                    {item.label}
                    <motion.span
                      animate={{ rotate: expandedMenu === item.label ? 90 : 0 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </motion.span>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md text-[13px] font-semibold transition-colors",
                      isActive(item.href)
                        ? "text-[#17458f] bg-[#d8e8f8]"
                        : "text-[#0f2252]/80 hover:text-[#17458f] hover:bg-[#d8e8f8]"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Desktop CTA */}
            <div className="hidden xl:flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                className="gap-1.5 text-[#17458f] hover:text-[#0f2252] hover:bg-[#d8e8f8] text-[14px] font-semibold h-9 px-3"
              >
                <Link href="/admin/login">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className="gap-2 shadow-sm bg-[#f7a800] hover:bg-[#e09700] text-[#0f2252] border-0 text-[15px] font-semibold h-9 px-4"
              >
                <Link href="/donate">
                  <Heart className="w-4 h-4" />
                  Donate
                </Link>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="xl:hidden p-2 rounded-md text-[#0f2252] hover:bg-[#d8e8f8] transition-colors"
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* ── Desktop Mega Panel ── */}
        <AnimatePresence>
          {expandedMenu && currentMega && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="border-t border-[#c4d6ee] bg-[#eef4fc]/98 backdrop-blur-md hidden xl:block overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-5 gap-8">

                  {/* Left: nav cards */}
                  <div className="col-span-2 space-y-5">
                    {currentMega.sections.map((section) => (
                      <div key={section.title}>
                        <p className="text-[12px] font-bold text-[#17458f]/45 tracking-[0.2em] uppercase mb-3">
                          {section.title}
                        </p>
                        <div className="space-y-2">
                          {section.items.map((item, i) => (
                            <motion.div
                              key={item.label}
                              custom={i}
                              variants={cardVariants}
                              initial="hidden"
                              animate="visible"
                              onMouseEnter={() => setHoveredItem(item.label)}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setExpandedMenu(null)}
                                className={cn(
                                  "flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all",
                                  hoveredItem === item.label || isActive(item.href)
                                    ? "bg-white border-[#c4d6ee] shadow-sm"
                                    : "bg-white/40 border-transparent hover:bg-white hover:border-[#c4d6ee]"
                                )}
                              >
                                <span
                                  className={cn(
                                    "mt-0.5 p-1.5 rounded-lg flex-shrink-0 transition-colors",
                                    hoveredItem === item.label
                                      ? "bg-[#f7a800]/15 text-[#f7a800]"
                                      : "bg-[#d8e8f8] text-[#17458f]"
                                  )}
                                >
                                  {item.icon}
                                </span>
                                <div>
                                  <p className="text-base font-semibold text-[#0f2252]">{item.label}</p>
                                  <p className="text-[13px] text-[#17458f]/55 mt-0.5">{item.description}</p>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: info panel */}
                  <motion.div
                    key={expandedMenu}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28 }}
                    className="col-span-3 rounded-2xl relative flex flex-col justify-between p-8 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #d4e6f8 0%, #bdd0ec 100%)",
                      border: "1px solid #c4d6ee",
                    }}
                  >
                    {/* Decorative wheel */}
                    <div className="absolute -right-10 -bottom-10 opacity-[0.08] pointer-events-none select-none">
                      <Image src="/wheel.png" width={280} height={280} alt="" />
                    </div>

                    <div>
                      <span className="inline-block text-[12px] font-bold tracking-[0.2em] uppercase text-[#f7a800] mb-3">
                        {currentMega.tagline}
                      </span>
                      <h3 className="text-3xl font-bold text-[#0f2252] leading-tight mb-2">
                        {expandedMenu}
                      </h3>
                      <p className="text-base text-[#17458f]/65 leading-relaxed max-w-sm">
                        {currentMega.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-baseline gap-1.5">
                      <span className="text-5xl font-extrabold text-[#17458f]">
                        {currentMega.stat.value}
                      </span>
                      <span className="text-base font-medium text-[#17458f]/55 mb-0.5">
                        {currentMega.stat.label}
                      </span>
                    </div>
                  </motion.div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm xl:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-[#f0f5fc] shadow-2xl xl:hidden overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b border-[#c4d6ee]">
                <div className="flex items-center gap-2.5">
                  <Image src="/wheel.png" width={30} height={30} alt="Rotary wheel" />
                  <div>
                    <p className="text-xs text-[#17458f]/55">Rotary Club of</p>
                    <p className="font-bold text-[#0f2252] leading-tight text-sm">Pashupati Kathmandu</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-md hover:bg-[#d8e8f8] transition-colors"
                >
                  <X className="w-5 h-5 text-[#0f2252]" />
                </button>
              </div>

              {/* Drawer nav */}
              <nav className="p-4 space-y-1">
                {NAV_ITEMS.map((item) =>
                  MEGA[item.label] ? (
                    <div key={item.label}>
                      <button
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          mobileExpanded === item.label
                            ? "text-[#17458f] bg-[#d8e8f8]"
                            : "text-[#0f2252] hover:text-[#17458f] hover:bg-[#d8e8f8]"
                        )}
                        onClick={() =>
                          setMobileExpanded(mobileExpanded === item.label ? null : item.label)
                        }
                      >
                        {item.label}
                        <motion.span
                          animate={{ rotate: mobileExpanded === item.label ? 90 : 0 }}
                          transition={{ duration: 0.18 }}
                          className="inline-flex"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {mobileExpanded === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1.5 pl-2 space-y-1.5">
                              {MEGA[item.label].sections.flatMap((s) => s.items).map((subitem, i) => (
                                <motion.div
                                  key={subitem.href}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  <Link
                                    href={subitem.href}
                                    className={cn(
                                      "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all",
                                      isActive(subitem.href)
                                        ? "bg-white border-[#c4d6ee] text-[#17458f]"
                                        : "bg-white/50 border-transparent text-[#0f2252]/80 hover:bg-white hover:border-[#c4d6ee]"
                                    )}
                                  >
                                    <span className="text-[#17458f] flex-shrink-0">{subitem.icon}</span>
                                    <div>
                                      <p className="text-sm font-medium leading-tight">{subitem.label}</p>
                                      <p className="text-xs text-[#17458f]/50 mt-0.5">{subitem.description}</p>
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "text-[#17458f] bg-[#d8e8f8]"
                          : "text-[#0f2252]/70 hover:text-[#17458f] hover:bg-[#d8e8f8]"
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>

              {/* Drawer CTA */}
              <div className="p-4 border-t border-[#c4d6ee]">
                <Button
                  asChild
                  className="w-full gap-2 bg-[#f7a800] hover:bg-[#e09700] text-[#0f2252] border-0"
                >
                  <Link href="/donate">
                    <Heart className="w-4 h-4" />
                    Donate Now
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full gap-2 mt-2 border-[#c4d6ee] text-[#17458f] hover:bg-[#d8e8f8]"
                >
                  <Link href="/admin/login">
                    <LogIn className="w-4 h-4" />
                    Member Login
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
