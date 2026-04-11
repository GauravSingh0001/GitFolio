import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          // repo scope is required to push files and create repositories.
          // prompt:"consent" forces GitHub to always re-issue a fresh token
          // with ALL requested scopes (prevents stale cached tokens missing repo).
          scope: "read:user user:email repo",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the GitHub access token and profile data into the JWT
      if (account) {
        token.accessToken = account.access_token;
        token.githubId = profile?.id?.toString();
        token.githubUsername = profile?.login;
        token.avatarUrl = profile?.avatar_url;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose GitHub data to the client session
      session.accessToken = token.accessToken as string;
      session.githubId = token.githubId as string;
      session.githubUsername = token.githubUsername as string;
      session.avatarUrl = token.avatarUrl as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
