"use client";

import { signIn } from "next-auth/react";
import { Zap } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background" />
      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Welcome to GitFolio</CardTitle>
          <CardDescription>
            Sign in with your GitHub account to generate your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full gap-2 h-12 text-base bg-[#24292f] hover:bg-[#24292f]/90 text-white"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-4">
            We only request read access to your public profile and repositories.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
