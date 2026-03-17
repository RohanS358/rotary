import { createClient } from "@/lib/supabase/server";
import ProjectsGrid from "./ProjectsGrid";
import type { Project } from "@/lib/types";

const FALLBACK_PROJECTS: Partial<Project>[] = [
  {
    id: "1",
    title: "Wheelchair Distribution",
    description:
      "Distributed wheelchairs to differently-abled individuals at Budhanilkantha Hospital, restoring mobility and independence.",
    category: "Disease Prevention and Treatment",
    image_url: null,
    date: "2023-07-07",
    impact_metric: "50+ beneficiaries",
  },
  {
    id: "2",
    title: "Rotary Prahari Batika",
    description:
      "Environmental initiative establishing community gardens and green spaces across Kathmandu to combat urban heat.",
    category: "Economic and Community Development",
    image_url: null,
    date: "2023-05-01",
    impact_metric: "5 gardens planted",
  },
  {
    id: "3",
    title: "SOCHKO PARIBARTAN",
    description:
      "Basic literacy month initiative empowering underprivileged women and children with foundational education skills.",
    category: "Basic Education and Literacy",
    image_url: null,
    date: "2023-09-01",
    impact_metric: "200+ students",
  },
];

export default async function FeaturedProjects() {
  let projects: Partial<Project>[] = FALLBACK_PROJECTS;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("active", true)
      .eq("featured", true)
      .order("date", { ascending: false })
      .limit(6);

    if (data && data.length > 0) {
      projects = data;
    }
  } catch {
    // Use fallback data if Supabase not configured
  }

  return <ProjectsGrid projects={projects} />;
}
