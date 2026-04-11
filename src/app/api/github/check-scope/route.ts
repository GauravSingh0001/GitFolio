import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

/**
 * GET /api/github/check-scope
 * Calls the GitHub API and reads X-OAuth-Scopes from the response header
 * to tell the client exactly which scopes the current token has.
 */
export async function GET(_req: NextRequest) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const scopeHeader = res.headers.get("x-oauth-scopes") ?? "";
    const scopes = scopeHeader
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const hasRepo =
      scopes.includes("repo") ||
      scopes.includes("public_repo");

    return NextResponse.json({ scopes, hasRepo });
  } catch (err) {
    console.error("Scope check error:", err);
    return NextResponse.json(
      { error: "Failed to check token scopes" },
      { status: 500 }
    );
  }
}
