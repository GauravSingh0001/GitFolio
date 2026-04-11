"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { GitHubGraphQLResponse, PortfolioProject, SkillCloudEntry } from "@/types/github";

async function fetchGitHubData(accessToken: string) {
  const res = await fetch("/api/github/repos", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch GitHub data");
  return res.json() as Promise<{
    profile: GitHubGraphQLResponse["viewer"];
    projects: PortfolioProject[];
    skillCloud: SkillCloudEntry[];
  }>;
}

export function useGitHubData() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["github-data", session?.githubUsername],
    queryFn: () => fetchGitHubData(session!.accessToken),
    enabled: !!session?.accessToken,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}
