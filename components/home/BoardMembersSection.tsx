import Image from "@/components/ui/SmartImage";
import Link from "next/link";
import { User, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/lib/types";

const FALLBACK_PRESIDENT: Partial<Member> = {
  id: "president",
  name: "President",
  role: "President",
  photo_url: null,
  type: "board",
};

const FALLBACK_BOARD: Partial<Member>[] = [
  { id: "b1", name: "Vice President", role: "Vice President", photo_url: null, type: "board" },
  { id: "b2", name: "Secretary", role: "Secretary", photo_url: null, type: "board" },
  { id: "b3", name: "Treasurer", role: "Treasurer", photo_url: null, type: "board" },
  { id: "b4", name: "Director", role: "SAP Director", photo_url: null, type: "board" },
  { id: "b5", name: "Director", role: "Community Director", photo_url: null, type: "board" },
  { id: "b6", name: "Director", role: "Youth Director", photo_url: null, type: "board" },
];

export default async function BoardMembersSection() {
  let board: Partial<Member>[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("members")
      .select("id,name,role,photo_url,type,bio,order_index")
      .eq("type", "board")
      .eq("active", true)
      .order("order_index", { ascending: true });
    if (data && data.length > 0) board = data;
  } catch {
    // use fallback
  }

  const president = board.length > 0 ? board[0] : FALLBACK_PRESIDENT;
  const rest = board.length > 1 ? board.slice(1) : FALLBACK_BOARD;
  const isFallback = board.length === 0;

  return (
    <section className="py-16 lg:py-24 bg-[#f0f5fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#f7a800] text-[10px] font-semibold tracking-[0.3em] uppercase mb-3">
            Club Board
          </p>
          <h2
            className="text-[#0f2252] font-extrabold tracking-tight leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Our Leadership
          </h2>
        </div>

        {isFallback && (
          <p className="text-center text-[#17458f]/40 text-sm mb-10">
            Board data will appear here once added via the admin panel.
          </p>
        )}

        {/* President — top center, prominent */}
        <div className="flex justify-center mb-10">
          <div
            className="relative flex flex-col items-center bg-white rounded-3xl px-10 py-8 shadow-md border border-[#c4d6ee]"
            style={{ minWidth: 220, maxWidth: 280 }}
          >
            {/* gold top bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-[#f7a800]" />
            <div
              className="relative w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-[#f7a800] ring-offset-2 ring-offset-white"
              style={{ background: "#eef4fc" }}
            >
              {president.photo_url ? (
                <Image src={president.photo_url} alt={president.name || ""} fill sizes="96px" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-[#17458f]/30" />
                </div>
              )}
            </div>
            <p className="font-extrabold text-[#0f2252] text-lg text-center leading-tight">
              {president.name}
            </p>
            {president.role && (
              <span className="mt-2 inline-block text-[11px] font-bold tracking-widest uppercase text-white px-3 py-1 rounded-full bg-[#17458f]">
                {president.role}
              </span>
            )}
          </div>
        </div>

        {/* Connector line */}
        <div className="flex justify-center mb-8">
          <div className="w-px h-8 bg-[#c4d6ee]" />
        </div>

        {/* Rest of board — grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
          {rest.map((member, i) => (
            <div
              key={member.id || i}
              className="flex flex-col items-center bg-white rounded-2xl px-5 py-6 border border-[#c4d6ee]/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div
                className="relative w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-[#17458f]/15"
                style={{ background: "#eef4fc" }}
              >
                {member.photo_url ? (
                  <Image src={member.photo_url} alt={member.name || ""} fill sizes="64px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-7 h-7 text-[#17458f]/25" />
                  </div>
                )}
              </div>
              <p className="font-bold text-[#0f2252] text-sm text-center leading-tight">
                {member.name}
              </p>
              {member.role && (
                <p className="text-[#17458f]/60 text-xs mt-1 text-center">{member.role}</p>
              )}
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="flex justify-center mt-10">
          <Link
            href="/members#board"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#17458f]/70 hover:text-[#17458f] transition-colors duration-200"
            style={{ border: "1px solid rgba(23,69,143,0.2)" }}
          >
            View all board members <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
