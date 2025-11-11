import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  // Get the origin from the request headers
  const headersList = await headers();
  const host = headersList.get("host");
  const forwardedProto = headersList.get("x-forwarded-proto");
  const protocol = forwardedProto ?? (host && host.includes("localhost") ? "http" : "https");
  const origin = host ? `${protocol}://${host}` : getSiteUrl();
  
  return NextResponse.redirect(new URL("/blog", origin));
}


