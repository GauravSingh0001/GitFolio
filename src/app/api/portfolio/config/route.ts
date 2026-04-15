import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { PortfolioConfig } from "@/types/portfolio";

/**
 * When SUPABASE_SERVICE_ROLE_KEY is set, the client bypasses RLS entirely.
 * Without it we fall back to the anon key and must satisfy the RLS policy
 * via a separate SET LOCAL call before queries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getServiceClient(): SupabaseClient<any> {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * When using the anon key (no service role), we need to set the
 * app.github_username session config that the RLS policy checks.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function setRlsContext(supabase: SupabaseClient<any>, username: string) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.rpc as any)("set_config", {
      setting_name: "app.github_username",
      setting_value: username,
      is_local: true,
    });
  } catch {
    // Non-fatal
  }
}

export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.githubUsername) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  await setRlsContext(supabase, session.githubUsername);

  const { data, error } = await supabase
    .from("portfolio_configs")
    .select("config")
    .eq("user_id", session.githubUsername)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ config: null });
    }
    console.error("Config GET error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ config: data.config as PortfolioConfig });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.githubUsername) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let config: PortfolioConfig;
  try {
    config = (await request.json()) as PortfolioConfig;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const supabase = getServiceClient();
  await setRlsContext(supabase, session.githubUsername);

  const { error } = await supabase.from("portfolio_configs").upsert(
    {
      user_id: session.githubUsername,
      config,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Config POST upsert error:", error.message, error.code);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
