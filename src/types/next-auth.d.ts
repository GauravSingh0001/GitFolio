import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    githubId: string;
    githubUsername: string;
    avatarUrl: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    githubId?: string;
    githubUsername?: string;
    avatarUrl?: string;
  }
}
