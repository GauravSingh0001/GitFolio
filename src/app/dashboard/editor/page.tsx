"use client";

import { useState } from "react";
import { usePortfolioConfig } from "@/hooks/use-portfolio-config";
import {
  User, Wrench, FolderGit2, Briefcase, Mail,
  Plus, X, ChevronDown, ChevronUp, ExternalLink,
  Save, Loader2, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon as Github } from "@/components/icons/github";
import type { SkillEntry, ExperienceEntry, ProjectEntry } from "@/types/portfolio";
import { cn } from "@/lib/utils";

/* ─── Shared primitives ─────────────────────────────── */
const inputCls =
  "w-full bg-[#201f1f] border border-[#414754]/30 rounded-lg px-3 py-2.5 text-sm text-[#e5e2e1] placeholder:text-[#8b90a0]/50 focus:outline-none focus:ring-1 focus:ring-[#aec6ff]/50 focus:border-[#aec6ff]/40 transition-all";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0] mb-1.5">
      {children}
    </p>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-lg bg-[#aec6ff]/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#aec6ff]" />
      </div>
      <h2 className="font-headline font-extrabold text-lg text-[#e5e2e1]">{label}</h2>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={cn("w-9 h-5 rounded-full transition-colors", checked ? "bg-[#00a572]" : "bg-[#414754]/40")}>
          <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-transform", checked ? "translate-x-5" : "translate-x-1")} />
        </div>
      </div>
      <span className="text-sm text-[#c1c6d7] group-hover:text-[#e5e2e1] transition-colors">{label}</span>
    </label>
  );
}

const SKILL_CATEGORIES = ["Frontend", "Backend", "Tools", "Design", "Languages", "Cloud", "Mobile", "Other"];

const EXP_TYPES = {
  work: { label: "Work", icon: Briefcase, color: "text-[#aec6ff] bg-[#aec6ff]/10", titleLabel: "Job Title", orgLabel: "Company", placeholder: "Senior Developer" },
  education: { label: "Education", icon: Briefcase, color: "text-[#4edea3] bg-[#4edea3]/10", titleLabel: "Degree", orgLabel: "University", placeholder: "B.Sc. Computer Science" },
  certification: { label: "Cert", icon: Briefcase, color: "text-[#b9c8de] bg-[#b9c8de]/10", titleLabel: "Certification", orgLabel: "Issuer", placeholder: "AWS Certified" },
} as const;

/* ─── Main editor ─────────────────────────────────────── */
export default function EditorPage() {
  const { config, patch, save, isSaving, saveStatus } = usePortfolioConfig();

  if (!config) {
    return (
      <div className="space-y-5 max-w-3xl animate-pulse">
        {[1, 2, 3].map((i) => <div key={i} className="h-36 bg-[#1c1b1b] rounded-xl" />)}
      </div>
    );
  }

  const p = config.profile;
  const updateProfile = (field: string, value: string) =>
    patch("profile", { ...p, [field]: value });

  return (
    <div className="max-w-3xl space-y-1.5 pb-16">
      {/* Sticky save bar */}
      <div className="sticky top-0 z-10 -mx-8 px-8 py-3 bg-[#0e0e0e]/80 backdrop-blur-md border-b border-[#414754]/15 flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline font-extrabold text-2xl tracking-tight text-[#e5e2e1]">
            Portfolio Editor
          </h1>
          <p className="text-xs text-[#8b90a0] mt-0.5">Changes save automatically to local storage</p>
        </div>
        <button
          onClick={save}
          disabled={isSaving}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-lg font-headline font-bold text-sm transition-all shadow-lg",
            saveStatus === "saved"
              ? "bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3]"
              : "bg-gradient-to-r from-[#aec6ff] to-[#0070f3] text-[#002e6b] shadow-blue-500/15 hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50"
          )}
        >
          {isSaving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : saveStatus === "saved" ? (
            <><CheckCircle2 className="w-4 h-4" /> Saved</>
          ) : (
            <><Save className="w-4 h-4" /> Save</>
          )}
        </button>
      </div>

      {/* ── Section 1: Core Identity ─────────────── */}
      <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-6">
        <SectionTitle icon={User} label="Core Identity" />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Display Name</Label>
              <input value={p.displayName} onChange={(e) => updateProfile("displayName", e.target.value)} placeholder="Jane Smith" className={inputCls} />
            </div>
            <div>
              <Label>Professional Title</Label>
              <input value={p.title} onChange={(e) => updateProfile("title", e.target.value)} placeholder="Full-Stack Developer" className={inputCls} />
            </div>
          </div>
          <div>
            <Label>Bio / Tagline</Label>
            <textarea value={p.bio} onChange={(e) => updateProfile("bio", e.target.value)} rows={3} placeholder="Short description that appears below your name…" className={`${inputCls} resize-none`} />
          </div>
          <div>
            <Label>Goals / Personal Statement</Label>
            <textarea value={p.goals || ""} onChange={(e) => updateProfile("goals", e.target.value)} rows={2} placeholder="What drives you? What are you working towards?" className={`${inputCls} resize-none`} />
          </div>
          <div>
            <Label>Profile Image URL</Label>
            <input value={p.avatarUrl || ""} onChange={(e) => updateProfile("avatarUrl", e.target.value)} placeholder="https://example.com/photo.jpg (leave blank to use GitHub avatar)" className={inputCls} />
          </div>
        </div>
      </div>

      {/* ── Section 2: Skills ─────────────────────── */}
      <SkillsSection config={config} patch={patch} />

      {/* ── Section 3: Projects ───────────────────── */}
      <ProjectsSection config={config} patch={patch} />

      {/* ── Section 4: Experience ─────────────────── */}
      <ExperienceSection config={config} patch={patch} />

      {/* ── Section 5: Contact ────────────────────── */}
      <ContactSection config={config} patch={patch} />
    </div>
  );
}

/* ─── Skills ─────────────────────────────────────────── */
function SkillsSection({ config, patch }: { config: any; patch: any }) {
  const skills: SkillEntry[] = config.skills;

  const addSkill = () =>
    patch("skills", [...skills, { id: Date.now().toString(), name: "", category: "Frontend", level: 70, color: "#aec6ff" }]);
  const update = (id: string, field: keyof SkillEntry, val: string | number) =>
    patch("skills", skills.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  const remove = (id: string) =>
    patch("skills", skills.filter((s) => s.id !== id));

  return (
    <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <SectionTitle icon={Wrench} label={`Skills (${skills.length})`} />
        <button onClick={addSkill} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#aec6ff]/10 border border-[#aec6ff]/20 rounded-lg text-xs font-label text-[#aec6ff] hover:bg-[#aec6ff]/20 transition-colors shrink-0 -mt-5">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      {skills.length === 0 && (
        <p className="text-sm text-[#8b90a0] text-center py-6">No skills yet. Click &quot;+ Add&quot; to start.</p>
      )}
      <div className="space-y-2">
        {skills.map((skill) => (
          <div key={skill.id} className="grid grid-cols-[1fr_130px_110px_38px_30px] gap-2 items-center">
            <input value={skill.name} onChange={(e) => update(skill.id, "name", e.target.value)} placeholder="Skill name" className={inputCls} />
            <select value={skill.category} onChange={(e) => update(skill.id, "category", e.target.value)} className="h-10 rounded-lg border border-[#414754]/30 bg-[#201f1f] px-2 text-sm text-[#e5e2e1] focus:outline-none focus:ring-1 focus:ring-[#aec6ff]/50 truncate">
              {SKILL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex items-center gap-1.5">
              <input type="range" min="0" max="100" value={skill.level} onChange={(e) => update(skill.id, "level", Number(e.target.value))} className="flex-1 accent-[#aec6ff]" />
              <span className="text-[10px] font-label text-[#8b90a0] w-7 text-right shrink-0">{skill.level}%</span>
            </div>
            <input type="color" value={skill.color || "#aec6ff"} onChange={(e) => update(skill.id, "color", e.target.value)} className="h-9 w-9 rounded-lg border border-[#414754]/30 cursor-pointer bg-[#201f1f] p-1" />
            <button onClick={() => remove(skill.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8b90a0] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Projects ────────────────────────────────────────── */
function ProjectsSection({ config, patch }: { config: any; patch: any }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const projects: ProjectEntry[] = config.projects;

  const add = () => {
    const np: ProjectEntry = { id: Date.now().toString(), name: "New Project", description: "", techStack: [], liveUrl: "", githubUrl: "", imageUrl: "", featured: false, displayOrder: projects.length };
    patch("projects", [...projects, np]);
    setExpandedId(np.id);
  };
  const update = (id: string, field: keyof ProjectEntry, val: unknown) =>
    patch("projects", projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  const remove = (id: string) => { patch("projects", projects.filter((p) => p.id !== id)); if (expandedId === id) setExpandedId(null); };

  return (
    <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <SectionTitle icon={FolderGit2} label={`Projects (${projects.length})`} />
        <button onClick={add} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#aec6ff]/10 border border-[#aec6ff]/20 rounded-lg text-xs font-label text-[#aec6ff] hover:bg-[#aec6ff]/20 transition-colors shrink-0 -mt-5">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      {projects.length === 0 && (
        <div className="text-center py-6 border border-[#414754]/15 border-dashed rounded-xl">
          <p className="text-sm text-[#8b90a0]">No projects yet. GitHub repos are auto-imported.</p>
        </div>
      )}
      <div className="space-y-2">
        {projects.map((proj) => {
          const isExp = expandedId === proj.id;
          return (
            <div key={proj.id} className="border border-[#414754]/15 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#201f1f] transition-colors" onClick={() => setExpandedId(isExp ? null : proj.id)}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <FolderGit2 className="w-4 h-4 text-[#aec6ff] shrink-0" />
                  <span className="font-headline font-bold text-sm text-[#e5e2e1] truncate">{proj.name || "Untitled"}</span>
                  {proj.featured && <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/20 font-label text-[10px] text-[#4edea3] shrink-0">Featured</span>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); remove(proj.id); }} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8b90a0] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {isExp ? <ChevronUp className="w-4 h-4 text-[#8b90a0]" /> : <ChevronDown className="w-4 h-4 text-[#8b90a0]" />}
                </div>
              </div>
              <AnimatePresence>
                {isExp && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-2 border-t border-[#414754]/15 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Name</Label><input value={proj.name} onChange={(e) => update(proj.id, "name", e.target.value)} className={inputCls} /></div>
                        <div><Label>Image URL</Label><input value={proj.imageUrl || ""} onChange={(e) => update(proj.id, "imageUrl", e.target.value)} placeholder="https://…" className={inputCls} /></div>
                      </div>
                      <div><Label>Description</Label><textarea value={proj.description} onChange={(e) => update(proj.id, "description", e.target.value)} rows={2} placeholder="What does this project do?" className={`${inputCls} resize-none`} /></div>
                      <div>
                        <Label>Tech Stack</Label>
                        <input value={proj.techStack.join(", ")} onChange={(e) => update(proj.id, "techStack", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} placeholder="React, TypeScript, Node.js" className={inputCls} />
                        <p className="text-[10px] font-label text-[#8b90a0] mt-1">Comma-separated</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Live URL</Label>
                          <div className="relative"><ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8b90a0]" /><input value={proj.liveUrl || ""} onChange={(e) => update(proj.id, "liveUrl", e.target.value)} placeholder="https://…" className={`${inputCls} pl-9`} /></div>
                        </div>
                        <div>
                          <Label>GitHub URL</Label>
                          <div className="relative"><Github className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8b90a0]" /><input value={proj.githubUrl || ""} onChange={(e) => update(proj.id, "githubUrl", e.target.value)} placeholder="https://github.com/…" className={`${inputCls} pl-9`} /></div>
                        </div>
                      </div>
                      <Toggle checked={proj.featured} onChange={(v) => update(proj.id, "featured", v)} label="Featured project (shown first)" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Experience ──────────────────────────────────────── */
function ExperienceSection({ config, patch }: { config: any; patch: any }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const experience: ExperienceEntry[] = config.experience;

  const add = (type: "work" | "education" | "certification") => {
    const e: ExperienceEntry = { id: Date.now().toString(), type, title: "", organization: "", startDate: new Date().toISOString().slice(0, 7), endDate: "", description: "" };
    patch("experience", [...experience, e]);
    setExpandedId(e.id);
  };
  const update = (id: string, field: keyof ExperienceEntry, val: string) =>
    patch("experience", experience.map((e) => (e.id === id ? { ...e, [field]: val } : e)));
  const remove = (id: string) => { patch("experience", experience.filter((e) => e.id !== id)); if (expandedId === id) setExpandedId(null); };

  return (
    <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-6">
      <SectionTitle icon={Briefcase} label={`Experience (${experience.length})`} />
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="font-label text-[10px] uppercase tracking-widest text-[#8b90a0] mr-1">Add:</span>
        {(["work", "education", "certification"] as const).map((t) => (
          <button key={t} onClick={() => add(t)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#201f1f] border border-[#414754]/20 rounded-lg text-xs font-label text-[#8b90a0] hover:text-[#e5e2e1] hover:border-[#414754]/50 transition-all">
            <Plus className="w-3 h-3" />{EXP_TYPES[t].label}
          </button>
        ))}
      </div>
      {experience.length === 0 && (
        <div className="text-center py-6 border border-[#414754]/15 border-dashed rounded-xl">
          <p className="text-sm text-[#8b90a0]">No entries yet. Add work, education, or certifications above.</p>
        </div>
      )}
      <div className="space-y-2">
        {experience.map((entry) => {
          const cfg = EXP_TYPES[entry.type as keyof typeof EXP_TYPES] ?? EXP_TYPES.work;
          const isExp = expandedId === entry.id;
          return (
            <div key={entry.id} className="border border-[#414754]/15 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#201f1f] transition-colors" onClick={() => setExpandedId(isExp ? null : entry.id)}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={cn("text-[10px] font-label px-2 py-0.5 rounded-full border font-medium shrink-0", entry.type === "work" ? "text-[#aec6ff] border-[#aec6ff]/20 bg-[#aec6ff]/10" : entry.type === "education" ? "text-[#4edea3] border-[#4edea3]/20 bg-[#4edea3]/10" : "text-[#b9c8de] border-[#b9c8de]/20 bg-[#b9c8de]/10")}>{cfg.label}</span>
                  <div className="min-w-0">
                    <p className="font-headline font-bold text-sm text-[#e5e2e1] truncate">{entry.title || "Untitled"}</p>
                    {entry.organization && <p className="text-xs text-[#8b90a0] truncate">{entry.organization}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); remove(entry.id); }} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8b90a0] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all"><X className="w-3.5 h-3.5" /></button>
                  {isExp ? <ChevronUp className="w-4 h-4 text-[#8b90a0]" /> : <ChevronDown className="w-4 h-4 text-[#8b90a0]" />}
                </div>
              </div>
              <AnimatePresence>
                {isExp && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-2 border-t border-[#414754]/15 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>{cfg.titleLabel}</Label><input value={entry.title} onChange={(e) => update(entry.id, "title", e.target.value)} placeholder={cfg.placeholder} className={inputCls} /></div>
                        <div><Label>{cfg.orgLabel}</Label><input value={entry.organization} onChange={(e) => update(entry.id, "organization", e.target.value)} className={inputCls} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Start Date (YYYY-MM)</Label><input value={entry.startDate} onChange={(e) => update(entry.id, "startDate", e.target.value)} placeholder="2022-01" className={inputCls} /></div>
                        <div><Label>End Date (blank = Present)</Label><input value={entry.endDate || ""} onChange={(e) => update(entry.id, "endDate", e.target.value)} placeholder="2024-06 or leave blank" className={inputCls} /></div>
                      </div>
                      {entry.type !== "certification" && (
                        <div><Label>Description</Label><textarea value={entry.description || ""} onChange={(e) => update(entry.id, "description", e.target.value)} rows={2} placeholder="What did you accomplish?" className={`${inputCls} resize-none`} /></div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Contact ─────────────────────────────────────────── */
function ContactSection({ config, patch }: { config: any; patch: any }) {
  const contact = config.contact;
  const upd = (field: string, value: unknown) => patch("contact", { ...contact, [field]: value });
  const updSocial = (idx: number, field: "platform" | "url", val: string) => {
    const arr = [...contact.socialLinks];
    arr[idx] = { ...arr[idx], [field]: val };
    upd("socialLinks", arr);
  };
  const addSocial = () => upd("socialLinks", [...contact.socialLinks, { platform: "", url: "" }]);
  const remSocial = (idx: number) => upd("socialLinks", contact.socialLinks.filter((_: unknown, i: number) => i !== idx));

  return (
    <div className="bg-[#1c1b1b] border border-[#414754]/15 rounded-xl p-6">
      <SectionTitle icon={Mail} label="Contact" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Email Address</Label><input type="email" value={contact.email || ""} onChange={(e) => upd("email", e.target.value)} placeholder="you@example.com" className={inputCls} /></div>
          <div><Label>Phone (optional)</Label><input type="tel" value={contact.phone || ""} onChange={(e) => upd("phone", e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls} /></div>
        </div>
        <div><Label>Location</Label><input value={contact.location || ""} onChange={(e) => upd("location", e.target.value)} placeholder="San Francisco, CA" className={inputCls} /></div>
        <Toggle checked={contact.showContactForm} onChange={(v) => upd("showContactForm", v)} label="Show contact form on portfolio" />

        {/* Social links */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Social Links</Label>
            <button onClick={addSocial} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#aec6ff]/10 border border-[#aec6ff]/20 rounded-lg text-xs font-label text-[#aec6ff] hover:bg-[#aec6ff]/20 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Link
            </button>
          </div>
          {contact.socialLinks.length === 0 && (
            <p className="text-xs text-[#8b90a0] py-3 text-center border border-[#414754]/15 border-dashed rounded-lg">
              No social links yet. Click &quot;Add Link&quot; to add one.
            </p>
          )}
          <div className="space-y-2">
            {contact.socialLinks.map((link: { platform: string; url: string }, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Platform name — fixed width */}
                <div className="w-32 shrink-0">
                  <input
                    value={link.platform}
                    onChange={(e) => updSocial(idx, "platform", e.target.value)}
                    placeholder="Platform"
                    className={inputCls}
                  />
                </div>
                {/* URL — grows to fill remaining space */}
                <div className="flex-1 min-w-0">
                  <input
                    value={link.url}
                    onChange={(e) => updSocial(idx, "url", e.target.value)}
                    placeholder="https://linkedin.com/in/…"
                    className={inputCls}
                  />
                </div>
                <button onClick={() => remSocial(idx)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#201f1f] border border-[#414754]/20 text-[#8b90a0] hover:text-[#ffb4ab] hover:border-[#ffb4ab]/30 transition-all shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
