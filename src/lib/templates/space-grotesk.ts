import type { PortfolioConfig } from "@/types/portfolio";
import { sanitizeHTML } from "@/lib/utils/sanitize";

/**
 * SPACE GROTESK — dark developer portfolio (inspired by Template 1)
 * Colors: bg #1a1a1a · surface #242424 · accent #25ab75
 * Font: Space Grotesk  |  Sections: Hero · About/Skills · Qualification · Services · Projects · Contact
 */
export function renderSpaceGroteskTemplate(config: PortfolioConfig): string {
  const { profile, skills, projects, experience, contact, settings } = config;

  const workExp = experience.filter((e) => e.type === "work");
  const edu = experience.filter((e) => e.type === "education");

  // Skills split by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const skillColsHTML = Object.entries(skillsByCategory)
    .slice(0, 4)
    .map(([cat, items]) => `
      <div class="skills__content">
        <h4 class="skills__subtitle">${sanitizeHTML(cat)}</h4>
        <ul class="skills__list">
          ${items.map((s) => `
            <li class="skills__item">
              <i class="ri-arrow-right-s-fill" style="color:${s.color || "var(--accent)"}"></i>
              ${sanitizeHTML(s.name)}
              <span class="skill-pct">${s.level}%</span>
            </li>`).join("")}
        </ul>
      </div>
    `).join("");

  const workExpHTML = workExp.map((e) => `
    <div class="qualification__item">
      <h3 class="qualification__title">${sanitizeHTML(e.title)}</h3>
      <h4 class="qualification__org">${sanitizeHTML(e.organization)}</h4>
      ${e.description ? `<p class="qualification__description">${sanitizeHTML(e.description)}</p>` : ""}
      <span class="qualification__date">${e.startDate} – ${e.endDate || "Present"}</span>
    </div>
  `).join("");

  const eduHTML = edu.map((e) => `
    <div class="qualification__item">
      <h3 class="qualification__title">${sanitizeHTML(e.title)}</h3>
      <h4 class="qualification__org">${sanitizeHTML(e.organization)}</h4>
      ${e.description ? `<p class="qualification__description">${sanitizeHTML(e.description)}</p>` : ""}
      <span class="qualification__date">${e.startDate} – ${e.endDate || "Present"}</span>
    </div>
  `).join("");

  const serviceColors = ["#4299e1", "#9f7aea", "#48bb78", "#319795", "#ecc94b", "#5a67d8", "#d45757", "#00ccff"];
  const serviceIcons = ["ri-layout-4-fill", "ri-pen-nib-fill", "ri-code-s-slash-line", "ri-smartphone-line", "ri-share-fill", "ri-file-fill", "ri-palette-line", "ri-lightbulb-flash-fill"];

  // Skills as services (reuse top skills as service highlights)
  const topSkillsForServices = skills.slice(0, 8);
  const servicesHTML = topSkillsForServices.map((s, i) => `
    <div class="service__card">
      <i class="${serviceIcons[i % serviceIcons.length]} service__icon" style="color:${serviceColors[i % serviceColors.length]}"></i>
      <h3 class="service__title">${sanitizeHTML(s.name)}</h3>
      <p class="service__desc">${sanitizeHTML(s.category)} · ${s.level}% proficiency</p>
    </div>
  `).join("");

  const projectsHTML = projects.slice(0, 6).map((p) => `
    <div class="project__content">
      ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${sanitizeHTML(p.name)}" class="project__img"/>` : `<div class="project__img-ph"><i class="ri-code-s-slash-line"></i></div>`}
      <h3 class="project__title">${sanitizeHTML(p.name)}</h3>
      <p class="project__description">${sanitizeHTML(p.description)}</p>
      <div class="project__tech">${p.techStack.slice(0, 4).map((t) => `<span class="tech-tag">${sanitizeHTML(t)}</span>`).join("")}</div>
      <div class="project__links">
        ${p.liveUrl ? `<a href="${p.liveUrl}" class="project__link" target="_blank">Live <i class="ri-arrow-right-line"></i></a>` : ""}
        ${p.githubUrl ? `<a href="${p.githubUrl}" class="project__link" target="_blank">GitHub <i class="ri-arrow-right-line"></i></a>` : ""}
      </div>
    </div>
  `).join("");

  const socialsHTML = contact.socialLinks.filter((s) => s.url).map((s) => `
    <li class="footer__social-item">
      <a href="${s.url}" target="_blank" class="footer__social-link">${sanitizeHTML(s.platform)}</a>
    </li>
  `).join("");

  const typewriterRoles = [profile.title, ...skills.slice(0, 3).map((s) => s.name + " Developer")];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitizeHTML(profile.displayName)} Portfolio</title>
  <meta name="description" content="${sanitizeHTML(profile.bio)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
  <style>
    :root{--accent:#25ab75;--accent-dark:#208c61;--bg:#1a1a1a;--surface:#242424;--footer-bg:#151515;--white:#ffffff;--text:#9a9a9a;--border:#373737;--ff:"Space Grotesk",sans-serif;--transition:all .4s cubic-bezier(.645,.045,.355,1);}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{font-size:62.5%;scroll-behavior:smooth}
    body{font-family:var(--ff);font-size:1.6rem;background:var(--bg);color:var(--text);line-height:1.6;margin-top:8rem}
    h1,h2,h3,h4{color:var(--white);font-weight:700}
    ul{list-style:none}
    a{text-decoration:none;color:var(--text)}
    img{max-width:100%;display:block}
    .container{width:90%;max-width:98rem;margin:auto}
    .section{padding:5rem 0}
    .section__header{margin:6rem 0 4rem;text-align:center}
    .section__title{font-size:2.4rem;margin-bottom:.5rem}
    .section__subtitle{font-weight:700;font-size:1.6rem;position:relative;display:inline-block}
    .section__subtitle::after{position:absolute;content:"";width:50%;height:.4rem;background:var(--accent);bottom:-1.5rem;left:50%;transform:translateX(-50%)}
    .d-grid{display:grid;gap:3rem}
    .btn{display:inline-block;padding:1.4rem 3.5rem;color:var(--white);font-weight:600;transition:var(--transition);border-radius:10px;font-size:1.5rem}
    .btn--primary{background:var(--accent)}
    .btn--primary:hover{background:var(--accent-dark)}
    .btn--secondary{background:var(--white);color:var(--bg)}
    .btn--secondary:hover{background:var(--accent);color:var(--white)}

    /* Header */
    header{background:var(--bg);position:fixed;top:0;left:0;right:0;height:8rem;z-index:1000;display:flex;align-items:center;border-bottom:1px solid var(--border)}
    .nav{display:flex;justify-content:space-between;align-items:center;width:100%}
    .nav__brand{font-size:2rem;font-weight:700;color:var(--accent);display:flex;align-items:center;gap:.5rem}
    .nav__list{display:flex;column-gap:3.5rem}
    .nav__link{transition:var(--transition);font-size:1.4rem}
    .nav__link:hover{color:var(--accent)}
    .nav__toggle{display:none;font-size:2.4rem;color:var(--white);cursor:pointer}

    /* Hero */
    .hero{min-height:calc(100vh - 8rem);padding:5rem 0;display:flex;align-items:center}
    .hero__wrapper{align-items:center}
    .hero__subtitle{font-size:1.4rem;color:var(--accent);text-transform:uppercase;letter-spacing:.15em;margin-bottom:1.5rem}
    .hero__title{font-size:clamp(3rem,7vw,5rem);margin-bottom:3rem;position:relative;line-height:1.15}
    .hero__title::after{position:absolute;content:"";background:var(--accent);width:10rem;height:.4rem;bottom:-1.5rem;left:0}
    .hero__typewriter{font-size:2.2rem;font-weight:700;color:#1e90ff;border-right:2px solid #1e90ff;white-space:nowrap;overflow:hidden;display:inline-block;min-height:3rem;margin-bottom:2rem}
    .hero__description{margin-bottom:3rem;max-width:55ch;line-height:1.75}
    .hero__stats{border-top:1px solid var(--border);padding-top:2rem;display:flex;flex-wrap:wrap;gap:4rem;margin-top:2rem}
    .hero__stat-number{font-size:3.2rem;font-weight:700;color:var(--white)}
    .hero__stat-label{font-size:1.3rem;color:var(--text)}
    .hero__img{border-radius:20px;border:3px solid var(--border);max-width:380px;justify-self:end;box-shadow:0 20px 60px rgba(0,0,0,.5)}
    .hero__img-ph{width:320px;height:380px;background:var(--surface);border-radius:20px;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:8rem;color:var(--border);justify-self:end}

    /* About / Skills */
    .about__wrapper{align-items:start}
    .about__title{font-size:2.8rem;margin-bottom:2rem}
    .about__description{margin-bottom:3rem;line-height:1.8}
    .skills__title{font-size:2rem;text-align:left;margin-bottom:2.5rem}
    .skills__wrapper{display:flex;flex-wrap:wrap;gap:2rem}
    .skills__content{background:var(--surface);padding:2.5rem;min-width:180px;flex:1}
    .skills__subtitle{text-align:center;margin-bottom:1.5rem;font-size:1.4rem;color:var(--accent)}
    .skills__item{margin-bottom:1rem;display:flex;align-items:center;gap:.5rem;font-size:1.5rem}
    .skill-pct{margin-left:auto;font-size:1.2rem;color:var(--accent)}

    /* Qualification */
    .qualification__wrapper{margin-bottom:5rem}
    .qualification__name{display:flex;align-items:center;column-gap:1rem;font-size:2rem;margin-bottom:4rem;padding-bottom:1rem;border-bottom:1px solid var(--border)}
    .qualification__content{row-gap:3rem}
    .qualification__item{background:var(--surface);padding:2rem 2.5rem;border-left:3px solid var(--accent)}
    .qualification__title{font-size:1.7rem;font-weight:600;margin-bottom:.5rem}
    .qualification__org{font-size:1.4rem;color:var(--accent);margin-bottom:.75rem;font-weight:500}
    .qualification__description{margin-bottom:1rem;font-size:1.4rem}
    .qualification__date{font-size:1.3rem;font-weight:600;color:var(--accent)}
    .qualification__footer{border-top:1px solid var(--border);margin-top:8rem;padding-top:3rem;text-align:center}

    /* Services */
    .service__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:2rem}
    .service__card{background:var(--surface);padding:3rem 2rem;text-align:center;border-radius:8px;transition:var(--transition);border:1px solid var(--border)}
    .service__card:hover{border-color:var(--accent);transform:translateY(-4px);box-shadow:0 12px 30px rgba(37,171,117,.15)}
    .service__icon{font-size:4rem;margin-bottom:1.5rem;display:block}
    .service__title{font-size:1.7rem;margin-bottom:.75rem}
    .service__desc{font-size:1.3rem;color:var(--text)}

    /* Projects */
    .project__wrapper{grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
    .project__content{background:var(--surface);border-radius:10px;overflow:hidden;border:1px solid var(--border);transition:var(--transition)}
    .project__content:hover{border-color:var(--accent);transform:translateY(-4px)}
    .project__img{width:100%;height:200px;object-fit:cover}
    .project__img-ph{width:100%;height:200px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:5rem;color:var(--border)}
    .project__body{padding:2rem}
    .project__title{color:var(--white);font-size:1.8rem;margin-bottom:.75rem}
    .project__description{font-size:1.4rem;margin-bottom:1.25rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .project__tech{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.25rem}
    .tech-tag{font-size:1.1rem;color:var(--accent);border:1px solid var(--accent);padding:.2rem .7rem;border-radius:4px}
    .project__links{display:flex;gap:1.5rem}
    .project__link{font-size:1.3rem;text-transform:uppercase;color:var(--white);display:flex;align-items:center;gap:.4rem;transition:var(--transition)}
    .project__link:hover{color:var(--accent)}

    /* Contact */
    .contact__wrapper{border-top:1px solid var(--border);padding-top:3rem}
    .contact__title{font-size:3rem;margin-bottom:2rem}
    .contact__description{margin-bottom:2.5rem;max-width:55ch;line-height:1.75}
    .contact__info{display:flex;flex-direction:column;gap:1rem;margin-bottom:2.5rem;font-size:1.5rem}
    .contact__form{display:flex;flex-direction:column;gap:1.25rem;max-width:600px}
    .cf-input{background:var(--surface);border:1px solid var(--border);padding:1rem 1.5rem;color:var(--white);font-family:var(--ff);font-size:1.5rem;border-radius:6px;width:100%;transition:var(--transition)}
    .cf-input:focus{outline:none;border-color:var(--accent)}
    .cf-row{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
    .cf-textarea{background:var(--surface);border:1px solid var(--border);padding:1rem 1.5rem;color:var(--white);font-family:var(--ff);font-size:1.5rem;border-radius:6px;width:100%;resize:vertical;min-height:130px;transition:var(--transition)}
    .cf-textarea:focus{outline:none;border-color:var(--accent)}

    /* Footer */
    footer{background:var(--footer-bg);padding:5rem 0 2rem}
    .footer__title{font-size:2rem;margin-bottom:1.5rem}
    .footer__social-list{display:flex;gap:2rem;flex-wrap:wrap}
    .footer__social-link{font-size:1.5rem;color:var(--white);border-bottom:1px solid var(--accent);padding-bottom:.2rem;transition:var(--transition)}
    .footer__social-link:hover{color:var(--accent)}
    .footer__copyright{font-size:1.3rem;text-align:center;padding-top:3rem;border-top:1px solid var(--border);margin-top:3rem}

    /* Mobile Nav */
    @media(max-width:768px){
      .nav__list{flex-direction:column;justify-content:center;align-items:center;row-gap:3rem}
      .nav__menu{position:fixed;top:0;bottom:0;left:0;right:0;background:var(--bg);display:none;justify-content:center;align-items:center;z-index:999}
      .nav__menu--open{display:flex}
      .nav__toggle{display:block;z-index:1001}
      .hero__img,.hero__img-ph{display:none}
      .about__wrapper{grid-template-columns:1fr}
      .cf-row{grid-template-columns:1fr}
    }
    @media(min-width:769px){
      .hero__wrapper{grid-template-columns:1fr 1fr;align-items:center}
      .hero__title::after{transform:none}
      .about__wrapper{grid-template-columns:1fr 1fr}
      .qualification__content{grid-template-columns:repeat(2,1fr)}
    }
    @media(min-width:1024px){
      .qualification__content{grid-template-columns:repeat(3,1fr)}
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <nav class="nav">
        <a href="#hero" class="nav__brand">
          <i class="ri-code-s-slash-line"></i>${sanitizeHTML(profile.displayName)}
        </a>
        <div class="nav__menu" id="nav-menu">
          <ul class="nav__list">
            <li><a href="#hero" class="nav__link" onclick="closeMenu()">Home</a></li>
            <li><a href="#about" class="nav__link" onclick="closeMenu()">About</a></li>
            <li><a href="#qualification" class="nav__link" onclick="closeMenu()">Experience</a></li>
            <li><a href="#services" class="nav__link" onclick="closeMenu()">Skills</a></li>
            <li><a href="#projects" class="nav__link" onclick="closeMenu()">Projects</a></li>
            <li><a href="#contact" class="nav__link" onclick="closeMenu()">Contact</a></li>
          </ul>
        </div>
        <i class="ri-menu-3-line nav__toggle" id="nav-toggle" onclick="toggleMenu()"></i>
      </nav>
    </div>
  </header>

  <main>
    <!-- Hero -->
    <section id="hero" class="hero">
      <div class="container">
        <div class="d-grid hero__wrapper">
          <div class="hero__content">
            <p class="hero__subtitle">Hello, I'm</p>
            <h1 class="hero__title">${sanitizeHTML(profile.displayName)}</h1>
            <div class="hero__typewriter" id="typewriter"></div>
            <p class="hero__description">${sanitizeHTML(profile.bio)}</p>
            ${profile.goals ? `<p class="hero__description" style="font-style:italic;opacity:.75">"${sanitizeHTML(profile.goals)}"</p>` : ""}
            <a href="#contact" class="btn btn--primary">Hire Me!</a>
            <div class="hero__stats">
              <div>
                <p class="hero__stat-number">${projects.length}+</p>
                <p class="hero__stat-label">Projects<br>Completed</p>
              </div>
              <div>
                <p class="hero__stat-number">${skills.length}+</p>
                <p class="hero__stat-label">Skills<br>Mastered</p>
              </div>
            </div>
          </div>
          ${profile.avatarUrl
            ? `<img src="${profile.avatarUrl}" alt="${sanitizeHTML(profile.displayName)}" class="hero__img"/>`
            : `<div class="hero__img-ph"><i class="ri-user-3-line"></i></div>`}
        </div>
      </div>
    </section>

    <!-- About + Skills -->
    <section id="about" class="section">
      <div class="container">
        <div class="section__header">
          <h2 class="section__title">About Me</h2>
          <span class="section__subtitle">Who am I</span>
        </div>
        <div class="d-grid about__wrapper">
          <div class="about__content">
            <h3 class="about__title">I'm a Professional ${sanitizeHTML(profile.title)}.</h3>
            <p class="about__description">${sanitizeHTML(profile.bio)}</p>
            <a href="#projects" class="btn btn--primary">View Projects</a>
          </div>
          <div class="skills">
            <h3 class="skills__title">Technologies I work with:</h3>
            <div class="skills__wrapper">${skillColsHTML}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Qualification -->
    ${workExp.length > 0 || edu.length > 0 ? `
    <section id="qualification" class="section" style="background:var(--surface)">
      <div class="container">
        <div class="section__header">
          <h2 class="section__title">Qualification</h2>
          <span class="section__subtitle">Experience & Education</span>
        </div>
        ${workExp.length > 0 ? `
        <div class="qualification__wrapper">
          <h3 class="qualification__name"><i class="ri-briefcase-fill"></i> Professional Experience</h3>
          <div class="d-grid qualification__content">${workExpHTML}</div>
        </div>` : ""}
        ${edu.length > 0 ? `
        <div class="qualification__wrapper">
          <h3 class="qualification__name"><i class="ri-booklet-fill"></i> Education</h3>
          <div class="d-grid qualification__content">${eduHTML}</div>
        </div>` : ""}
      </div>
    </section>` : ""}

    <!-- Skills as Services -->
    <section id="services" class="section">
      <div class="container">
        <div class="section__header">
          <h2 class="section__title">Skills & Expertise</h2>
          <span class="section__subtitle">What I do best</span>
        </div>
        <div class="service__grid">${servicesHTML}</div>
      </div>
    </section>

    <!-- Projects -->
    <section id="projects" class="section" style="background:var(--surface)">
      <div class="container">
        <div class="section__header">
          <h2 class="section__title">Projects</h2>
          <span class="section__subtitle">My recent work</span>
        </div>
        <div class="d-grid project__wrapper">
          ${projectsHTML || `<p style="text-align:center;padding:4rem;color:var(--text)">No projects yet — add some from the editor.</p>`}
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section">
      <div class="container">
        <div class="contact__wrapper">
          <h2 class="contact__title">Let's work together</h2>
          <p class="contact__description">${sanitizeHTML(profile.bio)}</p>
          <div class="contact__info">
            ${contact.email ? `<span><i class="ri-mail-line"></i> ${sanitizeHTML(contact.email)}</span>` : ""}
            ${contact.phone ? `<span><i class="ri-phone-line"></i> ${sanitizeHTML(contact.phone)}</span>` : ""}
            ${contact.location ? `<span><i class="ri-map-pin-line"></i> ${sanitizeHTML(contact.location)}</span>` : ""}
          </div>
          ${contact.showContactForm ? `
          <form class="contact__form" onsubmit="return false;">
            <div class="cf-row">
              <input class="cf-input" type="text" placeholder="Your Name"/>
              <input class="cf-input" type="email" placeholder="Your Email"/>
            </div>
            <input class="cf-input" type="text" placeholder="Subject"/>
            <textarea class="cf-textarea" placeholder="Your message…"></textarea>
            <button type="submit" class="btn btn--primary" style="align-self:flex-start">Send Message →</button>
          </form>` : ""}
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <h4 class="footer__title">Connect with me</h4>
      <ul class="footer__social-list">${socialsHTML}</ul>
      <p class="footer__copyright">© ${new Date().getFullYear()} ${sanitizeHTML(profile.displayName)}. Built with <a href="https://gitfolio.dev" style="color:var(--accent)">GitFolio</a></p>
    </div>
  </footer>

  <script>
    // Typewriter
    const roles = ${JSON.stringify(typewriterRoles)};
    let ri = 0, ci = 0, del = false;
    const tw = document.getElementById('typewriter');
    function type() {
      const cur = roles[ri];
      if (del) { tw.textContent = cur.slice(0, --ci); }
      else { tw.textContent = cur.slice(0, ++ci); }
      let speed = del ? 40 : 90;
      if (!del && ci === cur.length) { speed = 2000; del = true; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
      setTimeout(type, speed);
    }
    type();

    // Mobile nav
    function toggleMenu() {
      document.getElementById('nav-menu').classList.toggle('nav__menu--open');
    }
    function closeMenu() {
      document.getElementById('nav-menu').classList.remove('nav__menu--open');
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      });
    });
  </script>
</body>
</html>`;
}
