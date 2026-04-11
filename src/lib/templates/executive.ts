import type { PortfolioConfig } from "@/types/portfolio";
import { sanitizeHTML } from "@/lib/utils/sanitize";

/** EXECUTIVE — navy + gold, professional pitch-oriented for business/entrepreneurs */
export function renderExecutiveTemplate(config: PortfolioConfig): string {
  const { profile, skills, projects, experience, contact, settings } = config;
  const dark = settings.darkMode;

  const workExp = experience.filter((e) => e.type === "work").slice(0, 5);
  const edu = experience.filter((e) => e.type === "education").slice(0, 3);
  const certs = experience.filter((e) => e.type === "certification").slice(0, 4);

  const topSkills = skills.slice(0, 6);

  const skillsHTML = topSkills.map((s) => `
    <div class="exec-skill">
      <div class="exec-skill-top">
        <span>${sanitizeHTML(s.name)}</span>
        <span class="exec-skill-pct">${s.level}%</span>
      </div>
      <div class="exec-bar"><div class="exec-bar-fill" style="width:${s.level}%;background:${s.color || "var(--gold)"}"></div></div>
    </div>
  `).join("");

  const projectsHTML = projects.slice(0, 4).map((p) => `
    <div class="exec-proj">
      ${p.imageUrl ? `<div class="exec-proj-img" style="background-image:url('${p.imageUrl}')"></div>` : ""}
      <div class="exec-proj-content">
        <h4>${sanitizeHTML(p.name)}</h4>
        <p>${sanitizeHTML(p.description)}</p>
        <div class="exec-proj-tags">${p.techStack.slice(0, 4).map((t) => `<span>${sanitizeHTML(t)}</span>`).join("")}</div>
        <div class="exec-proj-links">
          ${p.liveUrl ? `<a href="${p.liveUrl}" class="exec-btn" target="_blank">View Project ↗</a>` : ""}
        </div>
      </div>
    </div>
  `).join("");

  const expHTML = workExp.map((e) => `
    <div class="exec-exp">
      <div class="exec-exp-date">${e.startDate} – ${e.endDate || "Present"}</div>
      <div class="exec-exp-content">
        <div class="exec-exp-title">${sanitizeHTML(e.title)}</div>
        <div class="exec-exp-org">${sanitizeHTML(e.organization)}</div>
        ${e.description ? `<p>${sanitizeHTML(e.description)}</p>` : ""}
      </div>
    </div>
  `).join("");

  const socialsHTML = contact.socialLinks.filter((s) => s.url).map((s) => `
    <a href="${s.url}" class="exec-social" target="_blank" rel="noopener">${sanitizeHTML(s.platform)}</a>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en" data-theme="${dark ? "dark" : "light"}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${sanitizeHTML(profile.displayName)} — ${sanitizeHTML(profile.title)}</title>
  <meta name="description" content="${sanitizeHTML(profile.bio)}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet"/>
  <style>
    :root{--bg:#0d1b2a;--surface:#112236;--surface2:#0f2033;--text:#f0e6d3;--muted:#9ca8b3;--border:#1e3a5a;--gold:#d4af37;--gold2:#b8962e;--grad:linear-gradient(135deg,#d4af37,#f0d070);}
    [data-theme="light"]{--bg:#f8f4ee;--surface:#ffffff;--surface2:#f0ead8;--text:#1a1208;--muted:#6b5d4e;--border:#ddd3c0;--gold:#b8962e;--gold2:#9a7c25;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Lato',sans-serif;background:var(--bg);color:var(--text);line-height:1.65;min-height:100vh}
    h1,h2,h3,h4{font-family:'Cormorant Garamond',Georgia,serif}
    a{color:inherit;text-decoration:none}
    .container{max-width:1100px;margin:0 auto;padding:0 2rem}

    /* NAV */
    nav{background:var(--bg);border-bottom:1px solid var(--gold);position:sticky;top:0;z-index:100}
    .nav-inner{max-width:1100px;margin:0 auto;padding:.875rem 2rem;display:flex;align-items:center;justify-content:space-between}
    .nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:.05em}
    .nav-links{display:flex;gap:2.5rem}
    .nav-links a{font-size:.8rem;text-transform:uppercase;letter-spacing:.15em;color:var(--muted);transition:color .2s;font-weight:700}
    .nav-links a:hover{color:var(--gold)}
    .nav-toggle{background:none;border:1px solid var(--gold);padding:.375rem .875rem;color:var(--gold);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;font-family:'Lato',sans-serif;font-weight:700;transition:all .2s}
    .nav-toggle:hover{background:var(--gold);color:var(--bg)}

    /* HERO */
    .exec-hero{padding:7rem 2rem 5rem;position:relative;overflow:hidden;border-bottom:1px solid var(--border)}
    .exec-hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -20%,rgba(212,175,55,.12) 0%,transparent 70%);pointer-events:none}
    .exec-hero-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 2fr;gap:4rem;align-items:center}
    .exec-avatar-wrap{display:flex;flex-direction:column;align-items:center;gap:1.5rem}
    .exec-avatar{width:200px;height:200px;border-radius:4px;object-fit:cover;border:3px solid var(--gold);box-shadow:0 0 40px rgba(212,175,55,.2)}
    .exec-avatar-placeholder{width:200px;height:200px;border-radius:4px;background:var(--surface2);border:3px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:4rem}
    .exec-contact-mini{text-align:center;font-size:.75rem;color:var(--muted);line-height:2}
    .exec-hero-text .eyebrow{font-size:.7rem;text-transform:uppercase;letter-spacing:.25em;color:var(--gold);margin-bottom:1.5rem;display:flex;align-items:center;gap:.75rem}
    .exec-hero-text .eyebrow::before,.exec-hero-text .eyebrow::after{content:'';display:inline-block;width:30px;height:1px;background:var(--gold)}
    .exec-hero-text h1{font-size:clamp(2.75rem,5vw,4.5rem);font-weight:700;line-height:1.1;letter-spacing:-.01em;margin-bottom:1.25rem}
    .exec-hero-text h1 .role{display:block;font-style:italic;font-weight:500;font-size:clamp(1.25rem,2.5vw,2rem);color:var(--muted);margin-top:.5rem}
    .exec-hero-text .pitch{font-size:1.05rem;color:var(--muted);max-width:55ch;margin-bottom:2rem;font-weight:300;line-height:1.7}
    .exec-cta{display:flex;gap:1rem;flex-wrap:wrap}
    .exec-btn{background:transparent;border:1px solid var(--gold);color:var(--gold);padding:.65rem 1.75rem;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;font-weight:700;cursor:pointer;transition:all .3s;font-family:'Lato',sans-serif;display:inline-block}
    .exec-btn:hover,.exec-btn-fill:hover{opacity:.85}
    .exec-btn-fill{background:var(--grad);border:1px solid var(--gold);color:var(--bg);padding:.65rem 1.75rem;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;font-weight:700;cursor:pointer;display:inline-block;transition:opacity .2s}

    /* SECTIONS */
    section{padding:5rem 2rem}
    .sec-divider{display:flex;align-items:center;gap:1.5rem;margin-bottom:3rem}
    .sec-divider h2{font-size:2rem;font-weight:700;letter-spacing:-.01em;white-space:nowrap}
    .sec-divider::after{content:'';flex:1;height:1px;background:linear-gradient(to right,var(--gold),transparent)}
    .sec-divider .sec-num{font-size:.7rem;color:var(--gold);letter-spacing:.15em;text-transform:uppercase;white-space:nowrap}

    /* SKILLS */
    .exec-skills{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}
    .exec-skill{}
    .exec-skill-top{display:flex;justify-content:space-between;font-size:.85rem;font-weight:700;margin-bottom:.5rem}
    .exec-skill-pct{color:var(--gold)}
    .exec-bar{height:3px;background:var(--border);border-radius:0}
    .exec-bar-fill{height:100%;transition:width 1s ease}

    /* PROJECTS */
    .exec-projects{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}
    .exec-proj{background:var(--surface);border:1px solid var(--border);border-radius:2px;overflow:hidden;transition:border-color .3s}
    .exec-proj:hover{border-color:var(--gold)}
    .exec-proj-img{height:160px;background:var(--surface2);background-size:cover;background-position:center}
    .exec-proj-content{padding:1.5rem}
    .exec-proj-content h4{font-size:1.1rem;font-weight:700;margin-bottom:.5rem}
    .exec-proj-content p{font-size:.85rem;color:var(--muted);margin-bottom:1rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .exec-proj-tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:1rem}
    .exec-proj-tags span{font-size:.65rem;text-transform:uppercase;letter-spacing:.08em;color:var(--gold);border:1px solid var(--gold);padding:.15rem .5rem}
    .exec-proj-links{}

    /* EXP */
    .exec-exp-list{display:flex;flex-direction:column;gap:0}
    .exec-exp{display:grid;grid-template-columns:10rem 1fr;gap:2rem;padding:1.75rem 0;border-bottom:1px solid var(--border)}
    .exec-exp:last-child{border-bottom:none}
    .exec-exp-date{font-size:.75rem;color:var(--muted);letter-spacing:.05em;line-height:1.4;padding-top:.15rem}
    .exec-exp-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;margin-bottom:.25rem}
    .exec-exp-org{font-size:.85rem;color:var(--gold);font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin-bottom:.5rem}
    .exec-exp-content p{font-size:.85rem;color:var(--muted)}

    /* CONTACT */
    .exec-contact{max-width:700px}
    .exec-contact-body{background:var(--surface);border:1px solid var(--gold);padding:3rem;margin-bottom:2rem}
    .exec-contact-body p{color:var(--muted);margin-bottom:1.75rem;font-size:1rem}
    .exec-contact-detail{display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.75rem;font-size:.9rem;color:var(--muted)}
    .exec-socials{display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:2rem}
    .exec-social{font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;font-weight:700;border-bottom:1px solid var(--gold);color:var(--gold);padding-bottom:.1rem;transition:opacity .2s}
    .exec-social:hover{opacity:.7}
    .exec-contact-form{display:flex;flex-direction:column;gap:1rem}
    .exec-cf-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .exec-input{background:var(--bg);border:1px solid var(--border);padding:.7rem 1rem;font-size:.875rem;color:var(--text);font-family:'Lato',sans-serif;width:100%;transition:border-color .2s}
    .exec-input:focus{outline:none;border-color:var(--gold)}
    .exec-textarea{background:var(--bg);border:1px solid var(--border);padding:.7rem 1rem;font-size:.875rem;color:var(--text);font-family:'Lato',sans-serif;width:100%;resize:vertical;min-height:120px;transition:border-color .2s}
    .exec-textarea:focus{outline:none;border-color:var(--gold)}

    footer{border-top:1px solid var(--gold);padding:1.5rem 2rem;display:flex;justify-content:space-between;align-items:center;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);flex-wrap:wrap;gap:.5rem}

    @media(max-width:768px){
      .exec-hero-inner{grid-template-columns:1fr}
      .exec-avatar-wrap{align-items:flex-start}
      .exec-exp{grid-template-columns:1fr}
      .exec-exp-date{display:none}
      .nav-links{display:none}
    }
  </style>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <div class="nav-logo">${sanitizeHTML(profile.displayName)}</div>
      <div class="nav-links">
        <a href="#about">About</a>
        <a href="#expertise">Expertise</a>
        <a href="#ventures">Ventures</a>
        <a href="#career">Career</a>
        <a href="#contact">Contact</a>
      </div>
      <button class="nav-toggle" onclick="toggleTheme()">Toggle Theme</button>
    </div>
  </nav>

  <section class="exec-hero" id="about">
    <div class="exec-hero-bg"></div>
    <div class="exec-hero-inner container">
      <div class="exec-avatar-wrap">
        ${profile.avatarUrl
          ? `<img src="${profile.avatarUrl}" alt="${sanitizeHTML(profile.displayName)}" class="exec-avatar"/>`
          : `<div class="exec-avatar-placeholder">👔</div>`}
        <div class="exec-contact-mini">
          ${contact.email ? `<div>${sanitizeHTML(contact.email)}</div>` : ""}
          ${contact.location ? `<div>${sanitizeHTML(contact.location)}</div>` : ""}
        </div>
      </div>
      <div class="exec-hero-text">
        <div class="eyebrow">${sanitizeHTML(profile.title)}</div>
        <h1>
          ${sanitizeHTML(profile.displayName)}
          <span class="role">Building what matters.</span>
        </h1>
        <p class="pitch">${sanitizeHTML(profile.bio)}</p>
        ${profile.goals ? `<p class="pitch" style="font-style:italic">"${sanitizeHTML(profile.goals)}"</p>` : ""}
        <div class="exec-cta">
          <a href="#contact" class="exec-btn-fill">Let's Connect</a>
          <a href="#ventures" class="exec-btn">View Work</a>
        </div>
      </div>
    </div>
  </section>

  <section id="expertise" style="background:var(--surface)">
    <div class="container">
      <div class="sec-divider"><h2>Core Expertise</h2></div>
      <div class="exec-skills">${skillsHTML}</div>
    </div>
  </section>

  <section id="ventures">
    <div class="container">
      <div class="sec-divider"><h2>Ventures & Projects</h2></div>
      <div class="exec-projects">${projectsHTML}</div>
    </div>
  </section>

  ${workExp.length > 0 ? `
  <section id="career" style="background:var(--surface)">
    <div class="container">
      <div class="sec-divider"><h2>Career History</h2></div>
      <div class="exec-exp-list">${expHTML}</div>
    </div>
  </section>` : ""}

  <section id="contact">
    <div class="container">
      <div class="sec-divider"><h2>Get In Touch</h2></div>
      <div class="exec-contact">
        <div class="exec-contact-body">
          <p>Ready to explore opportunities together? I'd welcome the conversation.</p>
          <div class="exec-contact-detail">
            ${contact.email ? `<span>✉ ${sanitizeHTML(contact.email)}</span>` : ""}
            ${contact.phone ? `<span>✆ ${sanitizeHTML(contact.phone)}</span>` : ""}
            ${contact.location ? `<span>◎ ${sanitizeHTML(contact.location)}</span>` : ""}
          </div>
          <div class="exec-socials">${socialsHTML}</div>
          ${contact.showContactForm ? `
          <form class="exec-contact-form" onsubmit="return false;">
            <div class="exec-cf-row">
              <input class="exec-input" type="text" placeholder="Your Name"/>
              <input class="exec-input" type="email" placeholder="Your Email"/>
            </div>
            <textarea class="exec-textarea" placeholder="Your message…"></textarea>
            <button type="submit" class="exec-btn-fill" style="width:fit-content">Send →</button>
          </form>` : ""}
        </div>
      </div>
    </div>
  </section>

  <footer>
    <span>${sanitizeHTML(profile.displayName)} · ${new Date().getFullYear()}</span>
    <span>Built with <a href="https://gitfolio.dev" style="color:var(--gold)">GitFolio</a></span>
  </footer>

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
