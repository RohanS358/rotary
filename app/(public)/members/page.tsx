import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import MembersContent from "@/components/members/MembersContent";
import type { Member } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members",
  description:
    "Meet the dedicated Rotarians of Pashupati Kathmandu — board members, active members, and Rotaract club members.",
};

export default async function MembersPage() {
  let members: Member[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (data) members = data;
  } catch {
    // use empty array
  }

  return <MembersContent members={members} />;
}
