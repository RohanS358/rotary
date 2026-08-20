// self-check: the district site still has the markup /api/admin/sync parses.
// Run with: node scripts/check-sync-scrape.mjs
import assert from "node:assert/strict";

const CLUB = "https://pashupati-kathmandu.rotarydistrict3292.org.np/club/pashupati-kathmandu";
const get = async (u) => {
  const r = await fetch(u, { headers: { "user-agent": "rotary-pashupati-site-sync" } });
  assert.ok(r.ok, `${r.status} on ${u}`);
  return r.text();
};

const index = await get(`${CLUB}/services`);
const categories = [...new Set([...index.matchAll(/\/services\/(\d+)\?/g)].map((m) => m[1]))];
assert.ok(categories.length > 0, "no service categories found on /services");

const first = await get(`${CLUB}/services/${categories[0]}`);
const ids = [...new Set([...first.matchAll(/\/club\/pashupati-kathmandu\/service\/(\d+)/g)].map((m) => m[1]))];
assert.ok(ids.length > 0, `no project links in category ${categories[0]}`);

const detail = await get(`${CLUB}/service/${ids[0]}`);
assert.ok(/<h1 class="card-title[^>]*>([\s\S]*?)<\/h1>/.test(detail), "no project title");
assert.ok(/<div class="description-content[^>]*>/.test(detail), "no description block");
assert.ok(/<strong>Date:<\/strong>/.test(detail), "no Date field");
assert.ok(/<img src="([^"]+)"\s*\n?\s*id="mainProjectImage"/.test(detail), "no main image");

const members = await get(`${CLUB}/members`);
const cards = [...members.matchAll(/data-member-name="([^"]*)"[\s\S]{0,400}?data-member-image="([^"]*)"/g)];
assert.ok(cards.length > 0, "no member cards");
assert.ok(cards.some(([, , img]) => img), "no member photos");

console.log(`ok — ${categories.length} categories, ${ids.length} projects in the first one, ${cards.length} member card matches`);
