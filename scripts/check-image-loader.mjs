// self-check: loader output must preserve aspect ratio for every srcset width
const SUPABASE_PUBLIC = "/storage/v1/object/public/";
function loader({ src, width, quality }) {
  const url = new URL(src.replace(SUPABASE_PUBLIC, "/storage/v1/render/image/public/"));
  url.searchParams.set("width", String(width));
  url.searchParams.set("height", String(width * 10));
  url.searchParams.set("resize", "contain");
  url.searchParams.set("quality", String(quality ?? 75));
  return url.toString();
}
const src = "https://rvqruudqztawrsbjgkqn.supabase.co/storage/v1/object/public/member-photos/1773295101966-oghma1a3gi.jpg";
const ORIG = 1066 / 1600;
for (const w of [32, 64, 96, 128, 256]) {
  const r = await fetch(loader({ src, width: w }));
  const b = Buffer.from(await r.arrayBuffer());
  // JPEG SOF marker parse
  let i = 2, dims = null;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) { dims = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; break; }
    i += 2 + b.readUInt16BE(i + 2);
  }
  const [W, H] = dims;
  const ok = Math.abs(W / H - ORIG) < 0.02 && W === w;
  console.log(`w=${w} -> ${W}x${H} ratio=${(W/H).toFixed(3)} ${ok ? "OK" : "FAIL"}`);
  if (!ok) process.exitCode = 1;
}
