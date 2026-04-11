import type { PortfolioConfig } from "@/types/portfolio";
import { sanitizeHTML } from "@/lib/utils/sanitize";

/**
 * FRAMER MINIMAL — ultra-clean, centered, single-column designer portfolio
 * Inspired by: readcv / Framer portfolio style
 * Colors: bg #fff · surface #f5f5f5 · accent #000 · text #111
 * Font: Inter  |  Layout: centered column, circular avatar, pill tabs, project cards
 */
export function renderFramerMinimalTemplate(config: PortfolioConfig): string {
  const { profile, skills, projects, experience, contact } = config;

  const workExp = experience.filter((e) => e.type === "work");
  const edu = experience.filter((e) => e.type === "education");

  /* ── Project cards ── */
  const projectCardsHTML = projects
    .slice(0, 8)
    .map(
      (p) => `
      <article class="proj-card" onclick="void(0)">
        <div class="proj-preview">
          ${
            p.imageUrl
              ? `<img src="${p.imageUrl}" alt="${sanitizeHTML(p.name)}" class="proj-img" loading="lazy"/>`
              : `<div class="proj-placeholder">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                 </div>`
          }
        </div>
        <div class="proj-meta">
          <h3 class="proj-name">${sanitizeHTML(p.name)}</h3>
          <p class="proj-desc">${sanitizeHTML(p.description)}</p>
          <div class="proj-tags">
            ${p.techStack
              .slice(0, 4)
              .map((t) => `<span class="tag">${sanitizeHTML(t)}</span>`)
              .join("")}
          </div>
          <div class="proj-links">
            ${p.liveUrl ? `<a href="${p.liveUrl}" class="proj-link" target="_blank" rel="noopener">Visit ↗</a>` : ""}
            ${p.githubUrl ? `<a href="${p.githubUrl}" class="proj-link" target="_blank" rel="noopener">GitHub ↗</a>` : ""}
          </div>
        </div>
      </article>
    `
    )
    .join("");

  /* ── Skills section (About tab) ── */
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    },
    {}
  );

  const skillsHTML = Object.entries(skillsByCategory)
    .map(
      ([cat, items]) => `
      <div class="skill-group">
        <h4 class="skill-cat">${sanitizeHTML(cat)}</h4>
        <div class="skill-chips">
          ${items
            .map(
              (s) => `
            <div class="skill-chip">
              <span class="skill-dot" style="background:${s.color || "#111"}"></span>
              <span>${sanitizeHTML(s.name)}</span>
              <div class="skill-bar-bg"><div class="skill-bar-fg" style="width:${s.level}%;background:${s.color || "#111"}"></div></div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
    )
    .join("");

  /* ── Experience timeline (About tab) ── */
  const expHTML = [...workExp, ...edu]
    .map(
      (e) => `
      <div class="exp-row">
        <div class="exp-left">
          <span class="exp-date">${e.startDate} – ${e.endDate || "Now"}</span>
        </div>
        <div class="exp-right">
          <p class="exp-title">${sanitizeHTML(e.title)}</p>
          <p class="exp-org">${sanitizeHTML(e.organization)}</p>
          ${e.description ? `<p class="exp-desc">${sanitizeHTML(e.description)}</p>` : ""}
        </div>
      </div>
    `
    )
    .join("");

  /* ── Social links ── */
  const socialsHTML = contact.socialLinks
    .filter((s) => s.url)
    .map(
      (s) =>
        `<a href="${s.url}" class="social-link" target="_blank" rel="noopener">${sanitizeHTML(s.platform)}</a>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitizeHTML(profile.displayName)}</title>
  <meta name="description" content="${sanitizeHTML(profile.bio)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* ── Reset & Base ── */
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { font-size: 16px; scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #ffffff;
      color: #111;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; text-decoration: none; }
    img { display: block; max-width: 100%; }

    /* ── Layout shell ── */
    .shell {
      max-width: 560px;
      margin: 0 auto;
      padding: 0 20px 80px;
    }

    /* ── Header / Profile ── */
    .profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 52px 0 32px;
      gap: 14px;
    }
    .avatar-wrap {
      position: relative;
      width: 72px;
      height: 72px;
    }
    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e5e5e5;
    }
    .avatar-ph {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      border: 2px solid #e5e5e5;
    }
    .profile-name {
      font-size: 1.25rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: #111;
    }
    .profile-title {
      font-size: 0.875rem;
      color: #666;
      font-weight: 400;
    }

    /* ── Tab bar ── */
    .tabs {
      display: flex;
      justify-content: center;
      border: 1px solid #e5e5e5;
      border-radius: 999px;
      padding: 4px;
      gap: 2px;
      width: fit-content;
      margin: 0 auto 40px;
      background: #fff;
    }
    .tab-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #999;
      padding: 6px 18px;
      border-radius: 999px;
      transition: all 0.18s ease;
    }
    .tab-btn.active {
      background: #111;
      color: #fff;
    }
    .tab-btn:hover:not(.active) {
      color: #111;
      background: #f5f5f5;
    }

    /* ── Tab panels ── */
    .tab-panel { display: none; }
    .tab-panel.visible { display: block; }

    /* ── Project cards ── */
    .proj-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .proj-card {
      border-radius: 16px;
      background: #f7f7f7;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: default;
    }
    .proj-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    }
    .proj-preview {
      width: 100%;
      min-height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #efefef;
      overflow: hidden;
    }
    .proj-img {
      width: 100%;
      height: 280px;
      object-fit: cover;
      object-position: top;
    }
    .proj-placeholder {
      color: #ccc;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 60px 0;
    }
    .proj-meta {
      padding: 16px 20px 20px;
    }
    .proj-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111;
      margin-bottom: 4px;
    }
    .proj-desc {
      font-size: 0.8125rem;
      color: #666;
      line-height: 1.55;
      margin-bottom: 12px;
    }
    .proj-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    .tag {
      font-size: 0.7rem;
      font-weight: 500;
      color: #555;
      background: #ebebeb;
      border-radius: 6px;
      padding: 3px 8px;
    }
    .proj-links {
      display: flex;
      gap: 12px;
    }
    .proj-link {
      font-size: 0.75rem;
      font-weight: 600;
      color: #111;
      border-bottom: 1px solid #111;
      padding-bottom: 1px;
      transition: opacity 0.15s;
    }
    .proj-link:hover { opacity: 0.5; }

    /* ── Posts tab (blog / articles) ── */
    .posts-empty {
      text-align: center;
      padding: 60px 0;
      color: #aaa;
      font-size: 0.875rem;
    }
    .post-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .post-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid #f0f0f0;
      gap: 16px;
      transition: opacity 0.15s;
    }
    .post-row:first-child { border-top: 1px solid #f0f0f0; }
    .post-row:hover { opacity: 0.6; }
    .post-title { font-size: 0.875rem; font-weight: 500; }
    .post-date { font-size: 0.75rem; color: #aaa; white-space: nowrap; }

    /* ── About tab ── */
    .about-bio {
      font-size: 0.9rem;
      color: #444;
      line-height: 1.75;
      margin-bottom: 32px;
    }
    .about-section-title {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #aaa;
      margin-bottom: 14px;
    }
    .about-block { margin-bottom: 36px; }

    /* Skills */
    .skill-group { margin-bottom: 20px; }
    .skill-cat {
      font-size: 0.75rem;
      font-weight: 600;
      color: #999;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .skill-chips { display: flex; flex-direction: column; gap: 8px; }
    .skill-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8125rem;
      color: #333;
    }
    .skill-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .skill-bar-bg {
      flex: 1;
      height: 4px;
      background: #efefef;
      border-radius: 2px;
      overflow: hidden;
      max-width: 140px;
    }
    .skill-bar-fg {
      height: 100%;
      border-radius: 2px;
    }

    /* Experience */
    .exp-row {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 16px;
      padding: 14px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .exp-row:first-child { border-top: 1px solid #f0f0f0; }
    .exp-date { font-size: 0.75rem; color: #aaa; padding-top: 2px; line-height: 1.4; }
    .exp-title { font-size: 0.875rem; font-weight: 600; color: #111; margin-bottom: 2px; }
    .exp-org { font-size: 0.8rem; color: #777; margin-bottom: 4px; }
    .exp-desc { font-size: 0.8rem; color: #888; line-height: 1.55; }

    /* Contact info */
    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.875rem;
      color: #555;
    }
    .contact-icon { font-size: 1rem; }

    /* Socials */
    .socials {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 20px;
    }
    .social-link {
      font-size: 0.75rem;
      font-weight: 600;
      color: #111;
      border: 1px solid #e5e5e5;
      border-radius: 999px;
      padding: 5px 14px;
      transition: all 0.15s;
    }
    .social-link:hover {
      background: #111;
      color: #fff;
      border-color: #111;
    }

    /* ── Contact form ── */
    .cf-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 20px;
    }
    .cf-inp, .cf-ta {
      width: 100%;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 11px 14px;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      color: #111;
      background: #fafafa;
      transition: border-color 0.18s;
    }
    .cf-inp:focus, .cf-ta:focus {
      outline: none;
      border-color: #111;
      background: #fff;
    }
    .cf-ta { resize: vertical; min-height: 110px; }
    .cf-submit {
      align-self: flex-start;
      background: #111;
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 10px 24px;
      font-family: 'Inter', sans-serif;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.18s;
    }
    .cf-submit:hover { opacity: 0.7; }

    /* ── Footer ── */
    .footer {
      text-align: center;
      padding: 32px 0 0;
      font-size: 0.75rem;
      color: #ccc;
    }
    .footer a { color: #aaa; border-bottom: 1px solid #e5e5e5; }
    .footer a:hover { color: #111; }

    /* ── Responsive ── */
    @media (max-width: 480px) {
      .shell { padding: 0 16px 64px; }
      .proj-img { height: 220px; }
      .exp-row { grid-template-columns: 1fr; gap: 4px; }
      .exp-date { font-size: 0.7rem; }
    }
  </style>
</head>
<body>
  <div class="shell">

    <!-- Profile header -->
    <header class="profile">
      <div class="avatar-wrap">
        ${
          profile.avatarUrl
            ? `<img src="${profile.avatarUrl}" alt="${sanitizeHTML(profile.displayName)}" class="avatar"/>`
            : `<div class="avatar-ph">👤</div>`
        }
      </div>
      <div>
        <h1 class="profile-name">${sanitizeHTML(profile.displayName)}</h1>
        <p class="profile-title">${sanitizeHTML(profile.title)}</p>
      </div>
    </header>

    <!-- Tab navigation -->
    <nav class="tabs" role="tablist" aria-label="Portfolio sections">
      <button class="tab-btn active" role="tab" data-tab="work" onclick="switchTab('work')">Work</button>
      <button class="tab-btn" role="tab" data-tab="posts" onclick="switchTab('posts')">Skills</button>
      <button class="tab-btn" role="tab" data-tab="about" onclick="switchTab('about')">About</button>
    </nav>

    <!-- Work tab -->
    <section id="panel-work" class="tab-panel visible" role="tabpanel">
      <div class="proj-list">
        ${
          projectCardsHTML ||
          `<div class="posts-empty">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin:0 auto 12px"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/></svg>
             <p>No projects yet — add some from the editor.</p>
           </div>`
        }
      </div>
    </section>

    <!-- Skills tab (mapped to "Posts" slot) -->
    <section id="panel-posts" class="tab-panel" role="tabpanel">
      ${
        skills.length > 0
          ? skillsHTML
          : `<p class="posts-empty">No skills added yet.</p>`
      }
    </section>

    <!-- About tab -->
    <section id="panel-about" class="tab-panel" role="tabpanel">
      <!-- Bio -->
      <p class="about-bio">${sanitizeHTML(profile.bio)}</p>
      ${profile.goals ? `<p class="about-bio" style="font-style:italic;color:#888">"${sanitizeHTML(profile.goals)}"</p>` : ""}

      <!-- Experience -->
      ${
        experience.length > 0
          ? `<div class="about-block">
               <p class="about-section-title">Experience</p>
               <div>${expHTML}</div>
             </div>`
          : ""
      }

      <!-- Contact info -->
      ${
        contact.email || contact.phone || contact.location
          ? `<div class="about-block">
               <p class="about-section-title">Contact</p>
               <div class="contact-list">
                 ${contact.email ? `<div class="contact-item"><span class="contact-icon">✉</span>${sanitizeHTML(contact.email)}</div>` : ""}
                 ${contact.phone ? `<div class="contact-item"><span class="contact-icon">✆</span>${sanitizeHTML(contact.phone)}</div>` : ""}
                 ${contact.location ? `<div class="contact-item"><span class="contact-icon">◎</span>${sanitizeHTML(contact.location)}</div>` : ""}
               </div>
             </div>`
          : ""
      }

      <!-- Social links -->
      ${
        contact.socialLinks.filter((s) => s.url).length > 0
          ? `<div class="about-block">
               <p class="about-section-title">Links</p>
               <div class="socials">${socialsHTML}</div>
             </div>`
          : ""
      }

      <!-- Contact form -->
      ${
        contact.showContactForm
          ? `<div class="about-block">
               <p class="about-section-title">Send a message</p>
               <form class="cf-form" onsubmit="return false;">
                 <input class="cf-inp" type="text" placeholder="Your name" autocomplete="name"/>
                 <input class="cf-inp" type="email" placeholder="Your email" autocomplete="email"/>
                 <textarea class="cf-ta" placeholder="What's on your mind?"></textarea>
                 <button type="submit" class="cf-submit">Send →</button>
               </form>
             </div>`
          : ""
      }
    </section>

    <footer class="footer">
      <p>Built with <a href="https://gitfolio.dev">GitFolio</a> · © ${new Date().getFullYear()} ${sanitizeHTML(profile.displayName)}</p>
    </footer>
  </div>

  <script>
    function switchTab(name) {
      // Update buttons
      document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.tab === name);
      });
      // Update panels
      document.querySelectorAll('.tab-panel').forEach(function(panel) {
        panel.classList.toggle('visible', panel.id === 'panel-' + name);
      });
    }
  </script>
</body>
</html>`;
}
