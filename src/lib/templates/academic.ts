import type { PortfolioConfig } from "@/types/portfolio";
import { sanitizeHTML } from "@/lib/utils/sanitize";

/** ACADEMIC — clean white + indigo, resume-focused for students/freshers */
export function renderAcademicTemplate(config: PortfolioConfig): string {
  const { profile, skills, projects, experience, contact, settings } = config;
  const dark = settings.darkMode;

  const workExp = experience.filter((e) => e.type === "work");
  const edu = experience.filter((e) => e.type === "education");
  const certs = experience.filter((e) => e.type === "certification");

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const skillsHTML = Object.entries(skillsByCategory).map(([cat, items]) => `
    <div class="skill-group">
      <h4 class="skill-cat">${sanitizeHTML(cat)}</h4>
      <div class="skill-tags">
        ${items.map((s) => `
          <div class="skill-item">
            <span class="skill-dot" style="background:${s.color || "var(--accent)"}"></span>
            <span>${sanitizeHTML(s.name)}</span>
            <div class="skill-bar"><div class="skill-fill" style="width:${s.level}%"></div></div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  const projectsHTML = projects.slice(0, 6).map((p) => `
    <div class="acad-proj">
      <div class="acad-proj-header">
        <h4>${sanitizeHTML(p.name)}</h4>
        <div class="proj-actions">
          ${p.liveUrl ? `<a href="${p.liveUrl}" class="proj-action" target="_blank">Live ↗</a>` : ""}
          ${p.githubUrl ? `<a href="${p.githubUrl}" class="proj-action" target="_blank">GitHub ↗</a>` : ""}
        </div>
      </div>
      <p>${sanitizeHTML(p.description)}</p>
      <div class="proj-chips">${p.techStack.map((t) => `<span class="chip">${sanitizeHTML(t)}</span>`).join("")}</div>
    </div>
  `).join("");

  const expHTML = [...workExp, ...edu].map((e) => `
    <div class="acad-exp">
      <div class="acad-exp-left">
        <span class="acad-exp-type">${e.type === "education" ? "🎓" : "💼"}</span>
        <div class="acad-vline"></div>
      </div>
      <div class="acad-exp-right">
        <h4>${sanitizeHTML(e.title)}</h4>
        <div class="acad-exp-meta">${sanitizeHTML(e.organization)} · <span>${e.startDate} – ${e.endDate || "Present"}</span></div>
        ${e.description ? `<p>${sanitizeHTML(e.description)}</p>` : ""}
      </div>
    </div>
  `).join("");

  const certsHTML = certs.map((c) => `
    <div class="cert-item">
      <span class="cert-icon">🏅</span>
      <div>
        <div class="cert-title">${sanitizeHTML(c.title)}</div>
        <div class="cert-org">${sanitizeHTML(c.organization)} · ${c.startDate}</div>
      </div>
    </div>
  `).join("");

  const socialsHTML = contact.socialLinks.filter((s) => s.url).map((s) => `
    <a href="${s.url}" class="social-link" target="_blank" rel="noopener">${sanitizeHTML(s.platform)} ↗</a>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en" data-theme="${dark ? "dark" : "light"}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${sanitizeHTML(profile.displayName)} — ${sanitizeHTML(profile.title)} Resume</title>
  <meta name="description" content="${sanitizeHTML(profile.bio)}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    :root{--bg:#ffffff;--surface:#f8fafc;--surface2:#ede9fe;--text:#111827;--muted:#6b7280;--border:#e5e7eb;--accent:#4f46e5;--accent2:#6366f1;--grad:linear-gradient(135deg,#4f46e5,#7c3aed);}
    [data-theme="dark"]{--bg:#111827;--surface:#1f2937;--surface2:#1e1b4b;--text:#f9fafb;--muted:#9ca3af;--border:#374151;--accent:#818cf8;--accent2:#a5b4fc;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.65;min-height:100vh}
    a{color:inherit;text-decoration:none}
    .container{max-width:920px;margin:0 auto;padding:0 2rem}

    /* TOP BAR */
    .top-bar{background:var(--accent);padding:.5rem 2rem;display:flex;align-items:center;justify-content:space-between}
    .top-bar-name{color:white;font-weight:700;font-size:.85rem;letter-spacing:.05em}
    .top-bar-nav{display:flex;gap:1.5rem}
    .top-bar-nav a{color:rgba(255,255,255,.7);font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;transition:color .2s}
    .top-bar-nav a:hover{color:white}
    .top-bar-toggle{background:rgba(255,255,255,.15);border:none;color:white;border-radius:4px;padding:.25rem .6rem;font-size:.7rem;cursor:pointer;font-family:inherit;font-weight:600;letter-spacing:.05em;transition:background .2s}
    .top-bar-toggle:hover{background:rgba(255,255,255,.25)}

    /* HERO */
    .hero{padding:3.5rem 2rem 3rem;position:relative;overflow:hidden}
    .hero::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:var(--grad)}
    .hero-inner{max-width:920px;margin:0 auto;display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:start}
    .hero-main h1{font-size:clamp(1.75rem,4vw,3rem);font-weight:800;letter-spacing:-.03em;margin-bottom:.35rem}
    .hero-role{font-size:1rem;color:var(--accent);font-weight:600;margin-bottom:1rem}
    .hero-bio{color:var(--muted);font-size:.9rem;max-width:55ch;margin-bottom:1rem}
    .hero-goals{background:var(--surface2);border-left:3px solid var(--accent);padding:.75rem 1rem;border-radius:0 6px 6px 0;font-size:.875rem;color:var(--text);margin-bottom:1.5rem;max-width:55ch;font-style:italic}
    .hero-contact-strip{display:flex;flex-wrap:wrap;gap:1rem;font-size:.8rem;color:var(--muted)}
    .hero-contact-item{display:flex;align-items:center;gap:.35rem}
    .hero-avatar{width:120px;height:120px;border-radius:12px;object-fit:cover;border:3px solid var(--accent);box-shadow:0 8px 24px rgba(79,70,229,.2)}
    .hero-avatar-placeholder{width:120px;height:120px;border-radius:12px;background:var(--surface2);border:3px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:3rem}

    /* PAGE LAYOUT */
    .page-grid{max-width:920px;margin:0 auto;padding:2rem 2rem;display:grid;grid-template-columns:2fr 1fr;gap:2.5rem;align-items:start}
    .main-col{}
    .side-col{}

    /* SECTION */
    .sec{margin-bottom:2.5rem}
    .sec-title{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:var(--accent);margin-bottom:1rem;padding-bottom:.5rem;border-bottom:2px solid var(--accent)}

    /* PROJECTS */
    .acad-proj{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.25rem;margin-bottom:1rem;transition:border-color .2s}
    .acad-proj:hover{border-color:var(--accent)}
    .acad-proj-header{display:flex;align-items:flex-start;justify-content:space-between;gap.5rem;gap:.5rem;margin-bottom:.5rem}
    .acad-proj-header h4{font-size:.95rem;font-weight:700}
    .proj-actions{display:flex;gap:.5rem}
    .proj-action{font-size:.7rem;color:var(--accent);font-weight:600;transition:opacity .2s}
    .proj-action:hover{opacity:.7}
    .acad-proj p{font-size:.825rem;color:var(--muted);margin-bottom:.75rem}
    .proj-chips{display:flex;flex-wrap:wrap;gap:.35rem}
    .chip{background:var(--surface2);color:var(--accent2);border-radius:4px;padding:.15rem .5rem;font-size:.7rem;font-weight:600}

    /* EXPERIENCE */
    .acad-exp{display:grid;grid-template-columns:2rem 1fr;gap:.75rem;margin-bottom:1.5rem}
    .acad-exp-left{display:flex;flex-direction:column;align-items:center}
    .acad-exp-type{font-size:1rem;line-height:1}
    .acad-vline{flex:1;width:1px;background:var(--border);margin:.35rem 0}
    .acad-exp-right h4{font-size:.9rem;font-weight:700;margin-bottom:.15rem}
    .acad-exp-meta{font-size:.75rem;color:var(--muted);margin-bottom:.35rem}
    .acad-exp-meta span{color:var(--accent);font-weight:500}
    .acad-exp-right p{font-size:.8rem;color:var(--muted)}

    /* SKILLS SIDEBAR */
    .skill-group{margin-bottom:1.5rem}
    .skill-cat{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin-bottom:.6rem}
    .skill-tags{display:flex;flex-direction:column;gap:.5rem}
    .skill-item{display:flex;align-items:center;gap:.5rem;font-size:.8rem}
    .skill-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
    .skill-bar{flex:1;height:3px;background:var(--border);border-radius:9999px;overflow:hidden;margin-left:auto;max-width:60px}
    .skill-fill{height:100%;background:var(--accent);border-radius:9999px}

    /* CERTS */
    .cert-item{display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem;font-size:.8rem}
    .cert-icon{font-size:1.1rem;flex-shrink:0}
    .cert-title{font-weight:600;font-size:.825rem}
    .cert-org{color:var(--muted);font-size:.75rem}

    /* CONTACT SIDEBAR */
    .contact-sidebar{display:flex;flex-direction:column;gap:.6rem;font-size:.8rem;color:var(--muted)}
    .social-link{color:var(--accent);font-weight:600;font-size:.8rem;display:block;margin-bottom:.4rem}
    .social-link:hover{text-decoration:underline}

    /* CONTACT FORM */
    .contact-form-wrap{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.5rem;margin-top:1.5rem}
    .cf-input{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:.6rem .875rem;font-size:.825rem;color:var(--text);font-family:inherit;margin-bottom:.75rem;transition:border-color .2s}
    .cf-input:focus{outline:none;border-color:var(--accent)}
    .cf-textarea{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:.6rem .875rem;font-size:.825rem;color:var(--text);font-family:inherit;resize:vertical;min-height:100px;margin-bottom:.75rem;transition:border-color .2s}
    .cf-textarea:focus{outline:none;border-color:var(--accent)}
    .cf-submit{background:var(--grad);color:white;border:none;border-radius:6px;padding:.6rem 1.25rem;font-size:.8rem;font-weight:700;cursor:pointer;width:100%;transition:opacity .2s;font-family:inherit}
    .cf-submit:hover{opacity:.9}

    footer{border-top:1px solid var(--border);padding:1.25rem 2rem;text-align:center;font-size:.75rem;color:var(--muted)}
    @media print{.top-bar,.top-bar-toggle{display:none!important}.page-grid{grid-template-columns:1fr}}
    @media(max-width:720px){.page-grid{grid-template-columns:1fr}.hero-inner{grid-template-columns:1fr}.hero-avatar,.hero-avatar-placeholder{display:none}.top-bar-nav{display:none}}
  </style>
</head>
<body>
  <div class="top-bar">
    <span class="top-bar-name">${sanitizeHTML(profile.displayName)}</span>
    <nav class="top-bar-nav">
      <a href="#about">About</a>
      <a href="#projects">Projects</a>
      <a href="#experience">Experience</a>
      <a href="#contact">Contact</a>
    </nav>
    <button class="top-bar-toggle" onclick="toggleTheme()">Theme ◑</button>
  </div>

  <section class="hero" id="about">
    <div class="hero-inner">
      <div class="hero-main">
        <h1>${sanitizeHTML(profile.displayName)}</h1>
        <div class="hero-role">${sanitizeHTML(profile.title)}</div>
        <p class="hero-bio">${sanitizeHTML(profile.bio)}</p>
        ${profile.goals ? `<div class="hero-goals">${sanitizeHTML(profile.goals)}</div>` : ""}
        <div class="hero-contact-strip">
          ${contact.email ? `<span class="hero-contact-item">✉ ${sanitizeHTML(contact.email)}</span>` : ""}
          ${contact.phone ? `<span class="hero-contact-item">📞 ${sanitizeHTML(contact.phone)}</span>` : ""}
          ${contact.location ? `<span class="hero-contact-item">📍 ${sanitizeHTML(contact.location)}</span>` : ""}
        </div>
      </div>
      ${profile.avatarUrl
        ? `<img src="${profile.avatarUrl}" alt="${sanitizeHTML(profile.displayName)}" class="hero-avatar"/>`
        : `<div class="hero-avatar-placeholder">👤</div>`}
    </div>
  </section>

  <div class="page-grid">
    <div class="main-col">
      <div class="sec" id="projects">
        <div class="sec-title">Projects</div>
        ${projectsHTML}
      </div>

      ${workExp.length > 0 || edu.length > 0 ? `
      <div class="sec" id="experience">
        <div class="sec-title">Experience & Education</div>
        ${expHTML}
      </div>` : ""}

      ${certs.length > 0 ? `
      <div class="sec">
        <div class="sec-title">Certifications</div>
        ${certsHTML}
      </div>` : ""}
    </div>

    <div class="side-col">
      <div class="sec">
        <div class="sec-title">Skills</div>
        ${skillsHTML}
      </div>

      <div class="sec" id="contact">
        <div class="sec-title">Contact</div>
        <div class="contact-sidebar">
          ${contact.email ? `<span>✉ ${sanitizeHTML(contact.email)}</span>` : ""}
          ${contact.phone ? `<span>📞 ${sanitizeHTML(contact.phone)}</span>` : ""}
          ${contact.location ? `<span>📍 ${sanitizeHTML(contact.location)}</span>` : ""}
        </div>
        <div style="margin-top:1rem">
          ${socialsHTML}
        </div>
        ${contact.showContactForm ? `
        <div class="contact-form-wrap">
          <form onsubmit="return false;">
            <input class="cf-input" type="text" placeholder="Your name"/>
            <input class="cf-input" type="email" placeholder="Email"/>
            <textarea class="cf-textarea" placeholder="Message…"></textarea>
            <button class="cf-submit" type="submit">Send Message</button>
          </form>
        </div>` : ""}
      </div>
    </div>
  </div>

  <footer>Crafted by ${sanitizeHTML(profile.displayName)} · <a href="https://gitfolio.dev" style="color:var(--accent)">GitFolio</a></footer>

  <script>
    function toggleTheme(){
      const h=document.documentElement;
      h.setAttribute('data-theme',h.getAttribute('data-theme')==='dark'?'light':'dark');
    }
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth'});});
    });
  </script>
</body>
</html>`;
}
