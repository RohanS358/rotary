import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import StatsCounter from "@/components/home/StatsCounter";
import MissionSection from "@/components/home/MissionSection";
import TrophiesSection from "@/components/home/TrophiesSection";
import NewsPublicationsCalendar from "@/components/home/NewsPublicationsCalendar";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Testimonials from "@/components/home/Testimonials";
import BoardMembersSection from "@/components/home/BoardMembersSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch the most recent project for the Hero bottom-left card
  let latestProject: { title: string; date: string; category: string } | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("title, date, category")
      .eq("active", true)
      .order("date", { ascending: false })
      .limit(1)
      .single();
    if (data) latestProject = data;
  } catch {
    // use null — Hero will hide the latest card
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero latestProject={latestProject} />
        <MissionSection />
        <TrophiesSection />
        <FeaturedProjects />
        <NewsPublicationsCalendar />
        <BoardMembersSection />
        <StatsCounter />
        
        <Testimonials />
        <Footer />
      </main>
    </>
  );
}
