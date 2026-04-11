const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export async function githubGraphQL<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub GraphQL error: ${response.status} ${response.statusText}`
    );
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(
      `GitHub GraphQL query error: ${json.errors
        .map((e: { message: string }) => e.message)
        .join(", ")}`
    );
  }

  return json.data as T;
}

// ─── GraphQL Queries ───

export const USER_REPOS_QUERY = `
  query GetUserRepos($first: Int!) {
    viewer {
      login
      name
      avatarUrl
      bio
      repositories(
        first: $first
        ownerAffiliations: OWNER
        isFork: false
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        nodes {
          id
          name
          url
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
          object(expression: "HEAD:README.md") {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
`;
