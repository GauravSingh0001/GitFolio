import { NextRequest, NextResponse } from "next/server";
import { renderMinimalistTemplate } from "@/lib/templates/minimalist";
import { renderCreativeTemplate } from "@/lib/templates/creative";
import { renderDataVizTemplate } from "@/lib/templates/data-viz";
import { renderEditorialTemplate } from "@/lib/templates/editorial";
import { renderExecutiveTemplate } from "@/lib/templates/executive";
import { renderAcademicTemplate } from "@/lib/templates/academic";
import { renderSpaceGroteskTemplate } from "@/lib/templates/space-grotesk";
import { renderHackerTemplate } from "@/lib/templates/hacker";
import { renderPortfolioClassicTemplate } from "@/lib/templates/portfolio-classic";
import { renderFramerMinimalTemplate } from "@/lib/templates/framer-minimal";
import type { PortfolioConfig } from "@/types/portfolio";

// ─── Why no auth() check here? ───────────────────────────────────────────────
// This route is a pure rendering function: it takes a PortfolioConfig and
// returns generated HTML. It accesses NO sensitive data (no GitHub API,
// no database). The dashboard is already protected at the proxy layer
// (src/proxy.ts) — only authenticated users can reach /dashboard/* routes.
//
// Adding auth() here caused production failures because Auth.js requires
// AUTH_URL to be set (a Vercel env var), and when missing, auth() would
// redirect to /login returning HTML, which crashed the client with:
//   "Unexpected token '<', '<!DOCTYPE...' is not valid JSON"
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = body as PortfolioConfig;

    if (!config || typeof config !== "object" || !config.settings) {
      return NextResponse.json(
        { error: "Invalid portfolio config — missing settings." },
        { status: 400 }
      );
    }

    const template = config.settings?.activeTemplate || "minimalist";
    let html: string;

    switch (template) {
      case "creative":
        html = renderCreativeTemplate(config);
        break;
      case "data-viz":
        html = renderDataVizTemplate(config);
        break;
      case "editorial":
        html = renderEditorialTemplate(config);
        break;
      case "executive":
        html = renderExecutiveTemplate(config);
        break;
      case "academic":
        html = renderAcademicTemplate(config);
        break;
      case "space-grotesk":
        html = renderSpaceGroteskTemplate(config);
        break;
      case "hacker":
        html = renderHackerTemplate(config);
        break;
      case "portfolio-classic":
        html = renderPortfolioClassicTemplate(config);
        break;
      case "framer-minimal":
        html = renderFramerMinimalTemplate(config);
        break;
      case "minimalist":
      default:
        html = renderMinimalistTemplate(config);
        break;
    }

    return NextResponse.json({ files: [{ path: "index.html", content: html }] });
  } catch (error) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown generation error";
    return NextResponse.json(
      { error: `Failed to generate portfolio: ${message}` },
      { status: 500 }
    );
  }
}
