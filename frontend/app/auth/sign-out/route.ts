import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  // Get the origin from the request headers
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;
  
  return NextResponse.redirect(new URL("/blog", origin));
}


