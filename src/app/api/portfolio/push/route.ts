import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { pushToGitHub } from "@/lib/github/octokit";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.githubUsername) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      files,
      repoName = "portfolio",
      pat, // optional Personal Access Token override
    } = body as {
      files: { path: string; content: string }[];
      repoName?: string;
      pat?: string;
    };

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files to push" }, { status: 400 });
    }

    // Prefer PAT over OAuth token — PAT always has the correct scopes
    const token = (pat?.trim() || session.accessToken);

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token available. Please sign in again." },
        { status: 401 }
      );
    }

    const result = await pushToGitHub(
      token,
      session.githubUsername,
      repoName,
      files
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("GitHub push error:", error);

    let message = "Failed to push to GitHub";
    if (error && typeof error === "object") {
      const err = error as {
        status?: number;
        message?: string;
        response?: { data?: { message?: string } };
      };
      if (err.response?.data?.message) {
        message = `GitHub API: ${err.response.data.message}`;
      } else if (err.message) {
        message = err.message;
      }
      if (err.status === 401) {
        message =
          "GitHub authentication failed (401). Your token may be expired. Try using a Personal Access Token from the deploy page.";
      } else if (err.status === 403) {
        message =
          "Insufficient GitHub permissions (403). Your OAuth token is missing the 'repo' scope. Use a Personal Access Token (PAT) instead — see the deploy page for instructions.";
      } else if (err.status === 404) {
        message =
          "GitHub repository or reference not found (404). Please check the repository name.";
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
