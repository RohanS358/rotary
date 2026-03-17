import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProjectsContent from "@/components/projects/ProjectsContent";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore community projects by Rotary Club of Pashupati Kathmandu in Education, Health, Empowerment, and Environment.",
};

export default async function ProjectsPage() {
  let projects: Project[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("active", true)
      .order("date", { ascending: false });

    if (data) projects = data;
  } catch {
    // use empty array
  }

  return <ProjectsContent projects={projects} />;
}
