"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Save, User, Link as LinkIcon } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "LinkedIn", url: "" },
    { platform: "Twitter", url: "" },
  ]);
  const [saved, setSaved] = useState(false);

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  const handleSave = () => {
    // Save to localStorage for now (would be Supabase in production)
    localStorage.setItem(
      "gitfolio-settings",
      JSON.stringify({ bio, socialLinks })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your portfolio&apos;s personal information.
        </p>
      </div>

      {/* Profile */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">GitHub Username</Label>
            <Input
              id="username"
              value={session?.githubUsername || ""}
              disabled
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Tagline</Label>
            <Textarea
              id="bio"
              placeholder="Full-stack developer passionate about open source..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This will appear below your name on your portfolio.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <LinkIcon className="w-5 h-5" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input
                placeholder="Platform (e.g. LinkedIn)"
                value={link.platform}
                onChange={(e) =>
                  updateSocialLink(index, "platform", e.target.value)
                }
                className="w-40"
              />
              <Input
                placeholder="https://..."
                value={link.url}
                onChange={(e) =>
                  updateSocialLink(index, "url", e.target.value)
                }
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeSocialLink(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addSocialLink} className="gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Link
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
        {saved && (
          <Badge variant="secondary" className="text-green-500">
            ✓ Saved
          </Badge>
        )}
      </div>
    </div>
  );
}
