import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Profile = {
  id: string;
  email: string | null;
  username: string | null;
  role: "admin" | "commenter";
};

export async function getCurrentProfile(): Promise<{
  user: { id: string } | null;
  profile: Profile | null;
}> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    return { user: null, profile: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, username, role")
    .eq("id", authData.user.id)
    .single();

  if (profileError) {
    return { user: authData.user, profile: null };
  }

  return { user: authData.user, profile: profile as Profile };
}

export async function requireAdmin(): Promise<{
  userId: string;
  profile: Profile;
}> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, username, role")
    .eq("id", authData!.user!.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/blog");
  }

  return { userId: authData!.user!.id, profile: profile as Profile };
}


