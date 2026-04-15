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

/**
 * POST /api/portfolio/download
 *
 * Accepts PortfolioConfig JSON in the body and returns the generated HTML
 * directly as a file download.  The browser handles the filename natively
 * via the Content-Disposition header — no JS blob/data-URL tricks needed.
 */
export async function POST(request: NextRequest) {
  try {
    let config: PortfolioConfig;

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      // Direct JSON body (fetch API calls)
      config = (await request.json()) as PortfolioConfig;
    } else {
      // Form POST (hidden <form> submit) — config is in the 'config' field
      const form = await request.formData();
      const raw  = form.get("config");
      if (typeof raw !== "string") {
        return NextResponse.json({ error: "Missing config field." }, { status: 400 });
      }
      config = JSON.parse(raw) as PortfolioConfig;
    }

    if (!config?.settings) {
      return NextResponse.json(
        { error: "Invalid portfolio config." },
        { status: 400 }
      );
    }

    const template = config.settings?.activeTemplate ?? "minimalist";

    let html: string;
    switch (template) {
      case "creative":        html = renderCreativeTemplate(config);        break;
      case "data-viz":        html = renderDataVizTemplate(config);         break;
      case "editorial":       html = renderEditorialTemplate(config);       break;
      case "executive":       html = renderExecutiveTemplate(config);       break;
      case "academic":        html = renderAcademicTemplate(config);        break;
      case "space-grotesk":   html = renderSpaceGroteskTemplate(config);    break;
      case "hacker":          html = renderHackerTemplate(config);          break;
      case "portfolio-classic": html = renderPortfolioClassicTemplate(config); break;
      case "framer-minimal":  html = renderFramerMinimalTemplate(config);   break;
      case "minimalist":
      default:                html = renderMinimalistTemplate(config);      break;
    }

    // Build a safe filename from the user's display name
    const safeName = (config.profile.displayName || "portfolio")
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const filename = `${safeName}-portfolio.html`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // 'attachment' forces browser save-as with the filename we choose
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Download generation error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate portfolio: ${message}` },
      { status: 500 }
    );
  }
}
