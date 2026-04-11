import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
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

// Always return JSON — never redirect to login page for API routes.
// This prevents "Unexpected token '<'" errors on the client.
export async function POST(request: NextRequest) {
  try {
    // auth() reads the session cookie — works in production when AUTH_URL is set
    const session = await auth();

    if (!session?.accessToken) {
      // Return JSON 401, NOT a redirect to /login
      return NextResponse.json(
        { error: "Unauthorized — please sign in again." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const config = body as PortfolioConfig;

    if (!config || typeof config !== "object") {
      return NextResponse.json(
        { error: "Invalid portfolio config" },
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

    const files = [{ path: "index.html", content: html }];
    return NextResponse.json({ files });
  } catch (error) {
    // Log full error server-side, return a clean JSON message to client
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown generation error";
    return NextResponse.json(
      { error: `Failed to generate portfolio: ${message}` },
      { status: 500 }
    );
  }
}
