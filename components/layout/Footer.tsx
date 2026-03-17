import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Heart, ChevronRight } from "lucide-react";
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";
import { CLUB_INFO } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/types";

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Projects", href: "/projects" },
  { label: "Publications", href: "/publications" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

function fmtDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  let latestNews: Pick<NewsPost, "id" | "title" | "slug" | "category" | "published_at" | "created_at">[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news_posts")
      .select("id,title,slug,category,published_at,created_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(5);
    if (data) latestNews = data;
  } catch {
    // use empty list
  }

  return (
    <footer className="bg-[#0d1b3e] text-white relative overflow-hidden">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/wheel.png"
                width={44}
                height={44}
                alt="Rotary wheel"
                className="opacity-85"
              />
              <div>
                <p className="text-xs text-blue-300 leading-none">Rotary Club of</p>
                <p className="font-bold text-white text-sm leading-tight">Pashupati Kathmandu</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">
              Service Above Self — committed to creating lasting change in our community and beyond since {CLUB_INFO.founded}.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: FaFacebook, label: "Facebook", href: "#" },
                { icon: FaYoutube, label: "YouTube", href: "#" },
                { icon: FaInstagram, label: "Instagram", href: "#" },
                { icon: FaLinkedin, label: "LinkedIn", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-blue-200 hover:bg-[#17458f] hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest News */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Latest News
            </h3>
            {latestNews.length === 0 ? (
              <p className="text-blue-300/50 text-xs">No news yet.</p>
            ) : (
              <ul className="space-y-3">
                {latestNews.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/news/${post.slug}`}
                      className="group flex items-start gap-2 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#f7a800] group-hover:translate-x-0.5 transition-transform" />
                      <div>
                        <p className="text-blue-200 group-hover:text-white text-xs leading-snug line-clamp-2 transition-colors">
                          {post.title}
                        </p>
                        <p className="text-blue-400/60 text-[10px] mt-0.5">
                          {fmtDate(post.published_at ?? post.created_at)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-[#f7a800] mt-0.5 flex-shrink-0" />
                <span className="text-blue-200 text-sm">{CLUB_INFO.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-[#f7a800] mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${CLUB_INFO.phone}`}
                  className="text-blue-200 hover:text-white text-sm transition-colors"
                >
                  {CLUB_INFO.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-[#f7a800] mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${CLUB_INFO.email}`}
                  className="text-blue-200 hover:text-white text-sm transition-colors break-all"
                >
                  {CLUB_INFO.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="w-4 h-4 text-[#f7a800] mt-0.5 flex-shrink-0" />
                <span className="text-blue-200 text-sm">{CLUB_INFO.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-300 text-xs text-center sm:text-left">
            © {currentYear} Rotary Club of Pashupati Kathmandu. All rights reserved.
          </p>
          <p className="text-blue-400 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for Service Above Self
          </p>
        </div>
      </div>
    </footer>
  );
}
