import type { ImageLoaderProps } from "next/image";

const SUPABASE_PUBLIC = "/storage/v1/object/public/";

export function isSupabasePublic(src: string): boolean {
  return src.includes(".supabase.co") && src.includes(SUPABASE_PUBLIC);
}

/**
 * Resizes via Supabase's own CDN (`render/image`) instead of Next's optimizer.
 * The optimizer has a hardcoded 7s upstream fetch timeout and times out when a
 * grid requests dozens of images at once ("upstream image response timed out").
 */
export function supabaseLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src.replace(SUPABASE_PUBLIC, "/storage/v1/render/image/public/"));
  url.searchParams.set("width", String(width));
  // Supabase needs BOTH dimensions — given width alone it returns a squashed
  // `width x originalHeight` strip. `contain` against a tall height bound fits
  // the image to `width` and keeps its real aspect ratio (never upscales).
  url.searchParams.set("height", String(width * 10));
  url.searchParams.set("resize", "contain");
  url.searchParams.set("quality", String(quality ?? 75));
  return url.toString();
}
