import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 300;

const ORIGIN = "https://pashupati-kathmandu.rotarydistrict3292.org.np";
const CLUB = `${ORIGIN}/club/pashupati-kathmandu`;

// Source site's service areas -> our project category enum.
const CATEGORY_MAP: Record<string, string> = {
  "fighting disease": "Disease Prevention and Treatment",
  "saving mothers and children": "Maternal and Child Health",
  "providing clean water, sanitation, and hygiene": "Water and Sanitation",
  "supporting education": "Basic Education and Literacy",
  "happy school": "Basic Education and Literacy",
  "rotary literacy teach": "Basic Education and Literacy",
  "promoting peace": "Peace and Conflict Prevention",
  "growing local economies": "Economic and Community Development",
};

const MONTHS = ["january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"];

// Honorifics the source site prefixes to names (Rtn., PP, AKS, PHF, Dr. …).
const HONORIFICS = /^(rtn|rtr|pp|pe|pn|ipp|aks|phf|mphf|dr|er|prof|adv|ca|mr|mrs|ms)\.?$/;

const strip = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/** Name minus honorifics, as lowercase alphanumeric tokens. */
function nameTokens(name: string) {
  const parts = name
    .split(/\s+/)
    .map((p) => p.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);
  while (parts.length > 1 && HONORIFICS.test(parts[0])) parts.shift();
  return parts;
}

/** "AKS Sashi Raj Pandey" -> "sashirajpandey". */
const nameKey = (name: string) => nameTokens(name).join("");

function levenshtein(a: string, b: string) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = row;
  }
  return prev[b.length];
}

/**
 * The district site spells names differently to our roster — Banskota/Bansdkota,
 * Pokhrel/Pokherel, "Hark Saud"/"Hark Bahadur Saud". Score 0..1; 1 is exact.
 */
function nameScore(a: string, b: string) {
  const ka = nameKey(a);
  const kb = nameKey(b);
  if (!ka || !kb || ka === kb) return ka && ka === kb ? 1 : 0;
  if (ka[0] !== kb[0]) return 0;

  const ta = new Set(nameTokens(a));
  const tb = new Set(nameTokens(b));
  const subset =
    [...ta].every((t) => tb.has(t)) || [...tb].every((t) => ta.has(t));
  if (subset) return 0.95;

  return 1 - levenshtein(ka, kb) / Math.max(ka.length, kb.length);
}

// Below this, two names are different people. Tuned against the live roster:
// catches every real spelling variant without pairing up distinct members.
const NAME_MATCH_MIN = 0.85;

async function getHtml(url: string) {
  const res = await fetch(url, {
    headers: { "user-agent": "rotary-pashupati-site-sync" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${res.status} on ${url}`);
  return res.text();
}

type Supa = Awaited<ReturnType<typeof createClient>>;

/**
 * Copy a remote image into Supabase Storage so we own it (and it flows through
 * the Supabase image loader). Falls back to the remote URL if anything fails.
 * The source filenames are already unique hashes, so they double as our keys.
 */
async function mirrorImage(supabase: Supa, bucket: string, remote: string) {
  const fileName = `synced/${remote.split("/").pop()!.split("?")[0]}`;
  const { data: existing } = supabase.storage.from(bucket).getPublicUrl(fileName);
  try {
    const res = await fetch(remote, { headers: { "user-agent": "rotary-pashupati-site-sync" } });
    if (!res.ok) return remote;
    const blob = await res.blob();
    const { error } = await supabase.storage.from(bucket).upload(fileName, blob, {
      upsert: true,
      contentType: blob.type || "image/jpeg",
    });
    if (error) return remote;
    return existing.publicUrl;
  } catch {
    return remote;
  }
}

/** "July, 2026-27" -> 2026-07-01 (fiscal year starts in July). */
function toDate(month: string, fiscalYear: string): string | null {
  const m = MONTHS.indexOf(month.trim().toLowerCase());
  const start = Number(fiscalYear.split("-")[0]);
  if (m < 0 || !start) return null;
  const year = m >= 6 ? start : start + 1;
  return `${year}-${String(m + 1).padStart(2, "0")}-01`;
}

function field(html: string, label: string) {
  const m = html.match(new RegExp(`<strong>${label}:</strong>([^<]*)`, "i"));
  return m ? strip(m[1]) : null;
}

async function scrapeProjects(supabase: Supa) {
  const index = await getHtml(`${CLUB}/services`);
  const categoryIds = [...new Set([...index.matchAll(/\/services\/(\d+)\?/g)].map((m) => m[1]))];

  const detailUrls = new Set<string>();
  for (const id of categoryIds) {
    const page = await getHtml(`${CLUB}/services/${id}`);
    for (const m of page.matchAll(/\/club\/pashupati-kathmandu\/service\/(\d+)/g)) {
      detailUrls.add(`${CLUB}/service/${m[1]}`);
    }
  }

  const projects = [];
  for (const url of detailUrls) {
    const html = await getHtml(url);
    const title = strip(html.match(/<h1 class="card-title[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");
    if (!title) continue;

    const sourceCategory = strip(
      html.match(/<span class="badge bg-primary fs-6 mb-3">([\s\S]*?)<\/span>/)?.[1] ?? ""
    );
    const description = strip(
      html.match(/<div class="description-content[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? ""
    );
    const remoteImage =
      html.match(/<img src="([^"]+)"\s*\n?\s*id="mainProjectImage"/)?.[1] ?? null;
    const image = remoteImage ? await mirrorImage(supabase, "project-images", remoteImage) : null;
    const beneficiaries = field(html, "Beneficiaries");
    const dateLabel = field(html, "Date") ?? "";
    const [month, fiscalYear] = dateLabel.split(",").map((s) => s.trim());

    projects.push({
      source_url: url,
      title,
      description: description || null,
      category: CATEGORY_MAP[sourceCategory.toLowerCase()] ?? "Others",
      image_url: image,
      date: month && fiscalYear ? toDate(month, fiscalYear) : null,
      impact_metric: beneficiaries ? `${beneficiaries} beneficiaries` : null,
      active: true,
      updated_at: new Date().toISOString(),
    });
  }
  return projects;
}

async function scrapeMembers() {
  const html = await getHtml(`${CLUB}/members`);
  const cards = html.matchAll(
    /data-member-name="([^"]*)"[\s\S]{0,400}?data-member-image="([^"]*)"/g
  );
  const seen = new Set<string>();
  const members = [];
  for (const [, rawName, image] of cards) {
    const name = strip(rawName);
    const key = nameKey(name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    members.push({ name, photo_url: image || null });
  }
  return members;
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  try {
    const [projects, scraped] = await Promise.all([scrapeProjects(supabase), scrapeMembers()]);

    // Projects: upsert on source_url so re-running updates instead of duplicating.
    if (projects.length) {
      const { error } = await supabase
        .from("projects")
        .upsert(projects, { onConflict: "source_url" });
      if (error) throw new Error(`projects: ${error.message}`);
    }

    // Members: only fill in photos for people we already have, and add anyone missing.
    // Roles, ordering and board/member split stay as curated in the admin panel.
    const { data: existing } = await supabase.from("members").select("id,name,photo_url");
    const roster = existing ?? [];

    let photosAdded = 0;
    const newMembers = [];
    for (const m of scraped) {
      let match: (typeof roster)[number] | undefined;
      let best = 0;
      for (const candidate of roster) {
        const score = nameScore(m.name, candidate.name);
        if (score > best) { best = score; match = candidate; }
      }
      if (best < NAME_MATCH_MIN) match = undefined;
      const sourceFile = m.photo_url?.split("/").pop()?.split("?")[0];
      const alreadyHave = !!sourceFile && !!match?.photo_url?.includes(sourceFile);
      const photo = m.photo_url && !alreadyHave
        ? await mirrorImage(supabase, "member-photos", m.photo_url)
        : match?.photo_url ?? null;

      if (!match) {
        newMembers.push({
          name: m.name,
          type: "member",
          photo_url: photo,
          active: true,
          order_index: 999,
        });
      } else if (photo && photo !== match.photo_url) {
        const { error } = await supabase
          .from("members")
          .update({ photo_url: photo, updated_at: new Date().toISOString() })
          .eq("id", match.id);
        if (!error) photosAdded++;
      }
    }
    if (newMembers.length) {
      const { error } = await supabase.from("members").insert(newMembers);
      if (error) throw new Error(`members: ${error.message}`);
    }

    return NextResponse.json({
      projects: projects.length,
      photosUpdated: photosAdded,
      membersAdded: newMembers.length,
    });
  } catch (e) {
    console.error("Sync failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sync failed" },
      { status: 500 }
    );
  }
}
