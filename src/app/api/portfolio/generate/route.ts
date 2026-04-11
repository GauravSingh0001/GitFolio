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

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const config = body as PortfolioConfig;

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
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate portfolio" },
      { status: 500 }
    );
  }
}
