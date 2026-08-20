import type { Metadata } from "next";
import Image from "@/components/ui/SmartImage";
import { Award, Heart, Globe, User, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/lib/types";

export const metadata: Metadata = {
  title: "TRF Contributors",
  description:
    "Rotary Foundation contributors from Rotary Club of Pashupati Kathmandu who support global humanitarian work.",
};

function getDonorLevel(amount: number | null): { label: string; bg: string; text: string } {
  if (amount != null && amount >= 10000) return { label: "Major Donor", bg: "#f7a800", text: "#fff" };
  if (amount != null && amount >= 1000) return { label: "Paul Harris Fellow", bg: "#17458f", text: "#fff" };
  return { label: "TRF Contributor", bg: "#16a34a", text: "#fff" };
}

export default async function TRFContributorsPage() {
  let members: Member[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("is_trf", true)
      .eq("active", true)
      .order("donation_amount", { ascending: false });
    if (data && data.length > 0) members = data;
  } catch {
    // Supabase not configured
  }

  const majorDonors = members.filter((m) => m.donation_amount != null && m.donation_amount >= 10000);
  const paulHarris = members.filter((m) => m.donation_amount != null && m.donation_amount >= 1000 && m.donation_amount < 10000);
  const contributors = members.filter((m) => m.donation_amount == null || m.donation_amount < 1000);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#06112a] to-[#17458f] py-16 lg:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#f7a800] font-semibold text-sm uppercase tracking-widest mb-3">
            Our Foundation
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">TRF Contributors</h1>
          <p className="text-blue-200 max-w-xl mx-auto text-lg">
            Honoring the members of Rotary Club Pashupati Kathmandu who give generously
            to The Rotary Foundation to fund humanitarian projects worldwide.
          </p>
          {members.length > 0 && (
            <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3">
              <Award className="w-5 h-5 text-[#f7a800]" />
              <span className="text-white font-semibold">
                {members.length} contributor{members.length !== 1 ? "s" : ""} from our club
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Donor level info */}
      <section className="py-14 bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Paul Harris Fellows",
                desc: "Members who have contributed $1,000 or more to The Rotary Foundation.",
                color: "#17458f",
                count: paulHarris.length,
              },
              {
                icon: Award,
                title: "Major Donors",
                desc: "Individuals who have given $10,000 or more in cumulative contributions.",
                color: "#f7a800",
                count: majorDonors.length,
              },
              {
                icon: Globe,
                title: "Global Impact",
                desc: "Every contribution funds disease eradication, peace programs, and more.",
                color: "#16a34a",
                count: null,
              },
            ].map(({ icon: Icon, title, desc, color, count }) => (
              <div key={title} className="bg-[#f8faff] border border-border rounded-2xl p-6 text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-foreground mb-1">{title}</h3>
                {count !== null && count > 0 && (
                  <p className="text-2xl font-extrabold mb-1" style={{ color }}>{count}</p>
                )}
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors list */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {members.length === 0 ? (
            <div className="bg-[#f8faff] border border-border rounded-2xl p-12 text-center">
              <Award className="w-12 h-12 text-[#f7a800] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">Our TRF Contributors</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                The list of TRF contributors from our club will be displayed here. For more
                information about contributing to The Rotary Foundation, please contact us or visit{" "}
                <a
                  href="https://www.rotary.org/en/about-rotary/rotary-foundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  rotary.org/foundation <ExternalLink className="w-3 h-3" />
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {majorDonors.length > 0 && (
                <MemberGroup
                  title="Major Donors"
                  subtitle="Cumulative contribution of $10,000 or more"
                  members={majorDonors}
                  accentColor="#f7a800"
                />
              )}
              {paulHarris.length > 0 && (
                <MemberGroup
                  title="Paul Harris Fellows"
                  subtitle="Contribution of $1,000 or more"
                  members={paulHarris}
                  accentColor="#17458f"
                />
              )}
              {contributors.length > 0 && (
                <MemberGroup
                  title="TRF Contributors"
                  subtitle="Supporting The Rotary Foundation"
                  members={contributors}
                  accentColor="#16a34a"
                />
              )}
            </div>
          )}

          <div className="mt-14 bg-gradient-to-br from-[#06112a] to-[#17458f] rounded-2xl p-8 text-white text-center">
            <Globe className="w-10 h-10 text-[#f7a800] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Support The Rotary Foundation</h3>
            <p className="text-blue-200 text-sm max-w-lg mx-auto mb-5">
              Your contribution to TRF funds programs that change lives — from polio eradication
              to peace fellowships and community grants.
            </p>
            <a
              href="https://www.rotary.org/en/about-rotary/rotary-foundation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f7a800] hover:bg-[#e09600] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Learn More at rotary.org <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function MemberGroup({
  title,
  subtitle,
  members,
  accentColor,
}: {
  title: string;
  subtitle: string;
  members: Member[];
  accentColor: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: accentColor }} />
        <div>
          <h2 className="text-xl font-bold text-[#0f2252]">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span
          className="ml-auto text-sm font-bold px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: accentColor }}
        >
          {members.length}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-border rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
            style={{ borderTop: `3px solid ${accentColor}` }}
          >
            <div className="relative w-18 h-18 w-[72px] h-[72px] rounded-full mb-3 bg-[#eef2fa] flex items-center justify-center overflow-hidden"
              style={{ outline: `3px solid ${accentColor}30` }}
            >
              {member.photo_url ? (
                <Image src={member.photo_url} alt={member.name} fill sizes="72px" className="object-cover rounded-full" />
              ) : (
                <User className="w-8 h-8 text-primary/40" />
              )}
            </div>
            <h3 className="font-bold text-sm text-foreground leading-tight mb-0.5">{member.name}</h3>
            {member.role && (
              <p className="text-xs font-medium mb-2" style={{ color: accentColor }}>{member.role}</p>
            )}
            {member.donation_amount != null && (
              <p className="text-xs font-bold text-[#0f2252] bg-[#f8faff] px-2.5 py-1 rounded-lg border border-border">
                ${member.donation_amount.toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
