"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Wrench, FolderGit2, Briefcase, Mail, Save, Plus, X,
  ExternalLink, ChevronDown, ChevronUp, CheckCircle2, AlertCircle
} from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import { usePortfolioConfig } from "@/hooks/use-portfolio-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { SkillEntry, ProjectEntry, ExperienceEntry } from "@/types/portfolio";

type Tab = "profile" | "skills" | "projects" | "experience" | "contact";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile",    label: "Profile",    icon: User },
  { id: "skills",     label: "Skills",     icon: Wrench },
  { id: "projects",   label: "Projects",   icon: FolderGit2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "contact",    label: "Contact",    icon: Mail },
];

const SKILL_CATEGORIES = ["Frontend", "Backend", "Tools", "Design", "Languages", "Cloud", "Mobile", "Other"];

export default function EditorPage() {
  const { config, patch, save, isSaving, saveStatus, isDirty } = usePortfolioConfig();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const handleForceSave = async () => {
    await save();
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Loading your portfolio data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Editor</h1>
          <p className="text-muted-foreground mt-1">
            Changes are saved automatically as you type.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Inline status label (supplements the global top bar indicator) */}
          {isDirty && saveStatus === "idle" && (
            <span className="text-xs text-amber-500">Unsaved changes</span>
          )}
          {saveStatus === "saving" && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Saving…
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Save failed
            </span>
          )}
          <Button
            onClick={handleForceSave}
            disabled={isSaving}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save now
          </Button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-border/50 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "profile" && (
            <ProfileTab config={config} patch={patch} />
          )}
          {activeTab === "skills" && (
            <SkillsTab config={config} patch={patch} />
          )}
          {activeTab === "projects" && (
            <ProjectsTab config={config} patch={patch} />
          )}
          {activeTab === "experience" && (
            <ExperienceTab config={config} patch={patch} />
          )}
          {activeTab === "contact" && (
            <ContactTab config={config} patch={patch} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────
   PROFILE TAB
───────────────────────────────────────────────────────────── */
function ProfileTab({ config, patch }: { config: any; patch: any }) {
  const p = config.profile;

  const update = (field: string, value: string) =>
    patch("profile", { ...p, [field]: value });

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={p.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                placeholder="Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={p.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Full-Stack Developer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Tagline</Label>
            <Textarea
              id="bio"
              value={p.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={3}
              placeholder="Short description that appears below your name…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Goals / Personal Statement</Label>
            <Textarea
              id="goals"
              value={p.goals || ""}
              onChange={(e) => update("goals", e.target.value)}
              rows={2}
              placeholder="What drives you? What are you working towards?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Profile Image URL</Label>
            <Input
              id="avatarUrl"
              value={p.avatarUrl || ""}
              onChange={(e) => update("avatarUrl", e.target.value)}
              placeholder="https://example.com/photo.jpg (leave blank to use GitHub avatar)"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to automatically use your GitHub profile picture.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SKILLS TAB
───────────────────────────────────────────────────────────── */
function SkillsTab({ config, patch }: { config: any; patch: any }) {
  const skills: SkillEntry[] = config.skills;

  const addSkill = () => {
    const newSkill: SkillEntry = {
      id: Date.now().toString(),
      name: "",
      category: "Frontend",
      level: 70,
      color: "#64748b",
    };
    patch("skills", [...skills, newSkill]);
  };

  const updateSkill = (id: string, field: keyof SkillEntry, value: string | number) => {
    patch("skills", skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeSkill = (id: string) => {
    patch("skills", skills.filter((s) => s.id !== id));
  };

  const skillsByCategory = skills.reduce<Record<string, SkillEntry[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="w-4 h-4" /> Skills ({skills.length})
          </CardTitle>
          <Button size="sm" variant="outline" onClick={addSkill} className="gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Skill
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {skills.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No skills yet. Click "+ Add Skill" to start.
            </p>
          )}
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="grid grid-cols-[1fr_1fr_100px_40px_32px] gap-2 items-center"
            >
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                placeholder="Skill name"
              />
              <select
                value={skill.category}
                onChange={(e) => updateSkill(skill.id, "category", e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, "level", Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-xs text-muted-foreground w-8 text-right">{skill.level}%</span>
              </div>
              <input
                type="color"
                value={skill.color || "#64748b"}
                onChange={(e) => updateSkill(skill.id, "color", e.target.value)}
                className="h-10 w-10 rounded border border-input cursor-pointer p-1 bg-background"
                title="Skill color"
              />
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeSkill(skill.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview by category */}
      <Card className="border-border/50 bg-card/30">
        <CardHeader>
          <CardTitle className="text-base">Preview by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(skillsByCategory).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <Badge
                      key={s.id}
                      variant="secondary"
                      className="gap-1.5"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: s.color || "#64748b" }}
                      />
                      {s.name || "…"}
                      <span className="text-muted-foreground text-xs">{s.level}%</span>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROJECTS TAB
───────────────────────────────────────────────────────────── */
function ProjectsTab({ config, patch }: { config: any; patch: any }) {
  const projects: ProjectEntry[] = config.projects;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addProject = () => {
    const newProject: ProjectEntry = {
      id: Date.now().toString(),
      name: "New Project",
      description: "",
      techStack: [],
      liveUrl: "",
      githubUrl: "",
      imageUrl: "",
      featured: false,
      displayOrder: projects.length,
    };
    patch("projects", [...projects, newProject]);
    setExpandedId(newProject.id);
  };

  const updateProject = (id: string, field: keyof ProjectEntry, value: unknown) => {
    patch("projects", projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeProject = (id: string) => {
    patch("projects", projects.filter((p) => p.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{projects.length} projects</p>
        <Button size="sm" variant="outline" onClick={addProject} className="gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Project
        </Button>
      </div>

      {projects.length === 0 && (
        <Card className="border-border/50 bg-card/30">
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No projects yet. Your GitHub projects are auto-imported — click "+ Add Project" to add more.
          </CardContent>
        </Card>
      )}

      {projects.map((proj) => (
        <Card key={proj.id} className="border-border/50 bg-card/50">
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between"
            onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
          >
            <div className="flex items-center gap-3">
              <FolderGit2 className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">{proj.name || "Untitled Project"}</span>
              {proj.featured && (
                <Badge variant="secondary" className="text-xs">Featured</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-muted-foreground hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
              {expandedId === proj.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </CardHeader>

          <AnimatePresence>
            {expandedId === proj.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <CardContent className="pt-0 space-y-4">
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={proj.imageUrl || ""}
                        onChange={(e) => updateProject(proj.id, "imageUrl", e.target.value)}
                        placeholder="https://…"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                      rows={2}
                      placeholder="What does this project do?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tech Stack</Label>
                    <Input
                      value={proj.techStack.join(", ")}
                      onChange={(e) =>
                        updateProject(proj.id, "techStack",
                          e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                        )
                      }
                      placeholder="React, TypeScript, Node.js"
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated list of technologies</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> Live URL
                      </Label>
                      <Input
                        value={proj.liveUrl || ""}
                        onChange={(e) => updateProject(proj.id, "liveUrl", e.target.value)}
                        placeholder="https://…"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" /> GitHub URL
                      </Label>
                      <Input
                        value={proj.githubUrl || ""}
                        onChange={(e) => updateProject(proj.id, "githubUrl", e.target.value)}
                        placeholder="https://github.com/…"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={proj.featured}
                        onChange={(e) => updateProject(proj.id, "featured", e.target.checked)}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-sm">Featured project (shown first)</span>
                    </label>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EXPERIENCE TAB
───────────────────────────────────────────────────────────── */
function ExperienceTab({ config, patch }: { config: any; patch: any }) {
  const experience: ExperienceEntry[] = config.experience;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addEntry = (type: "work" | "education" | "certification") => {
    const entry: ExperienceEntry = {
      id: Date.now().toString(),
      type,
      title: "",
      organization: "",
      startDate: new Date().toISOString().slice(0, 7),
      endDate: "",
      description: "",
    };
    patch("experience", [...experience, entry]);
    setExpandedId(entry.id);
  };

  const updateEntry = (id: string, field: keyof ExperienceEntry, value: string) => {
    patch("experience", experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeEntry = (id: string) => {
    patch("experience", experience.filter((e) => e.id !== id));
  };

  const typeLabels = { work: "💼 Work", education: "🎓 Education", certification: "🏅 Certification" };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground mr-1">Add:</span>
        {(["work", "education", "certification"] as const).map((t) => (
          <Button key={t} size="sm" variant="outline" onClick={() => addEntry(t)} className="gap-1 text-xs">
            <Plus className="w-3 h-3" /> {typeLabels[t]}
          </Button>
        ))}
      </div>

      {experience.length === 0 && (
        <Card className="border-border/50 bg-card/30">
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No experience entries yet. Add work experience, education, or certifications.
          </CardContent>
        </Card>
      )}

      {experience.map((entry) => (
        <Card key={entry.id} className="border-border/50 bg-card/50">
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between"
            onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{entry.type === "work" ? "💼" : entry.type === "education" ? "🎓" : "🏅"}</span>
              <div>
                <p className="font-medium text-sm">{entry.title || "Untitled"}</p>
                {entry.organization && (
                  <p className="text-xs text-muted-foreground">{entry.organization}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs capitalize">{entry.type}</Badge>
              <Button
                variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
              {expandedId === entry.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </CardHeader>

          <AnimatePresence>
            {expandedId === entry.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <CardContent className="pt-0 space-y-4">
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{entry.type === "work" ? "Job Title" : entry.type === "education" ? "Degree / Program" : "Certification Name"}</Label>
                      <Input
                        value={entry.title}
                        onChange={(e) => updateEntry(entry.id, "title", e.target.value)}
                        placeholder={entry.type === "work" ? "Senior Developer" : entry.type === "education" ? "B.Sc. Computer Science" : "AWS Certified"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{entry.type === "work" ? "Company / Organization" : entry.type === "education" ? "University / School" : "Issuing Organization"}</Label>
                      <Input
                        value={entry.organization}
                        onChange={(e) => updateEntry(entry.id, "organization", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date (YYYY-MM)</Label>
                      <Input
                        value={entry.startDate}
                        onChange={(e) => updateEntry(entry.id, "startDate", e.target.value)}
                        placeholder="2022-01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date (leave blank for "Present")</Label>
                      <Input
                        value={entry.endDate || ""}
                        onChange={(e) => updateEntry(entry.id, "endDate", e.target.value)}
                        placeholder="2024-06 or leave blank"
                      />
                    </div>
                  </div>

                  {entry.type !== "certification" && (
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={entry.description || ""}
                        onChange={(e) => updateEntry(entry.id, "description", e.target.value)}
                        rows={2}
                        placeholder="What did you accomplish?"
                      />
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONTACT TAB
───────────────────────────────────────────────────────────── */
function ContactTab({ config, patch }: { config: any; patch: any }) {
  const contact = config.contact;

  const updateContact = (field: string, value: unknown) =>
    patch("contact", { ...contact, [field]: value });

  const updateSocial = (idx: number, field: "platform" | "url", value: string) => {
    const updated = [...contact.socialLinks];
    updated[idx] = { ...updated[idx], [field]: value };
    updateContact("socialLinks", updated);
  };

  const addSocial = () =>
    updateContact("socialLinks", [...contact.socialLinks, { platform: "", url: "" }]);

  const removeSocial = (idx: number) =>
    updateContact("socialLinks", contact.socialLinks.filter((_: unknown, i: number) => i !== idx));

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="w-4 h-4" /> Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={contact.email || ""}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={contact.phone || ""}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={contact.location || ""}
              onChange={(e) => updateContact("location", e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={contact.showContactForm}
                onChange={(e) => updateContact("showContactForm", e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm">Show contact form on portfolio</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Social Links</CardTitle>
          <Button size="sm" variant="outline" onClick={addSocial} className="gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Link
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {contact.socialLinks.map((link: { platform: string; url: string }, idx: number) => (
            <div key={idx} className="flex items-center gap-3">
              <Input
                value={link.platform}
                onChange={(e) => updateSocial(idx, "platform", e.target.value)}
                placeholder="Platform (e.g. LinkedIn)"
                className="w-40"
              />
              <Input
                value={link.url}
                onChange={(e) => updateSocial(idx, "url", e.target.value)}
                placeholder="https://…"
                className="flex-1"
              />
              <Button
                variant="ghost" size="icon"
                className="w-8 h-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeSocial(idx)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {contact.socialLinks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No social links. Click "+ Add Link" to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
