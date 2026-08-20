"use client";

import NextImage, { type ImageProps } from "next/image";
import { isSupabasePublic, supabaseLoader } from "@/lib/imageLoader";

/**
 * Drop-in next/image that routes Supabase Storage URLs through Supabase's CDN
 * transformer and leaves everything else on Next's optimizer.
 */
export default function SmartImage(props: ImageProps) {
  const useSupabase = typeof props.src === "string" && isSupabasePublic(props.src);
  return <NextImage {...props} loader={useSupabase ? supabaseLoader : props.loader} />;
}
