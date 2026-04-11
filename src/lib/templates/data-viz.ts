import type { PortfolioConfig } from "@/types/portfolio";
import { sanitizeHTML } from "@/lib/utils/sanitize";

/** DATA DASHBOARD — dark slate + teal, metrics-forward for data analysts */
export function renderDataVizTemplate(config: PortfolioConfig): string {
  const { profile, skills, projects, experience, contact, settings } = config;
  const dark = settings.darkMode;

  const topSkills = skills.slice(0, 8);
  const workExp = experience.filter((e) => e.type === "work");
  const certs = experience.filter((e) => e.type === "certification");
  const edu = experience.filter((e) => e.type === "education");

  const skillBarsHTML = topSkills.map((s) => `
    <div class="metric-row">
      <div class="metric-label">
        <span>${sanitizeHTML(s.name)}</span>
        <span class="metric-badge">${sanitizeHTML(s.category)}</span>
      </div>
      <div class="metric-bar-wrap">
        <div class="metric-bar">
          <div class="metric-fill" style="width:${s.level}%;background:${s.color || "var(--accent)"}"></div>
        </div>
        <span class="metric-val">${s.level}</span>
      </div>
    </div>
  `).join("");

  const projectCardsHTML = projects.slice(0, 6).map((p, i) => `
    <div class="data-card" style="animation-delay:${i * 0.1}s">
      <div class="card-header">
        <h3>${sanitizeHTML(p.name)}</h3>
        <div class="card-status">${p.featured ? "⭐ Featured" : "Project"}</div>
      </div>
      <p class="card-desc">${sanitizeHTML(p.description)}</p>
      <div class="card-stack">${p.techStack.map((t) => `<span class="stack-chip">${sanitizeHTML(t)}</span>`).join("")}</div>
      <div class="card-footer">
        ${p.liveUrl ? `<a href="${p.liveUrl}" class="chip-link" target="_blank">↗ Live</a>` : ""}
        ${p.githubUrl ? `<a href="${p.githubUrl}" class="chip-link chip-outline" target="_blank">GitHub</a>` : ""}
      </div>
    </div>
  `).join("");

  const expHTML = workExp.map((e) => `
    <div class="exp-item">
      <div class="exp-dot"></div>
      <div class="exp-content">
        <div class="exp-header">
          <h4>${sanitizeHTML(e.title)}</h4>
          <span class="exp-date">${e.startDate} — ${e.endDate || "Present"}</span>
        </div>
        <div class="exp-org">${sanitizeHTML(e.organization)}</div>
        ${e.description ? `<p class="exp-desc">${sanitizeHTML(e.description)}</p>` : ""}
      </div>
    </div>
  `).join("");

  const certsHTML = certs.map((c) => `
    <div class="cert-card">
      <div class="cert-icon">🏆</div>
      <div class="cert-info">
        <div class="cert-name">${sanitizeHTML(c.title)}</div>
        <div class="cert-org">${sanitizeHTML(c.organization)} · ${c.startDate}</div>
      </div>
    </div>
  `).join("");

  const socialsHTML = contact.socialLinks.filter((s) => s.url).map((s) => `
    <a href="${s.url}" class="social-chip" target="_blank" rel="noopener">${sanitizeHTML(s.platform)} ↗</a>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en" data-theme="${dark ? "dark" : "light"}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${sanitizeHTML(profile.displayName)} — ${sanitizeHTML(profile.title)}</title>
  <meta name="description" content="${sanitizeHTML(profile.bio)}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    :root{--bg:#0f172a;--surface:#1e293b;--surface2:#1e3a5f;--text:#e2e8f0;--muted:#94a3b8;--border:#334155;--accent:#0d9488;--accent2:#06b6d4;--grad:linear-gradient(135deg,#0d9488,#06b6d4);}
    [data-theme="light"]{--bg:#f1f5f9;--surface:#ffffff;--surface2:#e0f2fe;--text:#0f172a;--muted:#64748b;--border:#e2e8f0;--accent:#0d9488;--accent2:#0891b2;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh}
    code,pre,.mono{font-family:'JetBrains Mono',monospace}
    a{color:inherit;text-decoration:none}
    .container{max-width:1100px;margin:0 auto;padding:0 1.5rem}

    /* HEADER */
    header{background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100}
    .header-inner{display:flex;align-items:center;justify-content:space-between;padding:.875rem 1.5rem;max-width:1100px;margin:0 auto}
    .header-name{font-family:'JetBrains Mono',monospace;font-size:1.1rem;font-weight:700;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .header-nav{display:flex;gap:1.5rem}
    .header-nav a{font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);transition:color .2s;font-weight:600}
    .header-nav a:hover{color:var(--accent)}
    .header-toggle{background:none;border:1px solid var(--border);padding:.375rem .75rem;border-radius:6px;cursor:pointer;font-size:.75rem;color:var(--muted);font-family:inherit;transition:all .2s}
    .header-toggle:hover{border-color:var(--accent);color:var(--accent)}

    /* HERO DASHBOARD */
    .dash-hero{padding:3rem 1.5rem;background:var(--bg);border-bottom:1px solid var(--border)}
    .dash-hero-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:auto 1fr;gap:2rem;align-items:center}
    .avatar-wrap{position:relative}
    .avatar-img{width:80px;height:80px;border-radius:16px;border:2px solid var(--accent);object-fit:cover}
    .avatar-placeholder{width:80px;height:80px;border-radius:16px;border:2px solid var(--accent);background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:2rem}
    .status-dot{position:absolute;bottom:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:#22c55e;border:2px solid var(--bg)}
    .hero-text h1{font-size:1.75rem;font-weight:700;margin-bottom:.25rem}
    .hero-text .role{color:var(--accent);font-size:1rem;font-weight:500;font-family:'JetBrains Mono',monospace;margin-bottom:.75rem}
    .hero-text p{color:var(--muted);font-size:.9rem;max-width:60ch}
    .stat-row{display:flex;gap:2rem;margin-top:1.5rem;flex-wrap:wrap}
    .stat-box{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:.75rem 1.25rem;min-width:100px}
    .stat-num{font-size:1.5rem;font-weight:700;font-family:'JetBrains Mono',monospace;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .stat-label{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-top:.25rem}

    /* SECTION */
    section{padding:4rem 1.5rem}
    .sec-head{display:flex;align-items:center;gap:1rem;margin-bottom:2.5rem;font-family:'JetBrains Mono',monospace}
    .sec-num{font-size:.7rem;color:var(--accent);letter-spacing:.15em;border:1px solid var(--accent);padding:.2rem .5rem;border-radius:4px}
    .sec-title{font-size:1.5rem;font-weight:700}

    /* METRICS */
    .metrics-wrap{max-width:700px}
    .metric-row{margin-bottom:1.25rem}
    .metric-label{display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem;font-size:.875rem;font-weight:500}
    .metric-badge{background:var(--surface2);border:1px solid var(--border);border-radius:4px;padding:.15rem .5rem;font-size:.7rem;font-family:'JetBrains Mono',monospace;color:var(--accent)}
    .metric-bar-wrap{display:flex;align-items:center;gap.75rem;gap:.75rem}
    .metric-bar{flex:1;height:6px;background:var(--border);border-radius:9999px;overflow:hidden}
    .metric-fill{height:100%;border-radius:9999px}
    .metric-val{font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--muted);width:2.5rem;text-align:right}

    /* DATA CARDS */
    .data-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem}
    .data-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.5rem;transition:all .3s;cursor:default}
    .data-card:hover{border-color:var(--accent);transform:translateY(-2px);box-shadow:0 8px 24px rgba(13,148,136,.15)}
    .card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;gap:.5rem}
    .card-header h3{font-size:1rem;font-weight:700}
    .card-status{font-size:.7rem;font-family:'JetBrains Mono',monospace;color:var(--accent);white-space:nowrap}
    .card-desc{color:var(--muted);font-size:.825rem;margin-bottom:1rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .card-stack{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:1rem}
    .stack-chip{background:var(--surface2);color:var(--accent2);border-radius:4px;padding:.15rem .5rem;font-size:.7rem;font-family:'JetBrains Mono',monospace}
    .card-footer{display:flex;gap:.5rem}
    .chip-link{font-size:.75rem;font-weight:600;background:var(--accent);color:white;border-radius:6px;padding:.35rem .75rem;transition:opacity .2s}
    .chip-link:hover{opacity:.85}
    .chip-outline{background:transparent;color:var(--accent);border:1px solid var(--accent)}

    /* EXP */
    .exp-list{max-width:750px;display:flex;flex-direction:column;gap:0}
    .exp-item{display:grid;grid-template-columns:1rem 1fr;gap:1.25rem;padding-bottom:2rem;position:relative}
    .exp-item::before{content:'';position:absolute;left:.4375rem;top:1.25rem;bottom:0;width:1px;background:var(--border)}
    .exp-dot{width:14px;height:14px;border-radius:50%;background:var(--accent);margin-top:.25rem;flex-shrink:0;z-index:1}
    .exp-content{}
    .exp-header{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin-bottom:.25rem;flex-wrap:wrap}
    .exp-header h4{font-size:.975rem;font-weight:700}
    .exp-date{font-size:.75rem;font-family:'JetBrains Mono',monospace;color:var(--muted)}
    .exp-org{font-size:.85rem;color:var(--accent);margin-bottom:.5rem;font-weight:500}
    .exp-desc{font-size:.85rem;color:var(--muted)}

    /* CERTS */
    .cert-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}
    .cert-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1rem 1.25rem;display:flex;align-items:center;gap:1rem}
    .cert-icon{font-size:1.5rem}
    .cert-name{font-size:.875rem;font-weight:600}
    .cert-org{font-size:.75rem;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-top:.2rem}

    /* CONTACT */
    .contact-strip{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2.5rem;max-width:800px}
    .contact-top{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:2rem}
    .contact-detail{font-size:.9rem;color:var(--muted);margin-bottom:.5rem}
    .social-chips{display:flex;flex-wrap:wrap;gap:.5rem}
    .social-chip{background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:.35rem .75rem;font-size:.75rem;font-weight:600;font-family:'JetBrains Mono',monospace;color:var(--accent);transition:all .2s}
    .social-chip:hover{border-color:var(--accent);background:var(--accent);color:white}

    footer{border-top:1px solid var(--border);padding:2rem 1.5rem;font-size:.75rem;font-family:'JetBrains Mono',monospace;color:var(--muted);max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem}

    @media(max-width:768px){
      .dash-hero-inner{grid-template-columns:1fr}
      .stat-row{flex-wrap:wrap;gap:1rem}
      .contact-top{grid-template-columns:1fr}
      .header-nav{display:none}
    }
  </style>
</head>
<body>
  <header>
    <div class="header-inner">
      <span class="header-name mono">{ ${sanitizeHTML(profile.displayName)} }</span>
      <nav class="header-nav">
        <a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a>
      </nav>
      <button class="header-toggle" onclick="toggleTheme()">Toggle Theme</button>
    </div>
  </header>

  <div class="dash-hero" id="about">
    <div class="dash-hero-inner">
      <div class="avatar-wrap">
        ${profile.avatarUrl
          ? `<img src="${profile.avatarUrl}" alt="${sanitizeHTML(profile.displayName)}" class="avatar-img"/>`
          : `<div class="avatar-placeholder">👤</div>`}
        <div class="status-dot"></div>
      </div>
      <div class="hero-text">
        <h1>${sanitizeHTML(profile.displayName)}</h1>
        <div class="role">> ${sanitizeHTML(profile.title)}</div>
        <p>${sanitizeHTML(profile.bio)}</p>
        <div class="stat-row">
          <div class="stat-box"><div class="stat-num">${projects.length}</div><div class="stat-label">Projects</div></div>
          <div class="stat-box"><div class="stat-num">${skills.length}</div><div class="stat-label">Skills</div></div>
          <div class="stat-box"><div class="stat-num">${workExp.length}</div><div class="stat-label">Roles</div></div>
          <div class="stat-box"><div class="stat-num">${certs.length}</div><div class="stat-label">Certs</div></div>
        </div>
      </div>
    </div>
  </div>

  <section id="skills">
    <div class="container">
      <div class="sec-head"><span class="sec-num">01</span><h2 class="sec-title">Technical Proficiency</h2></div>
      <div class="metrics-wrap">${skillBarsHTML}</div>
    </div>
  </section>

  <section id="projects" style="background:var(--surface22,var(--bg))">
    <div class="container">
      <div class="sec-head"><span class="sec-num">02</span><h2 class="sec-title">Projects & Work</h2></div>
      <div class="data-grid">${projectCardsHTML}</div>
    </div>
  </section>

  ${workExp.length > 0 || certs.length > 0 ? `
  <section id="experience">
    <div class="container">
      <div class="sec-head"><span class="sec-num">03</span><h2 class="sec-title">Experience & Certifications</h2></div>
      ${workExp.length > 0 ? `<div class="exp-list">${expHTML}</div>` : ""}
      ${certs.length > 0 ? `<div class="cert-list" style="margin-top:2rem">${certsHTML}</div>` : ""}
    </div>
  </section>` : ""}

  <section id="contact">
    <div class="container">
      <div class="sec-head"><span class="sec-num">04</span><h2 class="sec-title">Contact</h2></div>
      <div class="contact-strip">
        <div class="contact-top">
          <div>
            <h3 style="margin-bottom:1rem">Get In Touch</h3>
            ${contact.email ? `<div class="contact-detail">✉ ${sanitizeHTML(contact.email)}</div>` : ""}
            ${contact.phone ? `<div class="contact-detail">📞 ${sanitizeHTML(contact.phone)}</div>` : ""}
            ${contact.location ? `<div class="contact-detail">📍 ${sanitizeHTML(contact.location)}</div>` : ""}
          </div>
          <div>
            <h4 style="margin-bottom:.75rem;font-size:.9rem">Social Profiles</h4>
            <div class="social-chips">${socialsHTML}</div>
          </div>
        </div>
        ${contact.showContactForm ? `
        <form onsubmit="return false;" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <input type="text" placeholder="Name" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.65rem 1rem;color:var(--text);font-family:inherit;font-size:.875rem"/>
          <input type="email" placeholder="Email" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.65rem 1rem;color:var(--text);font-family:inherit;font-size:.875rem"/>
          <textarea placeholder="Message" rows="3" style="grid-column:span 2;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.65rem 1rem;color:var(--text);font-family:inherit;font-size:.875rem;resize:vertical"></textarea>
          <button type="submit" style="background:var(--grad);color:white;border:none;border-radius:8px;padding:.65rem 1.5rem;font-weight:600;font-size:.875rem;cursor:pointer;width:fit-content">Send →</button>
        </form>` : ""}
      </div>
    </div>
  </section>

  <footer>
    <span>${sanitizeHTML(profile.displayName)} · ${new Date().getFullYear()}</span>
    <span>Built with <a href="https://gitfolio.dev" style="color:var(--accent)">GitFolio</a></span>
  </footer>

  <script>
    function toggleTheme(){
      const h=document.documentElement;
      h.setAttribute('data-theme',h.getAttribute('data-theme')==='dark'?'light':'dark');
    }
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth'});});
    });
    // Animate bars on load
    window.addEventListener('load',()=>{
      document.querySelectorAll('.metric-fill,.pill-fill').forEach(el=>{
        el.style.width='0';
        setTimeout(()=>{el.style.transition='width 1s ease';el.style.width=el.getAttribute('style').match(/width:(\d+%)/)?.[1]||'0';},100);
      });
    });
  </script>
</body>
</html>`;
}
