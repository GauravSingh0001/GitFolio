"use client";

import { useGitHubData } from "@/hooks/use-github-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderGit2, Star, GitFork, Code2 } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error } = useGitHubData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>Failed to load GitHub data. Please try again.</p>
      </div>
    );
  }

  if (!data) return null;

  const totalStars = data.projects.reduce((sum, p) => sum + p.stars, 0);
  const totalForks = data.projects.reduce((sum, p) => sum + p.forks, 0);
  const topLanguages = data.skillCloud.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {data.profile.name || data.profile.login}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your GitHub profile and portfolio data.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Repositories
            </CardTitle>
            <FolderGit2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.projects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Qualifying projects (≥2 commits, no forks)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Stars
            </CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStars}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all repositories
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Forks
            </CardTitle>
            <GitFork className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalForks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Community contributions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Skill Cloud */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Code2 className="w-5 h-5" />
            Skill Cloud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.skillCloud.map((skill) => (
              <Badge
                key={skill.language}
                variant="secondary"
                className="px-3 py-1.5 text-sm gap-2 hover:scale-105 transition-transform cursor-default"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: skill.color }}
                />
                {skill.language}
                <span className="text-muted-foreground text-xs">
                  {skill.percentage}%
                </span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Languages */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Language Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topLanguages.map((lang) => (
              <div key={lang.language} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{lang.language}</span>
                  <span className="text-muted-foreground">
                    {lang.percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
