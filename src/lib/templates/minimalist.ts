import type { PortfolioConfig } from "@/types/portfolio";
import { sanitizeHTML } from "@/lib/utils/sanitize";

/** MINIMAL DARK — original style extended to full PortfolioConfig */
export function renderMinimalistTemplate(config: PortfolioConfig): string {
  const { profile, skills, projects, experience, contact, settings } = config;

  const workExp = experience.filter((e) => e.type === "work");
  const edu = experience.filter((e) => e.type === "education");

  const skillsHTML = skills
    .slice(0, 14)
    .map(
      (s) =>
        `<span class="skill-tag" style="--skill-color:${s.color || "#64748b"}">${sanitizeHTML(s.name)} <small>${s.level}%</small></span>`
    )
    .join("\n          ");

  const displayProjects = projects.filter((p) => p.featured).length > 0
    ? projects.filter((p) => p.featured)
    : projects.slice(0, 6);

  const projectsHTML = displayProjects.map((p) => {
    const langHTML = p.techStack.length > 0
      ? `<span class="lang-text">${p.techStack.slice(0, 3).map(sanitizeHTML).join(" · ")}</span>`
      : "";
    return `
      <div class="project-card">
        <div class="proj-inner">
          <h3>${sanitizeHTML(p.name)}</h3>
          ${p.description ? `<p class="project-desc">${sanitizeHTML(p.description)}</p>` : ""}
          <div class="project-meta">
            <div class="lang">${langHTML}</div>
            <div class="proj-links">
              ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener" class="proj-link">Live ↗</a>` : ""}
              ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="proj-link">GitHub</a>` : ""}
            </div>
          </div>
        </div>
      </div>`;
  }).join("\n        ");

  const expHTML = workExp.map((e) => `
    <div class="exp-item">
      <div class="exp-header">
        <strong>${sanitizeHTML(e.title)}</strong>
        <span class="exp-date">${e.startDate} – ${e.endDate || "Present"}</span>
      </div>
      <div class="exp-org">${sanitizeHTML(e.organization)}</div>
      ${e.description ? `<p class="exp-desc">${sanitizeHTML(e.description)}</p>` : ""}
    </div>
  `).join("");

  const socialsHTML = contact.socialLinks
    .filter((s) => s.url)
    .map(
      (s) =>
        `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-link">${sanitizeHTML(s.platform)}</a>`
    )
    .join("\n          ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${sanitizeHTML(profile.displayName)} — Developer Portfolio</title>
  <meta name="description" content="${sanitizeHTML(profile.bio)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --bg: ${settings.darkMode ? "#0a0a0b" : "#fafafa"};
      --surface: ${settings.darkMode ? "#141416" : "#ffffff"};
      --border: ${settings.darkMode ? "#1e1e22" : "#e5e7eb"};
      --text: ${settings.darkMode ? "#fafafa" : "#111827"};
      --text-muted: ${settings.darkMode ? "#a1a1aa" : "#6b7280"};
      --accent: ${settings.accentColor || "#3b82f6"};
      --accent-glow: rgba(59, 130, 246, 0.15);
    }
    body {
      font-family: 'Inter', system-ui, sans-serif; background: var(--bg);
      color: var(--text); line-height: 1.6; min-height: 100vh;
    }
    .container { max-width: 900px; margin: 0 auto; padding: 4rem 1.5rem; }
    a { color: inherit; text-decoration: none; }

    /* NAV */
    nav { position: sticky; top: 0; z-index: 100; background: rgba(10,10,11,.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
    .nav-inner { max-width: 900px; margin: 0 auto; padding: .875rem 1.5rem; display: flex; align-items: center; justify-content: space-between; }
    .nav-name { font-weight: 700; font-size: .9rem; }
    .nav-links { display: flex; gap: 1.5rem; }
    .nav-links a { font-size: .8rem; color: var(--text-muted); transition: color .2s; }
    .nav-links a:hover { color: var(--text); }
    .nav-toggle { background: none; border: 1px solid var(--border); width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; color: var(--text); transition: border-color .2s; }
    .nav-toggle:hover { border-color: var(--accent); }

    /* Hero */
    .hero { text-align: center; margin-bottom: 4rem; padding-top: 2rem; }
    .avatar { width: 120px; height: 120px; border-radius: 50%; border: 3px solid var(--border); margin-bottom: 1.5rem; box-shadow: 0 0 40px var(--accent-glow); object-fit: cover; }
    .hero h1 { font-size: 2.5rem; font-weight: 700; letter-spacing: -0.03em; }
    .hero .title { color: var(--accent); font-size: 1rem; font-weight: 500; margin-top: .25rem; }
    .hero .tagline { color: var(--text-muted); font-size: 1.05rem; margin-top: .5rem; max-width: 500px; margin-inline: auto; }
    .hero .goals { margin-top: 1rem; font-style: italic; color: var(--text-muted); font-size: .9rem; max-width: 500px; margin-inline: auto; }

    /* Skills */
    .section-title {
      font-size: 0.8rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 1.5rem;
      display: flex; align-items: center; gap: 0.5rem;
    }
    .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
    .skills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 4rem; }
    .skill-tag {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.4rem 0.9rem; border-radius: 9999px; font-size: 0.85rem;
      background: var(--surface); border: 1px solid var(--border);
      color: var(--text); transition: all 0.2s;
    }
    .skill-tag:hover { border-color: var(--skill-color, var(--accent)); box-shadow: 0 0 12px var(--accent-glow); }
    .skill-tag small { color: var(--text-muted); font-size: 0.75rem; }

    /* Projects */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 4rem; }
    .project-card {
      border-radius: 12px; background: var(--surface); border: 1px solid var(--border);
      transition: all 0.25s;
    }
    .project-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
    .proj-inner { padding: 1.5rem; display: flex; flex-direction: column; height: 100%; }
    .proj-inner h3 { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.5rem; }
    .project-desc { font-size: 0.875rem; color: var(--text-muted); flex: 1; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .project-meta { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted); }
    .lang-text { font-size: .75rem; }
    .proj-links { display: flex; gap: .5rem; }
    .proj-link { font-size: .75rem; color: var(--accent); font-weight: 600; transition: opacity .2s; }
    .proj-link:hover { opacity: .7; }

    /* Experience */
    .exp-item { padding: 1.25rem 0; border-bottom: 1px solid var(--border); }
    .exp-item:last-child { border-bottom: none; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: .25rem; flex-wrap: wrap; gap: .5rem; }
    .exp-header strong { font-size: .95rem; font-weight: 600; }
    .exp-date { font-size: .75rem; color: var(--text-muted); }
    .exp-org { font-size: .85rem; color: var(--accent); margin-bottom: .35rem; }
    .exp-desc { font-size: .85rem; color: var(--text-muted); }
    .exp-list { margin-bottom: 4rem; }

    /* Social */
    .socials { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; margin-top: 3rem; }
    .social-link {
      padding: 0.5rem 1.25rem; border-radius: 8px; font-size: 0.875rem;
      background: var(--surface); border: 1px solid var(--border);
      color: var(--text); text-decoration: none; transition: all 0.2s;
    }
    .social-link:hover { border-color: var(--accent); color: var(--accent); }

    /* Contact */
    .contact-info { text-align: center; margin-bottom: 2rem; color: var(--text-muted); font-size: .9rem; }

    /* Footer */
    .footer { text-align: center; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.8rem; }
    .footer a { color: var(--accent); text-decoration: none; }

    @media (max-width: 640px) {
      .hero h1 { font-size: 1.8rem; }
      .container { padding: 2rem 1rem; }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <span class="nav-name">${sanitizeHTML(profile.displayName)}</span>
      <div class="nav-links">
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        ${workExp.length > 0 ? '<a href="#experience">Experience</a>' : ""}
        <a href="#contact">Contact</a>
      </div>
      <button class="nav-toggle" onclick="toggleTheme()">☀</button>
    </div>
  </nav>

  <div class="container">
    <div class="hero" id="about">
      ${profile.avatarUrl ? `<img src="${profile.avatarUrl}" alt="${sanitizeHTML(profile.displayName)}" class="avatar" />` : ""}
      <h1>${sanitizeHTML(profile.displayName)}</h1>
      <div class="title">${sanitizeHTML(profile.title)}</div>
      <p class="tagline">${sanitizeHTML(profile.bio)}</p>
      ${profile.goals ? `<p class="goals">"${sanitizeHTML(profile.goals)}"</p>` : ""}
      ${socialsHTML ? `<div class="socials">${socialsHTML}</div>` : ""}
    </div>

    <div id="skills">
      <div class="section-title">Tech Stack</div>
      <div class="skills">
        ${skillsHTML}
      </div>
    </div>

    <div id="projects">
      <div class="section-title">Projects</div>
      <div class="projects-grid">
        ${projectsHTML}
      </div>
    </div>

    ${workExp.length > 0 ? `
    <div id="experience">
      <div class="section-title">Experience</div>
      <div class="exp-list">
        ${expHTML}
      </div>
    </div>` : ""}

    <div id="contact">
      <div class="section-title">Contact</div>
      <div class="contact-info">
        ${contact.email ? `<div>✉ ${sanitizeHTML(contact.email)}</div>` : ""}
        ${contact.phone ? `<div>📞 ${sanitizeHTML(contact.phone)}</div>` : ""}
        ${contact.location ? `<div>📍 ${sanitizeHTML(contact.location)}</div>` : ""}
      </div>
    </div>

    <div class="footer">
      <p>Built with <a href="https://gitfolio.dev">GitFolio Engine</a></p>
    </div>
  </div>

  <script>
    let dark = ${settings.darkMode};
    function toggleTheme() {
      dark = !dark;
      const root = document.documentElement;
      root.style.setProperty('--bg', dark ? '#0a0a0b' : '#fafafa');
      root.style.setProperty('--surface', dark ? '#141416' : '#ffffff');
      root.style.setProperty('--border', dark ? '#1e1e22' : '#e5e7eb');
      root.style.setProperty('--text', dark ? '#fafafa' : '#111827');
      root.style.setProperty('--text-muted', dark ? '#a1a1aa' : '#6b7280');
      document.querySelector('.nav-toggle').textContent = dark ? '☀' : '🌙';
    }
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if(t) t.scrollIntoView({ behavior: 'smooth' });
      });
    });
  </script>
</body>
</html>`;
}
