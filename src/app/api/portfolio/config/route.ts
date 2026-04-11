import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createClient } from "@supabase/supabase-js";
import type { PortfolioConfig } from "@/types/portfolio";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Service role key gives us server-side access bypassing RLS
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.githubUsername) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("portfolio_configs")
    .select("config")
    .eq("user_id", session.githubUsername)
    .single();

  if (error) {
    // Not found is OK — user hasn't saved yet
    if (error.code === "PGRST116") {
      return NextResponse.json({ config: null });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ config: data.config as PortfolioConfig });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.githubUsername) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = (await request.json()) as PortfolioConfig;
    const supabase = getServiceClient();

    const { error } = await supabase.from("portfolio_configs").upsert(
      {
        user_id: session.githubUsername,
        config,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Config save error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
