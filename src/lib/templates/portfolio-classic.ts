import type { PortfolioConfig } from "@/types/portfolio";
import { sanitizeHTML } from "@/lib/utils/sanitize";

/**
 * PORTFOLIO CLASSIC — light, purple accent (Template 3)
 * Bootstrap-inspired light layout, circular skill rings, portfolio filter tabs, testimonial section
 */
export function renderPortfolioClassicTemplate(config: PortfolioConfig): string {
  const { profile, skills, projects, experience, contact } = config;

  const workExp = experience.filter((e) => e.type === "work");
  const edu = experience.filter((e) => e.type === "education");

  // Top 4 skills for circular rings
  const topSkills = skills.slice(0, 4);

  const ringHTML = topSkills.map((s, i) => {
    const hue = [220, 260, 200, 280][i % 4];
    return `
      <div class="ring-wrap">
        <div class="ring" data-pct="${s.level}" data-hue="${hue}">
          <div class="ring-inner">
            <span class="ring-val">0%</span>
          </div>
          <svg class="ring-svg" viewBox="0 0 120 120">
            <circle class="ring-track" cx="60" cy="60" r="52"/>
            <circle class="ring-fill" cx="60" cy="60" r="52" stroke="hsl(${hue},75%,55%)"/>
          </svg>
        </div>
        <span class="ring-label">${sanitizeHTML(s.name)}</span>
      </div>
    `;
  }).join("");

  const allTags = [...new Set(projects.flatMap((p) => p.techStack))].slice(0, 6);
  const filterBtns = ["all", ...allTags.slice(0, 5)].map((t) => `
    <button class="filter-btn" data-filter="${t === "all" ? "all" : sanitizeHTML(t)}">${t === "all" ? "All" : sanitizeHTML(t)}</button>
  `).join("");

  const projectsHTML = projects.slice(0, 6).map((p, i) => {
    const tags = p.techStack.slice(0, 3).map((t) => t.toLowerCase());
    return `
      <div class="porto-card filter-item" data-cat="${tags.join(" ")}">
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${sanitizeHTML(p.name)}" class="porto-img"/>` : `<div class="porto-img porto-ph"><span class="porto-ph-icon">💻</span></div>`}
        <div class="porto-body">
          <h4 class="porto-title">${sanitizeHTML(p.name)}</h4>
          <div class="porto-badges">${p.techStack.slice(0, 3).map((t) => `<span class="badge">${sanitizeHTML(t)}</span>`).join("")}</div>
          <p class="porto-desc">${sanitizeHTML(p.description)}</p>
          <div class="porto-links">
            ${p.liveUrl ? `<a href="${p.liveUrl}" class="porto-link porto-link-primary" target="_blank">Live →</a>` : ""}
            ${p.githubUrl ? `<a href="${p.githubUrl}" class="porto-link" target="_blank">GitHub →</a>` : ""}
          </div>
        </div>
      </div>
    `;
  }).join("");

  const expHTML = [...workExp, ...edu].map((e) => `
    <div class="exp-item">
      <div class="exp-icon">${e.type === "work" ? "💼" : "🎓"}</div>
      <div class="exp-content">
        <h4 class="exp-title">${sanitizeHTML(e.title)}</h4>
        <div class="exp-meta">${sanitizeHTML(e.organization)} <span class="exp-date">· ${e.startDate} – ${e.endDate || "Present"}</span></div>
        ${e.description ? `<p class="exp-desc">${sanitizeHTML(e.description)}</p>` : ""}
      </div>
    </div>
  `).join("");

  const socialsHTML = contact.socialLinks.filter((s) => s.url).map((s) => `
    <a href="${s.url}" class="social-icon" target="_blank" rel="noopener">${sanitizeHTML(s.platform)}</a>
  `).join("");

  const serviceColors = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#0891b2"];
  const serviceIcons = ["🎨", "⚡", "🔧", "📱", "☁️", "🛠️"];
  const servicesHTML = skills.slice(0, 6).map((s, i) => `
    <div class="svc-card">
      <div class="svc-icon" style="color:${serviceColors[i % serviceColors.length]}">${serviceIcons[i % serviceIcons.length]}</div>
      <h4 class="svc-title">${sanitizeHTML(s.name)}</h4>
      <p class="svc-desc">${sanitizeHTML(s.category)} expertise · ${s.level}% proficiency</p>
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitizeHTML(profile.displayName)} — Portfolio</title>
  <meta name="description" content="${sanitizeHTML(profile.bio)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--purple:#3f396d;--purple-light:#5b5ea6;--orange:#f4623a;--text:#444;--muted:#6b7280;--bg:#ffffff;--surface:#f8f9fa;--border:#e5e7eb;--grad:linear-gradient(135deg,#3f396d,#7c3aed);}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{font-family:"Poppins",system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.65}
    a{text-decoration:none;color:inherit}
    img{max-width:100%;display:block}
    .container{max-width:1100px;margin:0 auto;padding:0 1.5rem}

    /* NAV */
    nav{background:white;position:sticky;top:0;z-index:100;border-bottom:1px solid var(--border);box-shadow:0 1px 12px rgba(63,57,109,.08)}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;padding:.875rem 1.5rem;max-width:1100px;margin:0 auto}
    .nav-brand{font-family:"Josefin Sans",sans-serif;font-size:1.5rem;font-weight:700;color:var(--purple)}
    .nav-links{display:flex;gap:.5rem}
    .nav-link{font-size:.85rem;font-weight:500;color:var(--muted);padding:.45rem .9rem;border-radius:6px;transition:all .2s}
    .nav-link:hover{color:var(--purple);background:rgba(63,57,109,.06)}
    .nav-cta{background:var(--grad);color:white;padding:.5rem 1.25rem;border-radius:20px;font-size:.85rem;font-weight:600;transition:opacity .2s}
    .nav-cta:hover{opacity:.85}
    .nav-toggle{display:none;background:none;border:none;cursor:pointer;font-size:1.25rem;color:var(--purple)}

    /* HERO */
    .hero{padding:6rem 1.5rem 4rem;position:relative;overflow:hidden}
    .hero::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(63,57,109,.04) 0%,transparent 60%);pointer-events:none}
    .hero-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
    .hero-eyebrow{font-family:"Josefin Sans",sans-serif;font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;color:var(--orange);margin-bottom:1rem}
    .hero-name{font-family:"Josefin Sans",sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:700;color:var(--purple);margin-bottom:.5rem;line-height:1.1}
    .hero-name .highlight{color:var(--orange)}
    .hero-title{font-size:1rem;color:var(--muted);margin-bottom:1.5rem}
    .hero-bio{font-size:.9rem;color:var(--muted);max-width:50ch;margin-bottom:2.5rem;line-height:1.8}
    .hero-btns{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:2.5rem}
    .btn-primary{background:var(--grad);color:white;padding:.75rem 2rem;border-radius:25px;font-size:.875rem;font-weight:600;transition:all .3s;display:inline-flex;align-items:center;gap:.5rem}
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(63,57,109,.3)}
    .btn-outline{border:2px solid var(--purple);color:var(--purple);padding:.75rem 2rem;border-radius:25px;font-size:.875rem;font-weight:600;transition:all .3s}
    .btn-outline:hover{background:var(--purple);color:white}
    .hero-stats{display:flex;gap:2.5rem}
    .stat-num{font-family:"Josefin Sans",sans-serif;font-size:2rem;font-weight:700;color:var(--purple)}
    .stat-lbl{font-size:.75rem;color:var(--muted)}
    .hero-avatar-wrap{display:flex;justify-content:center;align-items:center}
    .hero-img{width:340px;height:380px;border-radius:50% 30% 50% 30%;object-fit:cover;border:5px solid var(--border);box-shadow:0 20px 60px rgba(63,57,109,.2)}
    .hero-img-ph{width:340px;height:380px;border-radius:50% 30% 50% 30%;background:linear-gradient(135deg,#ede9fe,#ddd6fe);display:flex;align-items:center;justify-content:center;font-size:8rem}

    /* SECTION HEADER */
    .sec{padding:5rem 1.5rem}
    .sec-head{text-align:center;margin-bottom:3.5rem}
    .sec-small{font-family:"Josefin Sans",sans-serif;font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:var(--orange);margin-bottom:.5rem;display:block}
    .sec-title{font-family:"Josefin Sans",sans-serif;font-size:clamp(1.5rem,3vw,2.25rem);font-weight:700;color:var(--purple)}

    /* SERVICES */
    .svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:2rem}
    .svc-card{background:white;border:1px solid var(--border);border-radius:12px;padding:2rem 1.5rem;text-align:center;transition:all .3s;cursor:default}
    .svc-card:hover{border-color:var(--purple-light);transform:translateY(-4px);box-shadow:0 12px 30px rgba(63,57,109,.1)}
    .svc-icon{font-size:2.5rem;margin-bottom:1rem;display:block}
    .svc-title{font-weight:600;font-size:.95rem;color:var(--purple);margin-bottom:.5rem}
    .svc-desc{font-size:.8rem;color:var(--muted)}

    /* SKILLS */
    .skills-layout{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
    .rings-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem}
    .ring-wrap{display:flex;flex-direction:column;align-items:center;gap:.75rem}
    .ring{position:relative;width:100px;height:100px}
    .ring-svg{position:absolute;inset:0;transform:rotate(-90deg)}
    .ring-track,.ring-fill{fill:none;stroke-width:8}
    .ring-track{stroke:#f0e9ff}
    .ring-fill{stroke-dasharray:326.5;stroke-dashoffset:326.5;stroke-linecap:round;transition:stroke-dashoffset 1.5s ease}
    .ring-inner{position:absolute;inset:10px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:white;box-shadow:0 2px 12px rgba(63,57,109,.1)}
    .ring-val{font-family:"Josefin Sans",sans-serif;font-size:.9rem;font-weight:700;color:var(--purple)}
    .ring-label{font-size:.8rem;color:var(--muted);text-align:center;font-weight:500}
    .skill-detail .sec-small{text-align:left}
    .skill-detail .sec-title{text-align:left}
    .skill-detail-text{font-size:.9rem;color:var(--muted);margin:1rem 0 2rem;line-height:1.8}
    .all-skills{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:2rem}
    .skill-pill{background:rgba(63,57,109,.06);color:var(--purple-light);border:1px solid rgba(63,57,109,.15);border-radius:20px;padding:.3rem .85rem;font-size:.75rem;font-weight:500}

    /* PORTFOLIO */
    .filter-btns{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-bottom:2.5rem}
    .filter-btn{background:transparent;border:2px solid var(--border);color:var(--muted);padding:.45rem 1.1rem;border-radius:20px;font-size:.8rem;cursor:pointer;transition:all .2s;font-family:"Poppins",sans-serif}
    .filter-btn:hover,.filter-btn.active{border-color:var(--purple);color:var(--purple);background:rgba(63,57,109,.06)}
    .porto-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}
    .porto-card{background:white;border:1px solid var(--border);border-radius:12px;overflow:hidden;transition:all .3s}
    .porto-card:hover{box-shadow:0 12px 35px rgba(63,57,109,.12);transform:translateY(-3px)}
    .porto-card.hidden{display:none}
    .porto-img{width:100%;height:200px;object-fit:cover;background:linear-gradient(135deg,#ede9fe,#dde6ff)}
    .porto-ph{display:flex;align-items:center;justify-content:center}
    .porto-ph-icon{font-size:4rem}
    .porto-body{padding:1.25rem}
    .porto-title{font-family:"Josefin Sans",sans-serif;font-weight:700;color:var(--purple);font-size:1rem;margin-bottom:.5rem}
    .porto-badges{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.75rem}
    .badge{background:var(--surface);color:var(--muted);border-radius:4px;padding:.15rem .5rem;font-size:.7rem;border:1px solid var(--border)}
    .porto-desc{font-size:.8rem;color:var(--muted);margin-bottom:1rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .porto-links{display:flex;gap:.75rem}
    .porto-link{font-size:.8rem;color:var(--purple-light);font-weight:600;transition:color .2s}
    .porto-link:hover{color:var(--orange)}
    .porto-link-primary{color:var(--orange)}

    /* EXPERIENCE */
    .exp-list{display:flex;flex-direction:column;gap:1.5rem;max-width:700px;margin:0 auto}
    .exp-item{display:flex;gap:1.25rem;align-items:flex-start;background:white;border:1px solid var(--border);border-radius:10px;padding:1.5rem;transition:all .3s}
    .exp-item:hover{border-color:var(--purple-light);box-shadow:0 4px 20px rgba(63,57,109,.08)}
    .exp-icon{font-size:1.75rem;flex-shrink:0;padding:.25rem}
    .exp-title{font-weight:600;color:var(--purple);font-size:.95rem;margin-bottom:.25rem}
    .exp-meta{font-size:.8rem;color:var(--muted);margin-bottom:.5rem}
    .exp-date{color:var(--orange)}
    .exp-desc{font-size:.8rem;color:var(--muted)}

    /* CONTACT */
    .contact-layout{display:grid;grid-template-columns:1fr 1fr;gap:3rem;max-width:900px;margin:0 auto}
    .contact-info .sec-title{text-align:left}
    .contact-info .sec-small{text-align:left}
    .contact-info-list{display:flex;flex-direction:column;gap:.75rem;margin:1.5rem 0;font-size:.875rem;color:var(--muted)}
    .contact-info-list span{display:flex;align-items:center;gap:.5rem}
    .social-links-row{display:flex;flex-wrap:wrap;gap:.5rem}
    .social-icon{border:1px solid var(--border);color:var(--purple-light);padding:.4rem .9rem;border-radius:20px;font-size:.75rem;font-weight:600;transition:all .2s}
    .social-icon:hover{border-color:var(--purple);background:rgba(63,57,109,.06)}
    .cf-form{display:flex;flex-direction:column;gap:1rem}
    .cf-inp{border:1px solid var(--border);border-radius:8px;padding:.75rem 1rem;font-size:.875rem;color:var(--text);font-family:inherit;width:100%;transition:border-color .2s}
    .cf-inp:focus{outline:none;border-color:var(--purple)}
    .cf-ta{border:1px solid var(--border);border-radius:8px;padding:.75rem 1rem;font-size:.875rem;color:var(--text);font-family:inherit;width:100%;resize:vertical;min-height:120px;transition:border-color .2s}
    .cf-ta:focus{outline:none;border-color:var(--purple)}
    .cf-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}

    /* FOOTER */
    footer{background:var(--purple);color:rgba(255,255,255,.7);text-align:center;padding:2.5rem 1.5rem;font-size:.8rem}
    footer a{color:rgba(255,255,255,.9);font-weight:600}
    footer strong{color:white}

    @media(max-width:768px){
      .hero-inner,.skills-layout,.contact-layout{grid-template-columns:1fr}
      .hero-avatar-wrap{display:none}
      .cf-row{grid-template-columns:1fr}
      .nav-links{display:none;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:white;padding:1rem;border-bottom:1px solid var(--border)}
      .nav-links.open{display:flex}
      .nav-toggle{display:block}
    }
  </style>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <span class="nav-brand">${sanitizeHTML(profile.displayName)}</span>
      <div class="nav-links" id="navLinks">
        <a href="#home" class="nav-link">Home</a>
        <a href="#services" class="nav-link">Services</a>
        <a href="#skills" class="nav-link">About</a>
        <a href="#portfolio" class="nav-link">Portfolio</a>
        <a href="#contact" class="nav-link">Contact</a>
      </div>
      <a href="#contact" class="nav-cta d-none-mobile">Contact</a>
      <button class="nav-toggle" onclick="toggleNav()">☰</button>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero" id="home">
    <div class="hero-inner">
      <div>
        <p class="hero-eyebrow">Hello! I Am</p>
        <h1 class="hero-name">${sanitizeHTML(profile.displayName.split(" ")[0])}<br><span class="highlight">${sanitizeHTML(profile.displayName.split(" ").slice(1).join(" ") || profile.displayName)}</span></h1>
        <p class="hero-title">${sanitizeHTML(profile.title)}</p>
        <p class="hero-bio">${sanitizeHTML(profile.bio)}</p>
        ${profile.goals ? `<p class="hero-bio" style="font-style:italic">"${sanitizeHTML(profile.goals)}"</p>` : ""}
        <div class="hero-btns">
          <a href="#contact" class="btn-primary">Hire Me 🤝</a>
          <a href="#portfolio" class="btn-outline">See My Work</a>
        </div>
        <div class="hero-stats">
          <div><div class="stat-num">${projects.length}+</div><div class="stat-lbl">Projects</div></div>
          <div><div class="stat-num">${skills.length}+</div><div class="stat-lbl">Skills</div></div>
          ${workExp.length > 0 ? `<div><div class="stat-num">${workExp.length}+</div><div class="stat-lbl">Roles</div></div>` : ""}
        </div>
      </div>
      <div class="hero-avatar-wrap">
        ${profile.avatarUrl
          ? `<img src="${profile.avatarUrl}" alt="${sanitizeHTML(profile.displayName)}" class="hero-img"/>`
          : `<div class="hero-img-ph">👤</div>`}
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="sec" id="services" style="background:var(--surface)">
    <div class="container">
      <div class="sec-head">
        <span class="sec-small">My Expertise</span>
        <h2 class="sec-title">What I Offer</h2>
      </div>
      <div class="svc-grid">${servicesHTML}</div>
    </div>
  </section>

  <!-- Skills / About -->
  <section class="sec" id="skills">
    <div class="container">
      <div class="skills-layout">
        <div class="rings-grid">${ringHTML}</div>
        <div class="skill-detail">
          <span class="sec-small">My Skills</span>
          <h2 class="sec-title">What I Know Best</h2>
          <p class="skill-detail-text">${sanitizeHTML(profile.bio)}</p>
          <div class="all-skills">
            ${skills.map((s) => `<span class="skill-pill">${sanitizeHTML(s.name)}</span>`).join("")}
          </div>
          <a href="#contact" class="btn-primary">Download CV 📄</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Portfolio -->
  <section class="sec" id="portfolio" style="background:var(--surface)">
    <div class="container">
      <div class="sec-head">
        <span class="sec-small">Creative Work</span>
        <h2 class="sec-title">Check My Portfolio</h2>
      </div>
      <div class="filter-btns">${filterBtns}</div>
      <div class="porto-grid">${projectsHTML || `<p style="text-align:center;color:var(--muted);padding:4rem">No projects yet — add some from the editor.</p>`}</div>
    </div>
  </section>

  <!-- Experience -->
  ${experience.length > 0 ? `
  <section class="sec" id="experience">
    <div class="container">
      <div class="sec-head">
        <span class="sec-small">My Journey</span>
        <h2 class="sec-title">Experience & Education</h2>
      </div>
      <div class="exp-list">${expHTML}</div>
    </div>
  </section>` : ""}

  <!-- Contact -->
  <section class="sec" id="contact" style="background:var(--surface)">
    <div class="container">
      <div class="sec-head">
        <span class="sec-small">Get in Touch</span>
        <h2 class="sec-title">Let's Work Together</h2>
      </div>
      <div class="contact-layout">
        <div class="contact-info">
          <span class="sec-small">Contact Details</span>
          <div class="contact-info-list">
            ${contact.email ? `<span>✉ ${sanitizeHTML(contact.email)}</span>` : ""}
            ${contact.phone ? `<span>📞 ${sanitizeHTML(contact.phone)}</span>` : ""}
            ${contact.location ? `<span>📍 ${sanitizeHTML(contact.location)}</span>` : ""}
          </div>
          <div class="social-links-row">${socialsHTML}</div>
        </div>
        ${contact.showContactForm ? `
        <form class="cf-form" onsubmit="return false;">
          <div class="cf-row">
            <input class="cf-inp" type="text" placeholder="Name"/>
            <input class="cf-inp" type="email" placeholder="Email"/>
          </div>
          <input class="cf-inp" type="text" placeholder="Subject"/>
          <textarea class="cf-ta" placeholder="Your message…" rows="4"></textarea>
          <button type="submit" class="btn-primary">Send Message 🚀</button>
        </form>` : ""}
      </div>
    </div>
  </section>

  <footer>
    <strong>${sanitizeHTML(profile.displayName)}</strong> · © ${new Date().getFullYear()} · Built with <a href="https://gitfolio.dev">GitFolio</a>
  </footer>

  <script>
    // Mobile nav
    function toggleNav(){
      document.getElementById('navLinks').classList.toggle('open');
    }

    // Filter
    document.querySelectorAll('.filter-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const f=btn.dataset.filter;
        document.querySelectorAll('.filter-item').forEach(card=>{
          if(f==='all'||card.dataset.cat.includes(f.toLowerCase())){card.classList.remove('hidden');}
          else{card.classList.add('hidden');}
        });
      });
    });
    document.querySelector('[data-filter="all"]')?.classList.add('active');

    // Circular rings animation
    function animateRings(){
      document.querySelectorAll('.ring').forEach(ring=>{
        const pct=parseInt(ring.dataset.pct)||0;
        const fill=ring.querySelector('.ring-fill');
        const val=ring.querySelector('.ring-val');
        const circumference=326.5;
        const offset=circumference*(1-pct/100);
        fill.style.strokeDashoffset=offset;
        let cur=0;
        const timer=setInterval(()=>{
          cur+=1;
          if(cur>=pct){cur=pct;clearInterval(timer);}
          val.textContent=cur+'%';
        },15);
      });
    }
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){animateRings();obs.disconnect();}},{threshold:.3});
    const skilSec=document.getElementById('skills');
    if(skilSec)obs.observe(skilSec);

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{
        e.preventDefault();
        const t=document.querySelector(a.getAttribute('href'));
        if(t)t.scrollIntoView({behavior:'smooth'});
        document.getElementById('navLinks').classList.remove('open');
      });
    });
  </script>
</body>
</html>`;
}
