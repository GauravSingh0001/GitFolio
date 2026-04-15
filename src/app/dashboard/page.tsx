"use client";

import { useGitHubData } from "@/hooks/use-github-data";
import Link from "next/link";
import {
  FolderGit2,
  Star,
  GitFork,
  Code2,
  ArrowRight,
  Rocket,
  PenSquare,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  sub: string;
}) {
  return (
    <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-5 hover:border-[#414754]/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
          {label}
        </span>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="font-headline font-extrabold text-3xl text-[#e5e2e1] mb-1">
        {value}
      </div>
      <p className="text-[11px] text-[#8b90a0] font-label">{sub}</p>
    </div>
  );
}

function QuickActionCard({
  href,
  icon: Icon,
  title,
  desc,
  accent,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-5 hover:border-[#414754]/40 hover:bg-[#201f1f] transition-all"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-headline font-bold text-sm text-[#e5e2e1]">{title}</p>
        <p className="text-xs text-[#8b90a0] mt-0.5">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-[#414754] group-hover:text-[#aec6ff] group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error } = useGitHubData();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 w-64 bg-[#1c1b1b] rounded-lg mb-2" />
          <div className="h-4 w-96 bg-[#1c1b1b] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[#1c1b1b] rounded-xl" />
          ))}
        </div>
        <div className="h-48 bg-[#1c1b1b] rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#ffb4ab]/10 flex items-center justify-center mb-4 text-[#ffb4ab] text-2xl">
          ✕
        </div>
        <p className="font-headline font-bold text-lg text-[#e5e2e1] mb-2">
          Failed to load GitHub data
        </p>
        <p className="text-sm text-[#8b90a0]">Please refresh and try again.</p>
      </div>
    );
  }

  if (!data) return null;

  const totalStars = data.projects.reduce((sum, p) => sum + p.stars, 0);
  const totalForks = data.projects.reduce((sum, p) => sum + p.forks, 0);
  const topLanguages = data.skillCloud.slice(0, 6);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
          <span className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0]">
            Workspace · GitHub Synced
          </span>
        </div>
        <h1 className="font-headline font-extrabold text-3xl tracking-tight text-[#e5e2e1]">
          Welcome back,{" "}
          <span className="text-[#aec6ff]">
            {data.profile.name || data.profile.login}
          </span>
        </h1>
        <p className="text-[#8b90a0] mt-1 text-sm">
          Here&apos;s an overview of your GitHub profile and portfolio data.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Repositories"
          value={data.projects.length}
          icon={FolderGit2}
          iconColor="text-[#aec6ff]"
          sub="Qualifying projects (≥2 commits, no forks)"
        />
        <StatCard
          label="Total Stars"
          value={totalStars}
          icon={Star}
          iconColor="text-amber-400"
          sub="Across all repositories"
        />
        <StatCard
          label="Total Forks"
          value={totalForks}
          icon={GitFork}
          iconColor="text-[#4edea3]"
          sub="Community contributions"
        />
      </div>

      {/* ── Language Breakdown ── */}
      <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Code2 className="w-5 h-5 text-[#aec6ff]" />
          <h2 className="font-headline font-bold text-lg text-[#e5e2e1]">
            Language Breakdown
          </h2>
        </div>

        {/* Language bars */}
        <div className="space-y-3 mb-6">
          {topLanguages.map((lang) => (
            <div key={lang.language}>
              <div className="flex justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-medium text-[#e5e2e1]">
                    {lang.language}
                  </span>
                </div>
                <span className="text-[#8b90a0] font-label">
                  {lang.percentage}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#2a2a2a] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-2">
          {data.skillCloud.map((skill) => (
            <div
              key={skill.language}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201f1f] border border-[#414754]/20 text-xs font-label hover:border-[#414754]/50 transition-colors cursor-default"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: skill.color }}
              />
              <span className="text-[#c1c6d7]">{skill.language}</span>
              <span className="text-[#8b90a0]">{skill.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2-Step Workflow ── */}
      <div>
        <div className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0] mb-4">
          Your workflow — 2 steps to publish
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1 */}
          <Link
            href="/dashboard/editor"
            className="group relative flex items-start gap-4 bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-5 hover:border-[#aec6ff]/30 hover:bg-[#201f1f] transition-all overflow-hidden"
          >
            <div className="absolute top-4 right-4 font-label text-[9px] uppercase tracking-widest text-[#aec6ff]/40">
              Step 1
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#aec6ff]/10 flex items-center justify-center shrink-0 mt-0.5">
              <PenSquare className="w-5 h-5 text-[#aec6ff]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-headline font-bold text-base text-[#e5e2e1]">Build</p>
              <p className="text-xs text-[#8b90a0] mt-1 leading-relaxed">
                Edit your profile, skills, projects, experience, and contact info — all in one page.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#414754] group-hover:text-[#aec6ff] group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
          </Link>

          {/* Step 2 */}
          <Link
            href="/dashboard/launch"
            className="group relative flex items-start gap-4 bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-5 hover:border-[#4edea3]/30 hover:bg-[#201f1f] transition-all overflow-hidden"
          >
            <div className="absolute top-4 right-4 font-label text-[9px] uppercase tracking-widest text-[#4edea3]/40">
              Step 2
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#4edea3]/10 flex items-center justify-center shrink-0 mt-0.5">
              <Rocket className="w-5 h-5 text-[#4edea3]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-headline font-bold text-base text-[#e5e2e1]">Launch</p>
              <p className="text-xs text-[#8b90a0] mt-1 leading-relaxed">
                Pick a template, preview live, then download your static site ZIP in one click.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#414754] group-hover:text-[#4edea3] group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
          </Link>
        </div>
      </div>
    </div>
  );
}
