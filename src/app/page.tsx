"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Zap, Palette, Download, ArrowRight } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">GitFolio</span>
        </div>
        <Button
          variant="outline"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="gap-2"
        >
          <Github className="w-4 h-4" />
          Sign in with GitHub
        </Button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-muted/50 text-sm text-muted-foreground mb-8">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Portfolio in 60 seconds
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Your GitHub.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Portfolio.
            </span>
            <br />
            Zero effort.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Connect your GitHub, pick a theme, and deploy a stunning developer
            portfolio — all in under a minute. No code required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 px-8 h-12 text-base"
            >
              <Github className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 max-w-3xl mx-auto"
          >
            {[
              {
                icon: Github,
                title: "GitHub Sync",
                desc: "Auto-fetch repos, languages, and contributions",
              },
              {
                icon: Palette,
                title: "Beautiful Themes",
                desc: "Minimalist, Cyberpunk, or Classic Resume styles",
              },
              {
                icon: Download,
                title: "One-Click Deploy",
                desc: "Push to GitHub Pages or download as ZIP",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-blue-500/30 hover:bg-card/80 transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Built with ❤️ using Next.js, Supabase & GitHub API
      </footer>
    </div>
  );
}
