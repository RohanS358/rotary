import type { Metadata } from "next";
import { Heart, HandCoins, Building, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLUB_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Rotary Club of Pashupati Kathmandu's community projects. Your donation makes lasting change.",
};

export default function DonatePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#06112a] to-[#17458f] py-16 lg:py-24 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#f7a800] font-semibold text-sm uppercase tracking-widest mb-3">
              Make a Difference
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Donate</h1>
            <p className="text-blue-200 max-w-xl mx-auto text-lg">
              Your generosity powers projects that transform lives across Kathmandu.
              Every contribution, large or small, creates lasting change.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Impact */}
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-4">Your Impact</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Donations to Rotary Club of Pashupati Kathmandu support direct community
                projects and global Rotary Foundation programs.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-14">
              {[
                {
                  icon: Heart,
                  title: "Health Programs",
                  desc: "Free health camps, wheelchair distribution, and disease prevention initiatives.",
                },
                {
                  icon: Globe,
                  title: "Global Grants",
                  desc: "Support The Rotary Foundation's global grant projects making international impact.",
                },
                {
                  icon: HandCoins,
                  title: "Community Projects",
                  desc: "Vocational centers, literacy programs, and environmental initiatives.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#f8faff] rounded-2xl border border-border p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              ))}
            </div>

            {/* Bank details */}
            <div className="bg-[#0d1b3e] rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Building className="w-6 h-6 text-[#f7a800]" />
                <h3 className="text-xl font-bold">Bank Transfer</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Account Name", value: "Rotary Club of Pashupati Kathmandu" },
                  { label: "Account Number", value: "Contact us for details" },
                  { label: "Bank", value: "Contact us for details" },
                  { label: "Branch", value: "Kathmandu" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-4">
                    <p className="text-blue-300 text-xs mb-1">{label}</p>
                    <p className="text-white font-medium">{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-blue-300 text-xs mt-4">
                For bank transfer details, please contact us at{" "}
                <a href={`mailto:${CLUB_INFO.email}`} className="text-[#f7a800] underline">
                  {CLUB_INFO.email}
                </a>
              </p>
            </div>

            {/* TRF donation link */}
            <div className="bg-[#f8faff] border border-border rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Donate to The Rotary Foundation
              </h3>
              <p className="text-muted-foreground mb-6">
                Contribute directly to The Rotary Foundation (TRF) — a public charity
                dedicated to creating positive, lasting change in the world.
              </p>
              <Button asChild size="lg" className="gap-2">
                <a
                  href="https://www.rotary.org/en/donate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Donate via Rotary International
                </a>
              </Button>
            </div>
          </div>
        </section>
    </>
  );
}
