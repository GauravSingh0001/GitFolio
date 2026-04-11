import type { PortfolioConfig } from "@/types/portfolio";
import { sanitizeHTML } from "@/lib/utils/sanitize";

/** CREATIVE STUDIO — light + vivid purple/magenta, UI/UX designer focus */
export function renderCreativeTemplate(config: PortfolioConfig): string {
  const { profile, skills, projects, experience, contact, settings } = config;
  const dark = settings.darkMode;

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    },
    {}
  );

  const workExp = experience.filter((e) => e.type === "work");
  const education = experience.filter((e) => e.type === "education");
  const certs = experience.filter((e) => e.type === "certification");

  const skillsHTML = Object.entries(skillsByCategory)
    .map(([cat, items]) => `
      <div class="skill-category">
        <h4 class="cat-label">${sanitizeHTML(cat)}</h4>
        <div class="skill-pills">
          ${items.map((s) => `
            <div class="skill-pill">
              <div class="pill-top">
                <span class="pill-name">${sanitizeHTML(s.name)}</span>
                <span class="pill-pct">${s.level}%</span>
              </div>
              <div class="pill-bar"><div class="pill-fill" style="width:${s.level}%;background:${s.color || "var(--accent)"}"></div></div>
            </div>
          `).join("")}
        </div>
      </div>
    `)
    .join("");

  const projectsHTML = projects.filter((p) => p.featured || !p.featured).slice(0, 6).map((p) => `
    <div class="project-card">
      ${p.imageUrl ? `<div class="proj-img" style="background-image:url('${p.imageUrl}')"></div>` : `<div class="proj-img proj-placeholder"><span>✦</span></div>`}
      <div class="proj-body">
        <h3>${sanitizeHTML(p.name)}</h3>
        <p class="proj-desc">${sanitizeHTML(p.description)}</p>
        <div class="proj-tags">${p.techStack.map((t) => `<span class="tag">${sanitizeHTML(t)}</span>`).join("")}</div>
        <div class="proj-links">
          ${p.liveUrl ? `<a href="${p.liveUrl}" class="btn-primary" target="_blank">View Live</a>` : ""}
          ${p.githubUrl ? `<a href="${p.githubUrl}" class="btn-outline" target="_blank">GitHub</a>` : ""}
        </div>
      </div>
    </div>
  `).join("");

  const expHTML = workExp.map((e) => `
    <div class="timeline-item">
      <div class="tl-dot"></div>
      <div class="tl-content">
        <h4>${sanitizeHTML(e.title)}</h4>
        <div class="tl-meta">${sanitizeHTML(e.organization)} · ${e.startDate} – ${e.endDate || "Present"}</div>
        ${e.description ? `<p>${sanitizeHTML(e.description)}</p>` : ""}
      </div>
    </div>
  `).join("");

  const socialsHTML = contact.socialLinks.filter((s) => s.url).map((s) => `
    <a href="${s.url}" class="social-btn" target="_blank" rel="noopener">${sanitizeHTML(s.platform)}</a>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en" data-theme="${dark ? "dark" : "light"}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${sanitizeHTML(profile.displayName)} — ${sanitizeHTML(profile.title)}</title>
  <meta name="description" content="${sanitizeHTML(profile.bio)}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    :root{--bg:#fafafa;--surface:#ffffff;--surface2:#f3f0ff;--text:#1a1a2e;--muted:#64748b;--border:#e2e8f0;--accent:#a855f7;--accent2:#ec4899;--grad:linear-gradient(135deg,#a855f7,#ec4899);}
    [data-theme="dark"]{--bg:#0f0f1a;--surface:#1a1a2e;--surface2:#1e1b4b;--text:#f1f5f9;--muted:#94a3b8;--border:#2d2d4a;--accent:#c084fc;--accent2:#f472b6;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh}
    h1,h2,h3,h4{font-family:'Syne',sans-serif;line-height:1.2}
    a{color:inherit;text-decoration:none}
    .container{max-width:1100px;margin:0 auto;padding:0 1.5rem}

    /* ── NAVBAR ── */
    nav{position:sticky;top:0;z-index:100;background:var(--bg);border-bottom:1px solid var(--border);backdrop-filter:blur(12px)}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;max-width:1100px;margin:0 auto}
    .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.25rem;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .nav-links{display:flex;gap:2rem}
    .nav-links a{font-size:.875rem;font-weight:500;color:var(--muted);transition:color .2s}
    .nav-links a:hover{color:var(--text)}
    .theme-toggle{background:none;border:1px solid var(--border);border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;color:var(--text);transition:all .2s}
    .theme-toggle:hover{border-color:var(--accent)}

    /* ── HERO ── */
    .hero{padding:6rem 1.5rem 4rem;position:relative;overflow:hidden}
    .hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 70% 40%,rgba(168,85,247,.15) 0%,transparent 70%);pointer-events:none}
    .hero-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center}
    .hero-badge{display:inline-flex;align-items:center;gap:.5rem;background:var(--surface2);border:1px solid var(--border);border-radius:9999px;padding:.35rem 1rem;font-size:.8rem;color:var(--accent);font-weight:600;margin-bottom:1.5rem}
    .hero h1{font-size:clamp(2.5rem,5vw,4rem);font-weight:800;margin-bottom:1.25rem}
    .hero h1 span{background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .hero-bio{color:var(--muted);font-size:1.1rem;margin-bottom:2rem;max-width:42ch}
    .hero-cta{display:flex;gap:1rem;flex-wrap:wrap}
    .btn-primary{background:var(--grad);color:#fff;padding:.7rem 1.5rem;border-radius:8px;font-weight:600;font-size:.875rem;transition:opacity .2s;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:.5rem}
    .btn-primary:hover{opacity:.9}
    .btn-outline{background:transparent;color:var(--text);padding:.7rem 1.5rem;border-radius:8px;font-weight:600;font-size:.875rem;border:1px solid var(--border);cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:.5rem}
    .btn-outline:hover{border-color:var(--accent);color:var(--accent)}
    .hero-avatar{width:320px;height:320px;border-radius:24px;object-fit:cover;box-shadow:0 20px 60px rgba(168,85,247,.3);justify-self:end}

    /* ── SECTIONS ── */
    section{padding:5rem 1.5rem}
    .section-label{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:var(--accent);margin-bottom:.75rem}
    .section-title{font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;margin-bottom:3rem}

    /* ── SKILLS ── */
    .skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:2rem}
    .cat-label{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:1rem}
    .skill-pills{display:flex;flex-direction:column;gap:.75rem}
    .skill-pill{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:.75rem 1rem}
    .pill-top{display:flex;justify-content:space-between;margin-bottom:.5rem;font-size:.875rem;font-weight:500}
    .pill-pct{color:var(--muted);font-size:.8rem}
    .pill-bar{height:4px;background:var(--border);border-radius:9999px;overflow:hidden}
    .pill-fill{height:100%;border-radius:9999px;transition:width 1s ease}

    /* ── PROJECTS ── */
    .projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.75rem}
    .project-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all .3s}
    .project-card:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(168,85,247,.15);border-color:var(--accent)}
    .proj-img{height:180px;background:var(--surface2);background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center;font-size:2rem;color:var(--accent)}
    .proj-body{padding:1.5rem}
    .proj-body h3{font-size:1.1rem;font-weight:700;margin-bottom:.5rem}
    .proj-desc{color:var(--muted);font-size:.875rem;margin-bottom:1rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .proj-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem}
    .tag{background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:.2rem .6rem;font-size:.75rem;color:var(--accent);font-weight:500}
    .proj-links{display:flex;gap:.75rem}

    /* ── EXPERIENCE ── */
    .timeline{position:relative;padding-left:2rem}
    .timeline::before{content:'';position:absolute;left:.5rem;top:0;bottom:0;width:1px;background:var(--border)}
    .timeline-item{position:relative;margin-bottom:2.5rem}
    .tl-dot{position:absolute;left:-1.625rem;top:.25rem;width:12px;height:12px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px var(--surface2)}
    .tl-content h4{font-size:1rem;font-weight:700;margin-bottom:.25rem}
    .tl-meta{font-size:.825rem;color:var(--muted);margin-bottom:.5rem}
    .tl-content p{font-size:.875rem;color:var(--muted)}

    /* ── CONTACT ── */
    .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start}
    .contact-info{display:flex;flex-direction:column;gap:1rem}
    .contact-row{display:flex;align-items:center;gap:.75rem;font-size:.95rem;color:var(--muted)}
    .socials{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.5rem}
    .social-btn{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:.5rem 1rem;font-size:.85rem;font-weight:500;transition:all .2s}
    .social-btn:hover{border-color:var(--accent);color:var(--accent)}
    .contact-form{display:flex;flex-direction:column;gap:1rem}
    .form-group{display:flex;flex-direction:column;gap:.5rem}
    .form-group label{font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
    .form-group input,.form-group textarea{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:.75rem 1rem;font-size:.875rem;color:var(--text);font-family:inherit;transition:border-color .2s;width:100%}
    .form-group input:focus,.form-group textarea:focus{outline:none;border-color:var(--accent)}
    .form-group textarea{resize:vertical;min-height:120px}

    /* ── FOOTER ── */
    footer{border-top:1px solid var(--border);text-align:center;padding:2rem;color:var(--muted);font-size:.8rem}

    @media(max-width:768px){
      .hero-inner{grid-template-columns:1fr}
      .hero-avatar{display:none}
      .contact-grid{grid-template-columns:1fr}
      nav .nav-links{display:none}
    }
  </style>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <span class="logo">${sanitizeHTML(profile.displayName)}</span>
      <div class="nav-links">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">🌙</button>
    </div>
  </nav>

  <section class="hero" id="about">
    <div class="hero-bg"></div>
    <div class="hero-inner">
      <div>
        <div class="hero-badge">✦ ${sanitizeHTML(profile.title)}</div>
        <h1>Hello, I'm <span>${sanitizeHTML(profile.displayName)}</span></h1>
        <p class="hero-bio">${sanitizeHTML(profile.bio)}</p>
        ${profile.goals ? `<p class="hero-bio" style="font-size:.95rem">${sanitizeHTML(profile.goals)}</p>` : ""}
        <div class="hero-cta">
          ${contact.socialLinks.find((s) => s.platform === "GitHub" && s.url) ? `<a href="${contact.socialLinks.find((s) => s.platform === "GitHub")!.url}" class="btn-primary" target="_blank">View GitHub ↗</a>` : ""}
          <a href="#contact" class="btn-outline">Get in Touch</a>
        </div>
      </div>
      ${profile.avatarUrl ? `<img src="${profile.avatarUrl}" alt="${sanitizeHTML(profile.displayName)}" class="hero-avatar"/>` : ""}
    </div>
  </section>

  <section id="skills" style="background:var(--surface)">
    <div class="container">
      <div class="section-label">Skills & Expertise</div>
      <h2 class="section-title">What I Bring to the Table</h2>
      <div class="skills-grid">${skillsHTML}</div>
    </div>
  </section>

  <section id="projects">
    <div class="container">
      <div class="section-label">Portfolio</div>
      <h2 class="section-title">Selected Work</h2>
      <div class="projects-grid">${projectsHTML}</div>
    </div>
  </section>

  ${workExp.length > 0 ? `
  <section id="experience" style="background:var(--surface)">
    <div class="container">
      <div class="section-label">Experience</div>
      <h2 class="section-title">Career Timeline</h2>
      <div style="max-width:700px">
        <div class="timeline">${expHTML}</div>
      </div>
    </div>
  </section>` : ""}

  <section id="contact">
    <div class="container">
      <div class="section-label">Contact</div>
      <h2 class="section-title">Let's Work Together</h2>
      <div class="contact-grid">
        <div>
          <div class="contact-info">
            ${contact.email ? `<div class="contact-row"><span>✉</span><span>${sanitizeHTML(contact.email)}</span></div>` : ""}
            ${contact.phone ? `<div class="contact-row"><span>📞</span><span>${sanitizeHTML(contact.phone)}</span></div>` : ""}
            ${contact.location ? `<div class="contact-row"><span>📍</span><span>${sanitizeHTML(contact.location)}</span></div>` : ""}
          </div>
          <div class="socials">${socialsHTML}</div>
        </div>
        ${contact.showContactForm ? `
        <form class="contact-form" onsubmit="return false;">
          <div class="form-group"><label>Name</label><input type="text" placeholder="Your name"/></div>
          <div class="form-group"><label>Email</label><input type="email" placeholder="your@email.com"/></div>
          <div class="form-group"><label>Message</label><textarea placeholder="Tell me about your project…"></textarea></div>
          <button type="submit" class="btn-primary" style="width:fit-content">Send Message</button>
        </form>` : ""}
      </div>
    </div>
  </section>

  <footer><p>Crafted by ${sanitizeHTML(profile.displayName)} · Built with <a href="https://gitfolio.dev" style="color:var(--accent)">GitFolio</a></p></footer>

  <script>
    function toggleTheme(){
      const html=document.documentElement;
      const cur=html.getAttribute('data-theme');
      html.setAttribute('data-theme',cur==='dark'?'light':'dark');
      document.querySelector('.theme-toggle').textContent=cur==='dark'?'🌙':'☀️';
    }
    document.querySelector('.theme-toggle').textContent='${dark ? "☀️" : "🌙"}';
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});});
    });
  </script>
</body>
</html>`;
}
