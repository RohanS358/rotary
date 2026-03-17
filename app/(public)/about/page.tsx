import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AboutContent from "@/components/about/AboutContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Rotary Club of Pashupati Kathmandu — our mission, history, values, and commitment to service above self.",
};

export default async function AboutPage() {
  let heroText = {
    mission: "",
    description: "",
  };

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_content")
      .select("key, value")
      .in("key", ["about_mission", "about_description"]);

    if (data) {
      data.forEach(({ key, value }) => {
        if (key === "about_mission") heroText.mission = value || "";
        if (key === "about_description") heroText.description = value || "";
      });
    }
  } catch {
    // use defaults
  }

  return <AboutContent heroText={heroText} />;
}
