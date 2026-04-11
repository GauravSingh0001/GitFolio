import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { githubGraphQL, USER_REPOS_QUERY } from "@/lib/github/graphql";
import { filterRepos, transformRepos, calculateSkillCloud } from "@/lib/github/transforms";
import type { GitHubGraphQLResponse } from "@/types/github";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await githubGraphQL<GitHubGraphQLResponse>(
      session.accessToken,
      USER_REPOS_QUERY,
      { first: 50 }
    );

    const filteredRepos = filterRepos(data.viewer.repositories.nodes);
    const projects = transformRepos(filteredRepos);
    const skillCloud = calculateSkillCloud(filteredRepos);

    const profile = {
      login: data.viewer.login,
      name: data.viewer.name,
      avatarUrl: data.viewer.avatarUrl,
      bio: data.viewer.bio,
    };

    return NextResponse.json({ profile, projects, skillCloud });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
