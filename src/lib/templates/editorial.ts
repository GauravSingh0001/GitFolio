import type { PortfolioConfig } from "@/types/portfolio";
import { sanitizeHTML } from "@/lib/utils/sanitize";

/** EDITORIAL — warm serif, storytelling layout for writers & content creators */
export function renderEditorialTemplate(config: PortfolioConfig): string {
  const { profile, skills, projects, experience, contact, settings } = config;
  const dark = settings.darkMode;

  const workExp = experience.filter((e) => e.type === "work");
  const edu = experience.filter((e) => e.type === "education");
  const certs = experience.filter((e) => e.type === "certification");

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const otherProjects = projects.filter((p) => !p.featured).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  const skillPillsHTML = skills.slice(0, 12).map((s) => `
    <span class="skill-tag">${sanitizeHTML(s.name)}</span>
  `).join("");

  const projectsHTML = displayProjects.map((p, i) => `
    <article class="story-card ${i === 0 ? "story-hero" : ""}">
      ${p.imageUrl ? `<div class="story-img" style="background-image:url('${p.imageUrl}')"></div>` : ""}
      <div class="story-body">
        <div class="story-meta">
          ${p.techStack.slice(0, 2).map((t) => `<span class="story-cat">${sanitizeHTML(t)}</span>`).join("")}
        </div>
        <h3>${sanitizeHTML(p.name)}</h3>
        <p>${sanitizeHTML(p.description)}</p>
        <div class="story-links">
          ${p.liveUrl ? `<a href="${p.liveUrl}" class="read-more" target="_blank">Read more →</a>` : ""}
          ${p.githubUrl ? `<a href="${p.githubUrl}" class="source-link" target="_blank">Source ↗</a>` : ""}
        </div>
      </div>
    </article>
  `).join("");

  const expHTML = workExp.map((e) => `
    <div class="resume-item">
      <div class="resume-dates">${e.startDate}<br>–&nbsp;${e.endDate || "Now"}</div>
      <div class="resume-content">
        <h4>${sanitizeHTML(e.title)}</h4>
        <div class="resume-org">${sanitizeHTML(e.organization)}</div>
        ${e.description ? `<p>${sanitizeHTML(e.description)}</p>` : ""}
      </div>
    </div>
  `).join("");

  const eduHTML = edu.map((e) => `
    <div class="resume-item">
      <div class="resume-dates">${e.startDate}<br>–&nbsp;${e.endDate || "Now"}</div>
      <div class="resume-content">
        <h4>${sanitizeHTML(e.title)}</h4>
        <div class="resume-org">${sanitizeHTML(e.organization)}</div>
      </div>
    </div>
  `).join("");

  const socialsHTML = contact.socialLinks.filter((s) => s.url).map((s) => `
    <a href="${s.url}" class="social-link" target="_blank" rel="noopener">${sanitizeHTML(s.platform)}</a>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en" data-theme="${dark ? "dark" : "light"}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${sanitizeHTML(profile.displayName)} — ${sanitizeHTML(profile.title)}</title>
  <meta name="description" content="${sanitizeHTML(profile.bio)}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:wght@300;400;500&family=DM+Mono&display=swap" rel="stylesheet"/>
  <style>
    :root{--bg:#fffbf5;--surface:#ffffff;--surface2:#fef3c7;--text:#1c1917;--muted:#78716c;--border:#e7e5e4;--accent:#d97706;--accent2:#b45309;--grad:linear-gradient(135deg,#d97706,#f59e0b);}
    [data-theme="dark"]{--bg:#1c1412;--surface:#231e1b;--surface2:#2d2420;--text:#fafaf9;--muted:#a8a29e;--border:#3d3533;--accent:#f59e0b;--accent2:#d97706;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Source Serif 4',Georgia,serif;background:var(--bg);color:var(--text);line-height:1.7;min-height:100vh}
    h1,h2,h3,.display{font-family:'Playfair Display',Georgia,serif}
    a{color:inherit;text-decoration:none}
    .mono{font-family:'DM Mono',monospace}
    .container{max-width:900px;margin:0 auto;padding:0 2rem}
    .wide{max-width:1100px;margin:0 auto;padding:0 2rem}

    /* MASTHEAD */
    .masthead{border-bottom:3px double var(--border);padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
    .masthead-name{font-family:'Playfair Display',Georgia,serif;font-size:1.75rem;font-weight:700;letter-spacing:-.02em}
    .masthead-role{font-family:'DM Mono',monospace;font-size:.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:.12em}
    .masthead-nav{display:flex;gap:1.5rem;flex-wrap:wrap}
    .masthead-nav a{font-family:'DM Mono',monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);transition:color .2s}
    .masthead-nav a:hover{color:var(--accent)}
    .theme-toggle{font-family:'DM Mono',monospace;font-size:.7rem;background:none;border:1px solid var(--border);padding:.25rem .6rem;border-radius:4px;cursor:pointer;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;transition:all .2s}
    .theme-toggle:hover{border-color:var(--accent);color:var(--accent)}

    /* DATELINE / HERO */
    .hero{padding:4rem 2rem;max-width:900px;margin:0 auto;border-bottom:1px solid var(--border)}
    .dateline{font-family:'DM Mono',monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;color:var(--muted);margin-bottom:1.5rem;display:flex;align-items:center;gap:.75rem}
    .dateline::before{content:'';display:inline-block;width:24px;height:1px;background:var(--accent)}
    .hero h1{font-size:clamp(2.25rem,5vw,4rem);line-height:1.15;letter-spacing:-.02em;margin-bottom:1.25rem;font-style:italic}
    .hero h1 em{font-style:normal;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .hero-lede{font-size:1.2rem;color:var(--muted);max-width:60ch;margin-bottom:1.5rem;font-weight:300}
    .hero-goals{font-size:1rem;color:var(--text);font-style:italic;border-left:3px solid var(--accent);padding-left:1rem;margin-bottom:2rem;max-width:55ch}
    .hero-meta{display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap}
    .avatar-sm{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid var(--accent)}
    .hero-contact{font-family:'DM Mono',monospace;font-size:.75rem;color:var(--muted)}
    .hero-cta{font-family:'DM Mono',monospace;font-size:.75rem;text-decoration:underline;text-underline-offset:3px;color:var(--accent)}

    /* SKILL TAGS */
    .skills-bar{border-bottom:1px solid var(--border);padding:1.25rem 2rem;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;max-width:900px;margin:0 auto}
    .skills-label{font-family:'DM Mono',monospace;font-size:.65rem;text-transform:uppercase;letter-spacing:.15em;color:var(--muted);margin-right:.5rem;white-space:nowrap}
    .skill-tag{background:var(--surface2);border:1px solid var(--border);border-radius:2px;padding:.2rem .6rem;font-size:.8rem;color:var(--text);font-family:'DM Mono',monospace}

    /* STORIES / PROJECTS */
    .section{padding:3rem 0;border-bottom:1px solid var(--border);max-width:900px;margin:0 auto;padding-left:2rem;padding-right:2rem}
    .section-head{display:flex;align-items:baseline;gap:1rem;margin-bottom:2rem}
    .section-head h2{font-size:1.5rem;letter-spacing:-.02em}
    .section-head::after{content:'';flex:1;height:1px;background:var(--border)}
    .story-grid{display:grid;gap:2rem}
    .story-card{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start}
    .story-card.story-hero{grid-template-columns:1fr}
    .story-img{height:220px;background:var(--surface2);background-size:cover;background-position:center;border-radius:4px}
    .story-hero .story-img{height:300px}
    .story-meta{display:flex;gap:.5rem;margin-bottom:.75rem}
    .story-cat{font-family:'DM Mono',monospace;font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);border:1px solid var(--accent);padding:.15rem .5rem;border-radius:2px}
    .story-body h3{font-size:1.25rem;line-height:1.3;margin-bottom:.5rem;letter-spacing:-.01em}
    .story-body p{color:var(--muted);font-size:.9rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:1rem}
    .story-links{display:flex;gap:1rem;align-items:center}
    .read-more{font-family:'DM Mono',monospace;font-size:.75rem;color:var(--accent);text-decoration:underline;text-underline-offset:3px}
    .source-link{font-family:'DM Mono',monospace;font-size:.75rem;color:var(--muted)}

    /* RESUME */
    .resume-grid{display:flex;flex-direction:column;gap:1.5rem}
    .resume-item{display:grid;grid-template-columns:7rem 1fr;gap:1.5rem;padding-bottom:1.5rem;border-bottom:1px dashed var(--border)}
    .resume-item:last-child{border-bottom:none}
    .resume-dates{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--muted);line-height:1.4;padding-top:.2rem}
    .resume-content h4{font-size:1rem;font-weight:700;font-family:'Playfair Display',serif;margin-bottom:.2rem}
    .resume-org{font-size:.85rem;color:var(--accent);font-style:italic;margin-bottom:.5rem}
    .resume-content p{font-size:.875rem;color:var(--muted)}

    /* CONTACT */
    .contact-section{padding:3rem 2rem;max-width:900px;margin:0 auto}
    .contact-section h2{font-size:2rem;letter-spacing:-.02em;margin-bottom.5rem;margin-bottom:.5rem;font-style:italic}
    .contact-section p{color:var(--muted);max-width:55ch;margin-bottom:1.75rem}
    .contact-details{display:flex;flex-direction:column;gap:.6rem;margin-bottom:2rem;font-family:'DM Mono',monospace;font-size:.85rem;color:var(--muted)}
    .social-links{display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:2rem}
    .social-link{font-family:'DM Mono',monospace;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--accent);color:var(--accent);padding-bottom:.1rem;transition:opacity .2s}
    .social-link:hover{opacity:.7}
    .contact-form{display:flex;flex-direction:column;gap:1rem;max-width:500px}
    .cf-input{background:var(--surface);border:none;border-bottom:1px solid var(--border);padding:.65rem 0;font-size:.9rem;color:var(--text);font-family:inherit;width:100%;transition:border-color .2s}
    .cf-input:focus{outline:none;border-bottom-color:var(--accent)}
    .cf-textarea{background:var(--surface);border-bottom:1px solid var(--border);padding:.65rem 0;font-size:.9rem;color:var(--text);font-family:inherit;width:100%;resize:none;min-height:120px;border-left:none;border-right:none;border-top:none}
    .cf-textarea:focus{outline:none;border-bottom-color:var(--accent)}
    .cf-submit{font-family:'DM Mono',monospace;font-size:.75rem;text-transform:uppercase;letter-spacing:.12em;background:var(--text);color:var(--bg);border:none;padding:.75rem 1.5rem;cursor:pointer;width:fit-content;transition:opacity .2s}
    .cf-submit:hover{opacity:.8}

    footer{border-top:3px double var(--border);padding:1.25rem 2rem;font-family:'DM Mono',monospace;font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem}

    @media(max-width:640px){
      .story-card{grid-template-columns:1fr}
      .resume-item{grid-template-columns:1fr}
      .resume-dates{display:none}
      .masthead-nav{display:none}
    }
  </style>
</head>
<body>
  <header class="masthead">
    <div>
      <div class="masthead-name">${sanitizeHTML(profile.displayName)}</div>
      <div class="masthead-role">${sanitizeHTML(profile.title)}</div>
    </div>
    <nav class="masthead-nav">
      <a href="#about">About</a>
      <a href="#projects">Work</a>
      <a href="#experience">Experience</a>
      <a href="#contact">Contact</a>
    </nav>
    <button class="theme-toggle" onclick="toggleTheme()">${dark ? "Light" : "Dark"} Mode</button>
  </header>

  <section class="hero" id="about">
    <div class="dateline">${sanitizeHTML(profile.title)}</div>
    <h1>I'm <em>${sanitizeHTML(profile.displayName)}</em>,<br>and I tell stories that matter.</h1>
    <p class="hero-lede">${sanitizeHTML(profile.bio)}</p>
    ${profile.goals ? `<blockquote class="hero-goals">${sanitizeHTML(profile.goals)}</blockquote>` : ""}
    <div class="hero-meta">
      ${profile.avatarUrl ? `<img src="${profile.avatarUrl}" alt="${sanitizeHTML(profile.displayName)}" class="avatar-sm"/>` : ""}
      <div>
        ${contact.email ? `<div class="hero-contact">${sanitizeHTML(contact.email)}</div>` : ""}
        <a href="#contact" class="hero-cta">Get in touch →</a>
      </div>
    </div>
  </section>

  <div class="skills-bar">
    <span class="skills-label">Expertise</span>
    ${skillPillsHTML}
  </div>

  <section class="section" id="projects">
    <div class="section-head"><h2>Selected Work</h2></div>
    <div class="story-grid">${projectsHTML}</div>
  </section>

  ${workExp.length > 0 ? `
  <section class="section" id="experience">
    <div class="section-head"><h2>Experience</h2></div>
    <div class="resume-grid">${expHTML}</div>
  </section>` : ""}

  ${edu.length > 0 ? `
  <section class="section">
    <div class="section-head"><h2>Education</h2></div>
    <div class="resume-grid">${eduHTML}</div>
  </section>` : ""}

  <section class="contact-section" id="contact">
    <h2>Let's Connect</h2>
    <p>Have a project in mind or just want to say hello? I'd love to hear from you.</p>
    <div class="contact-details">
      ${contact.email ? `<span>✉ ${sanitizeHTML(contact.email)}</span>` : ""}
      ${contact.phone ? `<span>✆ ${sanitizeHTML(contact.phone)}</span>` : ""}
      ${contact.location ? `<span>◎ ${sanitizeHTML(contact.location)}</span>` : ""}
    </div>
    <div class="social-links">${socialsHTML}</div>
    ${contact.showContactForm ? `
    <form class="contact-form" onsubmit="return false;">
      <input class="cf-input" type="text" placeholder="Your name"/>
      <input class="cf-input" type="email" placeholder="Your email"/>
      <textarea class="cf-textarea" placeholder="Your message…"></textarea>
      <button class="cf-submit" type="submit">Send Message</button>
    </form>` : ""}
  </section>

  <footer>
    <span>${sanitizeHTML(profile.displayName)} · ${new Date().getFullYear()}</span>
    <span>Built with <a href="https://gitfolio.dev" style="color:var(--accent)">GitFolio</a></span>
  </footer>

  <script>
    function toggleTheme(){
      const h=document.documentElement;
      const t=h.getAttribute('data-theme');
      h.setAttribute('data-theme',t==='dark'?'light':'dark');
      document.querySelector('.theme-toggle').textContent=(t==='dark'?'Dark':'Light')+' Mode';
    }
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{
        e.preventDefault();
        const t=document.querySelector(a.getAttribute('href'));
        if(t) t.scrollIntoView({behavior:'smooth'});
      });
    });
  </script>
</body>
</html>`;
}
