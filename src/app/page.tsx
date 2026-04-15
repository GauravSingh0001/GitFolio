"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GithubIcon as Github } from "@/components/icons/github";

/* ── tiny inline SVG icons to avoid heavy imports ── */
function RocketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
      <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
    </svg>
  );
}

const features = [
  {
    icon: "auto_awesome",
    color: "text-[#aec6ff] bg-[#aec6ff]/10",
    title: "Smart Aggregation",
    desc: "Our engine intelligently scrapes your best work, categorizes languages, and extracts key metrics to tell your developer story — automatically.",
    wide: true,
  },
  {
    icon: "visibility",
    color: "text-[#4edea3] bg-[#4edea3]/10",
    title: "Live Preview",
    desc: "Edit and see changes in real-time. No refresh needed — just instant visual feedback as you type.",
    wide: false,
  },
  {
    icon: "cloud_upload",
    color: "text-[#aec6ff] bg-[#aec6ff]/10",
    title: "One-Click Deploy",
    desc: "Push directly to GitHub Pages, Vercel, or Netlify with a single click from our dashboard.",
    wide: false,
  },
  {
    icon: "dashboard_customize",
    color: "text-[#b9c8de] bg-[#b9c8de]/10",
    title: "Custom Templates",
    desc: "Choose from professionally designed templates ranging from clinical monospace to lush editorial layouts.",
    wide: true,
  },
];

const stats = [
  { value: "12k+", label: "Portfolios Built" },
  { value: "60s", label: "Avg. Build Time" },
  { value: "99%", label: "User Satisfaction" },
  { value: "2.4m", label: "API Calls Monthly" },
];

const footerLinks = {
  Platform: ["Documentation", "Templates", "API Reference"],
  Community: ["GitHub Repo", "Discord Server", "Showcase"],
  Legal: ["Privacy Policy", "Terms of Service"],
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e] text-[#e5e2e1] overflow-x-hidden">
      {/* ── Top Nav ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl border-b border-[#414754]/10 flex justify-between items-center px-8 h-16">
        <div className="font-headline font-black text-xl tracking-tighter">
          GitFolio Engine
        </div>
        <div className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight text-sm">
          {["Features", "Templates", "Pricing"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-[#e5e2e1]/60 hover:text-[#e5e2e1] transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="flex items-center gap-2 bg-[#0070f3] text-white px-4 py-2 rounded-lg font-headline font-bold text-sm hover:bg-[#0070f3]/90 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
        >
          <Github className="w-4 h-4" />
          Sign in with GitHub
        </button>
      </nav>

      {/* ── Hero ── */}
      <main className="pt-32 pb-24">
        <section className="relative container mx-auto px-6 text-center max-w-5xl">
          {/* Ambient glow */}
          <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[600px] glow-primary pointer-events-none" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c1b1b] border border-[#414754]/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            <span className="font-label text-[10px] uppercase tracking-widest text-[#c1c6d7]">
              Live — Production Ready Engine
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-headline font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-6 leading-[1.08]"
          >
            GitFolio Engine
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#c1c6d7] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Generate a production-ready developer portfolio from your GitHub
            profile in under&nbsp;60 seconds.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="flex items-center gap-3 bg-gradient-to-r from-[#aec6ff] to-[#0070f3] text-[#002e6b] px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-[0_0_24px_rgba(174,198,255,0.25)] hover:shadow-[0_0_36px_rgba(174,198,255,0.4)] active:scale-95 transition-all"
            >
              <RocketIcon />
              Start for Free
            </button>
            <Link
              href="#features"
              className="flex items-center gap-2 bg-[#1c1b1b] border border-[#414754]/20 text-[#c1c6d7] px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-[#3a3939] hover:text-[#e5e2e1] active:scale-95 transition-all"
            >
              View Examples
            </Link>
          </motion.div>

          {/* Terminal visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="bg-[#1c1b1b] rounded-xl p-[1px] shadow-2xl border border-[#414754]/10">
              <div className="bg-[#050505] rounded-[10px] overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#2a2a2a]/50 border-b border-[#414754]/10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00a572]/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#aec6ff]/40" />
                  </div>
                  <div className="ml-4 font-label text-[10px] tracking-widest text-[#8b90a0] uppercase flex items-center gap-2">
                    <span className="text-[12px]">⌘</span>
                    portfolio-build-process.sh
                  </div>
                </div>
                {/* Terminal body */}
                <div className="p-6 font-mono text-sm text-left leading-relaxed space-y-2">
                  {[
                    { prefix: "$", prefixColor: "#4edea3", text: "gitfolio login --github" },
                    { prefix: "info", prefixColor: "#aec6ff", text: "Authenticating with GitHub... [OK]" },
                    { prefix: "info", prefixColor: "#aec6ff", text: <>Fetching repos from user: <span className="text-[#4edea3]">@synthetic-arch</span></> },
                    { prefix: "success", prefixColor: "#6ffbbe", text: "Found 42 public repositories. Sorting by stars..." },
                    { prefix: "info", prefixColor: "#aec6ff", text: "Optimizing assets & generating metadata..." },
                    { prefix: "info", prefixColor: "#aec6ff", text: "Deploying to GitHub Pages..." },
                  ].map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <span style={{ color: line.prefixColor }} className="shrink-0">{line.prefix}</span>
                      <span className="text-[#e5e2e1]/80">{line.text}</span>
                    </div>
                  ))}
                  <div className="mt-4 bg-[#4edea3]/10 border border-[#4edea3]/20 p-3 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[#4edea3] animate-pulse">✓</span>
                      <span className="text-[#4edea3] font-bold font-label">Build Complete!</span>
                    </div>
                    <span className="text-[#8b90a0] text-xs font-label">deployed in 42.1s</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Feature Bento Grid ── */}
        <section id="features" className="container mx-auto px-6 mt-32 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-5"
          >
            {/* Card 1 — Large */}
            <div className="md:col-span-8 bg-[#1c1b1b] rounded-2xl p-8 overflow-hidden relative group border border-[#414754]/10 hover:border-[#414754]/30 transition-colors">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#aec6ff]/10 rounded-xl flex items-center justify-center mb-6 text-[#aec6ff] text-2xl">
                  ✦
                </div>
                <h3 className="font-headline font-bold text-2xl text-[#e5e2e1] mb-3">
                  Smart Aggregation
                </h3>
                <p className="text-[#c1c6d7] max-w-md leading-relaxed">
                  Our engine intelligently scrapes your best work, categorizes
                  languages, and extracts key metrics to tell your developer
                  story automatically.
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#aec6ff]/5 rounded-full blur-3xl group-hover:bg-[#aec6ff]/10 transition-colors" />
            </div>

            {/* Card 2 — Small */}
            <div className="md:col-span-4 bg-[#1c1b1b] rounded-2xl p-8 group hover:bg-[#2a2a2a] transition-colors border border-[#414754]/10">
              <div className="w-12 h-12 bg-[#4edea3]/10 rounded-xl flex items-center justify-center mb-6 text-[#4edea3] text-xl">
                ◉
              </div>
              <h3 className="font-headline font-bold text-xl text-[#e5e2e1] mb-3">
                Live Preview
              </h3>
              <p className="text-[#c1c6d7] text-sm leading-relaxed">
                Edit and see changes in real-time. No refresh needed — instant
                visual feedback as you build.
              </p>
            </div>

            {/* Card 3 — Small */}
            <div className="md:col-span-4 bg-[#1c1b1b] rounded-2xl p-8 group hover:bg-[#2a2a2a] transition-colors border border-[#414754]/10">
              <div className="w-12 h-12 bg-[#aec6ff]/10 rounded-xl flex items-center justify-center mb-6 text-[#aec6ff] text-xl">
                ↑
              </div>
              <h3 className="font-headline font-bold text-xl text-[#e5e2e1] mb-3">
                One-Click Deploy
              </h3>
              <p className="text-[#c1c6d7] text-sm leading-relaxed">
                Push directly to GitHub Pages, Vercel, or Netlify with a single
                click from our dashboard.
              </p>
            </div>

            {/* Card 4 — Large */}
            <div className="md:col-span-8 bg-[#1c1b1b] rounded-2xl p-8 overflow-hidden relative group border border-[#414754]/10 hover:border-[#414754]/30 transition-colors">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#b9c8de]/10 rounded-xl flex items-center justify-center mb-6 text-[#b9c8de] text-xl">
                  ⊞
                </div>
                <h3 className="font-headline font-bold text-2xl text-[#e5e2e1] mb-3">
                  Custom Templates
                </h3>
                <p className="text-[#c1c6d7] max-w-md leading-relaxed">
                  Choose from 20+ professionally designed templates ranging from
                  clinical monospace to lush editorial layouts.
                </p>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-20 group-hover:opacity-50 transition-opacity">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-48 h-12 bg-[#2a2a2a] rounded border border-[#414754]/20"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Stats ── */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-6 mt-32 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a2a2a] border border-[#414754]/10 mb-10">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            <span className="font-label text-[10px] uppercase tracking-widest text-[#c1c6d7]">
              Live Performance Engine
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-headline font-extrabold text-4xl text-[#e5e2e1] mb-1">
                  {s.value}
                </div>
                <div className="font-label text-[10px] uppercase tracking-wider text-[#8b90a0]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* ── Site Footer ── */}
      <footer className="bg-[#0e0e0e] pt-20 pb-20 px-8 border-t border-[#414754]/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-xs">
              <div className="font-headline font-black text-2xl tracking-tighter mb-4">
                GitFolio Engine
              </div>
              <p className="text-[#c1c6d7] text-sm leading-relaxed">
                Empowering developers to showcase their craft through automated,
                high-end visual storytelling.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              {Object.entries(footerLinks).map(([cat, links]) => (
                <div key={cat}>
                  <h4 className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0] mb-4">
                    {cat}
                  </h4>
                  <ul className="space-y-2 text-sm text-[#c1c6d7]">
                    {links.map((l) => (
                      <li key={l}>
                        <a href="#" className="hover:text-[#aec6ff] transition-colors">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-[#414754]/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-label text-[#8b90a0] uppercase tracking-widest">
              © 2024 GitFolio Engine. Built for the synthetic architect.
            </div>
            <div className="flex gap-6">
              {["⌘", "</>", "↗"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-[#8b90a0] hover:text-[#e5e2e1] transition-colors text-lg font-bold"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Status Bar ── */}
      <div className="status-bar">
        <div className="flex items-center gap-2 text-[#4edea3] font-label uppercase text-[10px] tracking-widest">
          <span className="animate-pulse">⚡</span>
          API Limit: 4982/5000
        </div>
        <div className="flex items-center gap-2 text-[#e5e2e1]/40 font-label uppercase text-[10px] tracking-widest">
          <span>↺</span>
          Sync: Operational
        </div>
      </div>
    </div>
  );
}
