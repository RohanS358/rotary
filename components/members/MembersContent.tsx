"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { User, Users, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { Member } from "@/lib/types";

interface Props {
  members: Member[];
}

function MemberCard({ member }: { member: Member }) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center"
    >
      <div className="relative w-20 h-20 rounded-full mx-auto mb-4 bg-[#eef2fa] flex items-center justify-center overflow-hidden ring-2 ring-primary/10">
        {member.photo_url ? (
          <Image src={member.photo_url} alt={member.name} fill className="object-cover" />
        ) : (
          <User className="w-9 h-9 text-primary/40" />
        )}
      </div>
      <h3 className="font-bold text-foreground text-base mb-1">{member.name}</h3>
      {member.role && (
        <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
      )}
      {member.type === "board" && (
        <Badge variant="secondary" className="text-xs">Board Member</Badge>
      )}
      {member.is_trf && (
        <Badge className="text-xs bg-[#f7a800] text-white hover:bg-[#f7a800]/90 mt-1">TRF Contributor</Badge>
      )}
      {member.bio && (
        <p className="text-muted-foreground text-xs leading-relaxed mt-3 line-clamp-3">
          {member.bio}
        </p>
      )}
    </motion.div>
  );
}

const PLACEHOLDER_MEMBER: Member = {
  id: "placeholder",
  name: "Member Name",
  role: "Role",
  photo_url: null,
  type: "member",
  bio: "A dedicated Rotarian committed to service above self.",
  year: null,
  active: true,
  order_index: 0,
  donation_amount: null,
  is_trf: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function MemberGrid({ data, isPlaceholder }: { data: Member[]; isPlaceholder: boolean }) {
  return (
    <>
      {isPlaceholder && (
        <p className="text-center text-muted-foreground text-sm mb-8">
          Member data will appear here once added via the admin panel.
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {data.map((member, i) => (
          <motion.div
            key={member.id + i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <MemberCard member={member} />
          </motion.div>
        ))}
      </div>
    </>
  );
}

export default function MembersContent({ members }: Props) {
  const boardMembers = members.filter((m) => m.type === "board");
  const regularMembers = members.filter((m) => m.type === "member");
  const rotaractPktm = members.filter((m) => m.type === "rotaract" || m.type === "rotaract_pktm");
  const rotaractLaw = members.filter((m) => m.type === "rotaract_law");
  const allRotaract = [...rotaractPktm, ...rotaractLaw];

  const boardDisplay = boardMembers.length > 0 ? boardMembers : Array(4).fill({ ...PLACEHOLDER_MEMBER, type: "board" });
  const membersDisplay = regularMembers.length > 0 ? regularMembers : Array(8).fill(PLACEHOLDER_MEMBER);
  const rotaractPktmDisplay = rotaractPktm.length > 0 ? rotaractPktm : Array(3).fill({ ...PLACEHOLDER_MEMBER, type: "rotaract_pktm" });
  const rotaractLawDisplay = rotaractLaw.length > 0 ? rotaractLaw : Array(3).fill({ ...PLACEHOLDER_MEMBER, type: "rotaract_law" });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#06112a] to-[#17458f] py-16 lg:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-[#f7a800] font-semibold text-sm uppercase tracking-widest mb-3">
              Our Family
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Members</h1>
            <p className="text-blue-200 max-w-xl mx-auto text-lg">
              Meet the dedicated Rotarians who make our mission a reality every single day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="board" className="w-full">
            <TabsList className="mb-10 h-auto p-1.5 bg-accent border border-border flex flex-wrap gap-1">
              <TabsTrigger value="board" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                <Users className="w-4 h-4" />
                Board Members
                {boardMembers.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs h-5">{boardMembers.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="members" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                <User className="w-4 h-4" />
                All Members
                {regularMembers.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs h-5">{regularMembers.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rotaract" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                <Zap className="w-4 h-4" />
                Rotaract Club
                {allRotaract.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs h-5">{allRotaract.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="board">
              <MemberGrid data={boardDisplay} isPlaceholder={boardMembers.length === 0} />
            </TabsContent>

            <TabsContent value="members">
              <MemberGrid data={membersDisplay} isPlaceholder={regularMembers.length === 0} />
            </TabsContent>

            <TabsContent value="rotaract">
              <Tabs defaultValue="pktm" className="w-full">
                <TabsList className="mb-8 h-auto p-1 bg-[#eef4fc] border border-[#c4d6ee] inline-flex gap-1">
                  <TabsTrigger
                    value="pktm"
                    className="gap-2 text-sm data-[state=active]:bg-[#17458f] data-[state=active]:text-white"
                  >
                    Pashupati Kathmandu
                    {rotaractPktm.length > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs h-5">{rotaractPktm.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="law"
                    className="gap-2 text-sm data-[state=active]:bg-[#17458f] data-[state=active]:text-white"
                  >
                    Pashupati Law Campus
                    {rotaractLaw.length > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs h-5">{rotaractLaw.length}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pktm">
                  <MemberGrid data={rotaractPktmDisplay} isPlaceholder={rotaractPktm.length === 0} />
                </TabsContent>
                <TabsContent value="law">
                  <MemberGrid data={rotaractLawDisplay} isPlaceholder={rotaractLaw.length === 0} />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
