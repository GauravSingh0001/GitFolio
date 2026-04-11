/** Core portfolio configuration — all user-editable data */

export interface SkillEntry {
  id: string;
  name: string;
  category: string; // "Frontend" | "Backend" | "Tools" | "Design" | custom
  level: number; // 0–100
  color?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
  displayOrder: number;
}

export interface ExperienceEntry {
  id: string;
  type: "work" | "education" | "certification";
  title: string;      // Job title / Degree / Cert name
  organization: string;
  startDate: string;  // YYYY-MM
  endDate?: string;   // YYYY-MM or undefined = "Present"
  description?: string;
  url?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
  category?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface ContactConfig {
  email?: string;
  phone?: string;
  location?: string;
  showContactForm: boolean;
  socialLinks: SocialLink[];
}

export interface ProfileConfig {
  displayName: string;
  title: string;       // e.g. "Full-Stack Developer"
  bio: string;
  goals?: string;      // personal statement
  avatarUrl?: string;  // user-provided override (GitHub avatar used as fallback)
}

export type TemplateId =
  | "minimalist"
  | "creative"
  | "data-viz"
  | "editorial"
  | "executive"
  | "academic"
  | "space-grotesk"
  | "hacker"
  | "portfolio-classic"
  | "framer-minimal";

export interface PortfolioSettings {
  activeTemplate: TemplateId;
  darkMode: boolean;
  accentColor?: string; // hex override
}

/** Complete portfolio configuration stored per user */
export interface PortfolioConfig {
  profile: ProfileConfig;
  skills: SkillEntry[];
  projects: ProjectEntry[];
  experience: ExperienceEntry[];
  gallery: GalleryItem[];
  contact: ContactConfig;
  settings: PortfolioSettings;
  updatedAt?: string;
}

/** Template metadata shown in the template picker UI */
export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  role: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  tags: string[];
  preview?: string; // SVG / placeholder
}

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    id: "minimalist",
    name: "Minimal Dark",
    description: "A sleek, dark, project-focused layout built for developers.",
    role: "Software Developer",
    accentColor: "#3b82f6",
    bgColor: "#0a0a0b",
    textColor: "#fafafa",
    tags: ["Dark", "Clean", "Code-focused"],
  },
  {
    id: "creative",
    name: "Creative Studio",
    description: "Visual-heavy, vibrant layout perfect for designers and creatives.",
    role: "UI/UX Designer",
    accentColor: "#a855f7",
    bgColor: "#fafafa",
    textColor: "#1a1a2e",
    tags: ["Light", "Visual", "Case-study"],
  },
  {
    id: "data-viz",
    name: "Data Dashboard",
    description: "Metric-rich dashboard layout with charts and data visualization.",
    role: "Data Analyst / Data Scientist",
    accentColor: "#0d9488",
    bgColor: "#0f172a",
    textColor: "#e2e8f0",
    tags: ["Dark", "Charts", "Analytics"],
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Blog-style, storytelling layout with warm typography.",
    role: "Content Creator / Writer",
    accentColor: "#d97706",
    bgColor: "#fffbf5",
    textColor: "#1c1917",
    tags: ["Light", "Blog", "Storytelling"],
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional, pitch-oriented layout for business leaders.",
    role: "Business / Entrepreneur",
    accentColor: "#d4af37",
    bgColor: "#0d1b2a",
    textColor: "#f0e6d3",
    tags: ["Dark", "Professional", "Pitch"],
  },
  {
    id: "academic",
    name: "Academic",
    description: "Simple, resume-focused layout for students and freshers.",
    role: "Student / Fresher",
    accentColor: "#4f46e5",
    bgColor: "#ffffff",
    textColor: "#111827",
    tags: ["Light", "Resume", "Clean"],
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    description: "Dark developer portfolio with green accent, typewriter hero, skills grid, and services cards.",
    role: "Software Developer",
    accentColor: "#25ab75",
    bgColor: "#1a1a1a",
    textColor: "#ffffff",
    tags: ["Dark", "Full-Stack", "Typewriter"],
  },
  {
    id: "hacker",
    name: "Hacker Terminal",
    description: "Matrix canvas background, glassmorphism nav, monospace terminal aesthetic for cybersecurity & dev roles.",
    role: "Security / Developer",
    accentColor: "#00ff41",
    bgColor: "#000000",
    textColor: "#00ff41",
    tags: ["Dark", "Matrix", "Cyberpunk"],
  },
  {
    id: "portfolio-classic",
    name: "Portfolio Classic",
    description: "Light, Bootstrap-inspired layout with circular skill rings, portfolio filter tabs, and purple/indigo accent.",
    role: "Frontend / Web Developer",
    accentColor: "#7c3aed",
    bgColor: "#ffffff",
    textColor: "#3f396d",
    tags: ["Light", "Purple", "Filter"],
  },
  {
    id: "framer-minimal",
    name: "Framer Minimal",
    description: "Ultra-clean, centered single-column designer portfolio with circular avatar, pill tabs, and large project cards.",
    role: "Designer / Creative",
    accentColor: "#111111",
    bgColor: "#ffffff",
    textColor: "#111111",
    tags: ["Light", "Minimal", "Designer"],
  },
];

/** Default starter config */
export function createDefaultPortfolioConfig(
  githubName: string,
  githubBio: string | null,
  avatarUrl: string
): PortfolioConfig {
  return {
    profile: {
      displayName: githubName,
      title: "Software Developer",
      bio: githubBio || "Passionate developer building great things.",
      goals: "",
      avatarUrl,
    },
    skills: [
      { id: "1", name: "JavaScript", category: "Frontend", level: 85, color: "#f7df1e" },
      { id: "2", name: "TypeScript", category: "Frontend", level: 80, color: "#3178c6" },
      { id: "3", name: "React", category: "Frontend", level: 82, color: "#61dafb" },
      { id: "4", name: "Node.js", category: "Backend", level: 75, color: "#339933" },
      { id: "5", name: "Git", category: "Tools", level: 90, color: "#f05032" },
    ],
    projects: [],
    experience: [],
    gallery: [],
    contact: {
      email: "",
      phone: "",
      location: "",
      showContactForm: true,
      socialLinks: [
        { platform: "GitHub", url: `https://github.com/${githubName}` },
        { platform: "LinkedIn", url: "" },
        { platform: "Twitter", url: "" },
      ],
    },
    settings: {
      activeTemplate: "minimalist",
      darkMode: true,
    },
  };
}
