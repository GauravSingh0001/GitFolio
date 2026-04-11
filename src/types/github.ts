/** GitHub repository as returned from our GraphQL query */
export interface GitHubRepo {
  id: string;
  name: string;
  url: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  languages: {
    edges: Array<{
      size: number;
      node: {
        name: string;
        color: string;
      };
    }>;
  };
  defaultBranchRef: {
    target: {
      history: {
        totalCount: number;
      };
    };
  } | null;
  object: {
    text: string;
  } | null;
}

/** GitHub viewer profile */
export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
}

/** Processed repo ready for portfolio display */
export interface PortfolioProject {
  id: string;
  name: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  primaryLanguage: string | null;
  primaryLanguageColor: string | null;
  languages: Array<{
    name: string;
    color: string;
    percentage: number;
  }>;
  commitCount: number;
  readmeContent: string | null;
  isPinned: boolean;
  displayOrder: number;
}

/** Skill Cloud entry */
export interface SkillCloudEntry {
  language: string;
  color: string;
  totalBytes: number;
  percentage: number;
}

/** Full GraphQL response shape */
export interface GitHubGraphQLResponse {
  viewer: GitHubProfile & {
    repositories: {
      nodes: GitHubRepo[];
    };
  };
}
