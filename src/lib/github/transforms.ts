import type { GitHubRepo, PortfolioProject, SkillCloudEntry } from "@/types/github";

/**
 * Filter repos: exclude forks (already handled in GraphQL) and repos with < 2 commits.
 */
export function filterRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return repos.filter((repo) => {
    const commitCount =
      repo.defaultBranchRef?.target?.history?.totalCount ?? 0;
    return commitCount >= 2;
  });
}

/**
 * Transform raw GitHub repos into portfolio-ready project objects.
 */
export function transformRepos(repos: GitHubRepo[]): PortfolioProject[] {
  return repos.map((repo, index) => {
    const totalLangBytes = repo.languages.edges.reduce(
      (sum, edge) => sum + edge.size,
      0
    );

    return {
      id: repo.id,
      name: repo.name,
      url: repo.url,
      description: repo.description,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      primaryLanguage: repo.primaryLanguage?.name ?? null,
      primaryLanguageColor: repo.primaryLanguage?.color ?? null,
      languages: repo.languages.edges.map((edge) => ({
        name: edge.node.name,
        color: edge.node.color,
        percentage:
          totalLangBytes > 0
            ? Math.round((edge.size / totalLangBytes) * 100)
            : 0,
      })),
      commitCount:
        repo.defaultBranchRef?.target?.history?.totalCount ?? 0,
      readmeContent: repo.object?.text ?? null,
      isPinned: false,
      displayOrder: index,
    };
  });
}

/**
 * Calculate the Skill Cloud: aggregate language usage across all repos,
 * weighted by byte-size.
 */
export function calculateSkillCloud(repos: GitHubRepo[]): SkillCloudEntry[] {
  const languageMap = new Map<
    string,
    { color: string; totalBytes: number }
  >();

  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const existing = languageMap.get(edge.node.name);
      if (existing) {
        existing.totalBytes += edge.size;
      } else {
        languageMap.set(edge.node.name, {
          color: edge.node.color,
          totalBytes: edge.size,
        });
      }
    }
  }

  const totalBytes = Array.from(languageMap.values()).reduce(
    (sum, lang) => sum + lang.totalBytes,
    0
  );

  return Array.from(languageMap.entries())
    .map(([language, data]) => ({
      language,
      color: data.color,
      totalBytes: data.totalBytes,
      percentage:
        totalBytes > 0
          ? Math.round((data.totalBytes / totalBytes) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => b.totalBytes - a.totalBytes);
}
