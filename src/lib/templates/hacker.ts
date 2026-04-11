import type { PortfolioConfig } from "@/types/portfolio";
import { sanitizeHTML } from "@/lib/utils/sanitize";

/**
 * HACKER TERMINAL — Matrix/cyberpunk inspired (Template 2)
 * Colors: bg black · accent #0f0 (green) · glassmorphism nav
 * Features: canvas binary rain, floating side nav dots, scroll progress bar, typewriter
 */
export function renderHackerTemplate(config: PortfolioConfig): string {
  const { profile, skills, projects, experience, contact } = config;

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
      <h4 class="skill-group-title">&gt; ${sanitizeHTML(cat)}</h4>
      <div class="skill-grid">
        ${items.map((s) => `
          <div class="skill-chip">
            <span class="skill-dot" style="background:${s.color || "#0f0"}"></span>
            ${sanitizeHTML(s.name)}
            <div class="skill-bar-wrap"><div class="skill-bar-fill" style="width:${s.level}%;background:${s.color || "#0f0"}"></div></div>
            <span class="skill-num">${s.level}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  const projectsHTML = projects.slice(0, 6).map((p) => `
    <div class="proj-card">
      ${p.imageUrl ? `<div class="proj-img" style="background-image:url('${p.imageUrl}')"></div>` : `<div class="proj-img proj-img-ph"><span class="proj-ph-icon">&lt;/&gt;</span></div>`}
      <div class="proj-body">
        <div class="proj-header">
          <h3 class="proj-name">${sanitizeHTML(p.name)}</h3>
          <div class="proj-btns">
            ${p.liveUrl ? `<a href="${p.liveUrl}" class="proj-btn" target="_blank">Live ↗</a>` : ""}
            ${p.githubUrl ? `<a href="${p.githubUrl}" class="proj-btn" target="_blank">Code ↗</a>` : ""}
          </div>
        </div>
        <p class="proj-desc">${sanitizeHTML(p.description)}</p>
        <div class="proj-tags">${p.techStack.slice(0, 5).map((t) => `<span class="proj-tag">${sanitizeHTML(t)}</span>`).join("")}</div>
      </div>
    </div>
  `).join("");

  const timelineHTML = [...workExp, ...edu, ...certs].map((e) => `
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-content">
        <div class="tl-header">
          <span class="tl-type">${e.type === "work" ? "# Job" : e.type === "education" ? "# Edu" : "# Cert"}</span>
          <span class="tl-date">${e.startDate} – ${e.endDate || "Present"}</span>
        </div>
        <h4 class="tl-title">${sanitizeHTML(e.title)}</h4>
        <div class="tl-org">${sanitizeHTML(e.organization)}</div>
        ${e.description ? `<p class="tl-desc">${sanitizeHTML(e.description)}</p>` : ""}
      </div>
    </div>
  `).join("");

  const socialsHTML = contact.socialLinks.filter((s) => s.url).map((s) => `
    <a href="${s.url}" class="social-pill" target="_blank" rel="noopener">${sanitizeHTML(s.platform)}</a>
  `).join("");

  const typewriterRoles = [profile.title, "Open Source Contributor", "Problem Solver", "Code Architect"];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitizeHTML(profile.displayName)} — ${sanitizeHTML(profile.title)}</title>
  <meta name="description" content="${sanitizeHTML(profile.bio)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    :root{--g:#00ff41;--g2:#00cc33;--g3:rgba(0,255,65,.08);--bg:#000;--surface:rgba(0,20,0,.7);--border:rgba(0,255,65,.2);--text:rgba(0,255,65,.75);--white:#e8f5e9;--mono:"JetBrains Mono",monospace;--sans:"Inter",sans-serif;}
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{background:var(--bg);color:var(--text);font-family:var(--sans);line-height:1.65;min-height:100vh;overflow-x:hidden}
    a{color:inherit;text-decoration:none}
    section{position:relative;z-index:1}

    /* SCROLL BAR */
    .scroll-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#00ff41,#00cc99);z-index:200;transition:width .1s linear;width:0}

    /* CANVAS BG */
    #matrix-canvas{position:fixed;inset:0;z-index:0;opacity:.15;pointer-events:none}

    /* SIDE NAV */
    .side-nav{position:fixed;right:2rem;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:1rem;z-index:100}
    .side-nav-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--border);cursor:pointer;transition:all .3s;background:transparent}
    .side-nav-dot.active,.side-nav-dot:hover{background:var(--g);border-color:var(--g);box-shadow:0 0 10px var(--g)}

    /* HEADER */
    header{position:fixed;top:1.5rem;left:50%;transform:translateX(-50%);width:calc(100% - 3rem);max-width:1100px;background:rgba(0,0,0,.85);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:16px;z-index:99;padding:1rem 2rem}
    .nav-inner{display:flex;align-items:center;justify-content:space-between}
    .nav-logo{font-family:var(--mono);font-size:1.1rem;font-weight:700;background:linear-gradient(135deg,var(--g),#00ccff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .nav-links{display:flex;gap:.25rem}
    .nav-link{font-family:var(--mono);font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;padding:.5rem 1rem;border-radius:10px;color:rgba(0,255,65,.6);transition:all .3s}
    .nav-link:hover,.nav-link.active{background:var(--g3);color:var(--g);border:1px solid var(--border)}
    .nav-link{border:1px solid transparent}
    .nav-toggle{background:var(--g3);border:1px solid var(--border);color:var(--g);border-radius:10px;padding:.5rem .75rem;cursor:pointer;font-family:var(--mono);font-size:.75rem;display:none}

    /* SECTIONS */
    .sec{padding:6rem 2rem;max-width:1100px;margin:0 auto}
    .sec-title{font-family:var(--mono);font-size:clamp(1.6rem,3vw,2.2rem);margin-bottom:.5rem;color:var(--g)}
    .sec-title::before{content:"// "}
    .sec-divider{height:1px;background:linear-gradient(90deg,var(--g),transparent);margin-bottom:3rem}

    /* HERO */
    #home{padding:10rem 2rem 6rem;max-width:1100px;margin:0 auto}
    .hero-wrap{display:grid;grid-template-columns:1fr auto;gap:4rem;align-items:center}
    .hero-eyebrow{font-family:var(--mono);font-size:.8rem;color:rgba(0,255,65,.5);letter-spacing:.2em;text-transform:uppercase;margin-bottom:1rem}
    .hero-name{font-family:var(--mono);font-size:clamp(2.5rem,6vw,4.5rem);font-weight:700;color:var(--white);line-height:1.1;margin-bottom:1rem}
    .hero-name .bracket{color:var(--g)}
    .hero-typewriter{font-family:var(--mono);font-size:clamp(1rem,2.5vw,1.5rem);color:var(--g);border-right:2px solid var(--g);min-height:2rem;margin-bottom:1.5rem;white-space:nowrap;overflow:hidden;display:inline-block}
    .hero-bio{font-size:.95rem;color:rgba(0,255,65,.65);max-width:52ch;margin-bottom:2rem;line-height:1.8}
    .hero-btns{display:flex;gap:1rem;flex-wrap:wrap}
    .btn-primary{background:var(--g);color:#000;font-family:var(--mono);font-weight:700;padding:.7rem 1.75rem;border-radius:8px;font-size:.8rem;letter-spacing:.08em;transition:all .3s;display:inline-block}
    .btn-primary:hover{background:var(--g2);box-shadow:0 0 20px rgba(0,255,65,.4)}
    .btn-outline{border:1px solid var(--border);color:var(--g);font-family:var(--mono);padding:.7rem 1.75rem;border-radius:8px;font-size:.8rem;letter-spacing:.08em;transition:all .3s;display:inline-block}
    .btn-outline:hover{background:var(--g3)}
    .hero-avatar{width:220px;height:220px;border-radius:50%;object-fit:cover;border:3px solid var(--g);box-shadow:0 0 40px rgba(0,255,65,.3)}
    .hero-avatar-ph{width:220px;height:220px;border-radius:50%;background:var(--surface);border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:5rem;color:var(--border)}
    .hero-stats{display:flex;gap:3rem;margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--border)}
    .stat-val{font-family:var(--mono);font-size:2rem;font-weight:700;color:var(--g)}
    .stat-lbl{font-size:.75rem;color:rgba(0,255,65,.5);text-transform:uppercase;letter-spacing:.1em}

    /* ABOUT */
    .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start}
    .about-text p{color:rgba(0,255,65,.65);margin-bottom:1rem;line-height:1.8;font-size:.9rem}
    .term-box{background:rgba(0,10,0,.8);border:1px solid var(--border);border-radius:10px;padding:1.5rem;font-family:var(--mono);font-size:.8rem}
    .term-bar{display:flex;align-items:center;padding:.4rem .75rem;border-bottom:1px solid var(--border);gap:.5rem;margin-bottom:1rem}
    .dot{width:10px;height:10px;border-radius:50%}
    .term-line{margin-bottom:.4rem;color:var(--g)}
    .term-line .cmd{color:#00ccff}
    .term-line .out{color:rgba(0,255,65,.6)}

    /* SKILLS */
    .skill-group{margin-bottom:2.5rem}
    .skill-group-title{font-family:var(--mono);font-size:.8rem;color:#00ccff;text-transform:uppercase;letter-spacing:.12em;margin-bottom:1rem}
    .skill-grid{display:flex;flex-wrap:wrap;gap:.75rem}
    .skill-chip{display:flex;align-items:center;gap:.5rem;background:var(--g3);border:1px solid var(--border);border-radius:6px;padding:.4rem .9rem;font-size:.8rem;font-family:var(--mono)}
    .skill-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
    .skill-bar-wrap{width:50px;height:3px;background:rgba(0,255,65,.1);border-radius:2px;overflow:hidden;margin-left:.25rem}
    .skill-bar-fill{height:100%;border-radius:2px}
    .skill-num{font-size:.65rem;color:rgba(0,255,65,.5);min-width:20px}

    /* PROJECTS */
    .proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}
    .proj-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;transition:all .3s}
    .proj-card:hover{border-color:var(--g);box-shadow:0 8px 30px rgba(0,255,65,.1);transform:translateY(-3px)}
    .proj-img{height:180px;background:rgba(0,20,0,.5);background-size:cover;background-position:center}
    .proj-img-ph{display:flex;align-items:center;justify-content:center}
    .proj-ph-icon{font-family:var(--mono);font-size:3.5rem;color:var(--border)}
    .proj-body{padding:1.25rem}
    .proj-header{display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;margin-bottom:.75rem}
    .proj-name{font-family:var(--mono);font-size:.95rem;font-weight:600;color:var(--white)}
    .proj-btns{display:flex;gap:.5rem}
    .proj-btn{font-family:var(--mono);font-size:.65rem;color:var(--g);border:1px solid var(--border);padding:.2rem .6rem;border-radius:4px;transition:all .2s}
    .proj-btn:hover{background:var(--g3);border-color:var(--g)}
    .proj-desc{font-size:.8rem;color:rgba(0,255,65,.55);margin-bottom:.75rem;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .proj-tags{display:flex;flex-wrap:wrap;gap:.35rem}
    .proj-tag{font-family:var(--mono);font-size:.65rem;background:rgba(0,255,65,.06);border:1px solid var(--border);color:var(--g);padding:.15rem .5rem;border-radius:4px}

    /* TIMELINE */
    .tl-list{position:relative;padding-left:2.5rem}
    .tl-list::before{content:"";position:absolute;left:.75rem;top:0;bottom:0;width:1px;background:var(--border)}
    .tl-item{position:relative;margin-bottom:2.5rem}
    .tl-dot{position:absolute;left:-2rem;top:.35rem;width:12px;height:12px;border-radius:50%;background:var(--g);box-shadow:0 0 8px var(--g)}
    .tl-content{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:1.25rem}
    .tl-header{display:flex;justify-content:space-between;margin-bottom:.5rem}
    .tl-type{font-family:var(--mono);font-size:.65rem;color:#00ccff}
    .tl-date{font-family:var(--mono);font-size:.65rem;color:rgba(0,255,65,.4)}
    .tl-title{font-family:var(--mono);font-size:.9rem;color:var(--white);margin-bottom:.25rem}
    .tl-org{font-size:.8rem;color:var(--g);margin-bottom:.5rem}
    .tl-desc{font-size:.8rem;color:rgba(0,255,65,.5);line-height:1.6}

    /* CONTACT */
    .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start}
    .contact-info{display:flex;flex-direction:column;gap:1rem;margin:1.5rem 0;font-family:var(--mono);font-size:.85rem}
    .contact-info-item{display:flex;align-items:center;gap:.75rem;color:rgba(0,255,65,.75)}
    .socials{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.5rem}
    .social-pill{font-family:var(--mono);font-size:.7rem;border:1px solid var(--border);color:var(--g);padding:.3rem .85rem;border-radius:20px;transition:all .2s}
    .social-pill:hover{background:var(--g3);border-color:var(--g)}
    .cf-form{display:flex;flex-direction:column;gap:1rem}
    .cf-inp{background:rgba(0,10,0,.8);border:1px solid var(--border);color:var(--g);font-family:var(--mono);font-size:.85rem;padding:.75rem 1rem;border-radius:8px;width:100%;transition:border-color .2s}
    .cf-inp:focus{outline:none;border-color:var(--g)}
    .cf-inp::placeholder{color:rgba(0,255,65,.3)}
    .cf-ta{background:rgba(0,10,0,.8);border:1px solid var(--border);color:var(--g);font-family:var(--mono);font-size:.85rem;padding:.75rem 1rem;border-radius:8px;width:100%;resize:vertical;min-height:120px;transition:border-color .2s}
    .cf-ta:focus{outline:none;border-color:var(--g)}
    .cf-ta::placeholder{color:rgba(0,255,65,.3)}

    /* FOOTER */
    footer{border-top:1px solid var(--border);padding:2rem;text-align:center;font-family:var(--mono);font-size:.75rem;color:rgba(0,255,65,.4);position:relative;z-index:1}

    @media(max-width:768px){
      .hero-wrap,.about-grid,.contact-grid{grid-template-columns:1fr}
      .hero-avatar,.hero-avatar-ph{display:none}
      .nav-links{display:none}
      .side-nav{display:none}
      .nav-toggle{display:block}
    }
  </style>
</head>
<body>
  <div class="scroll-progress" id="scrollProgress"></div>
  <canvas id="matrix-canvas"></canvas>

  <div class="side-nav" id="sideNav">
    ${["home","about","skills","projects","timeline","contact"].map((id) => `<div class="side-nav-dot" data-target="${id}" onclick="scrollTo('${id}')" title="${id}"></div>`).join("")}
  </div>

  <header>
    <div class="nav-inner">
      <span class="nav-logo">${sanitizeHTML(profile.displayName.toUpperCase())}_</span>
      <nav class="nav-links" id="navLinks">
        ${["home","about","skills","projects","contact"].map((id) => `<a href="#${id}" class="nav-link" onclick="closeMobNav()">${id}</a>`).join("")}
      </nav>
      <button class="nav-toggle" onclick="toggleMobNav()">☰</button>
    </div>
  </header>

  <!-- Hero -->
  <section id="home">
    <div class="hero-wrap sec">
      <div>
        <p class="hero-eyebrow">Initializing portfolio...</p>
        <h1 class="hero-name"><span class="bracket">[</span>${sanitizeHTML(profile.displayName)}<span class="bracket">]</span></h1>
        <div class="hero-typewriter" id="typewriter"></div>
        <p class="hero-bio">${sanitizeHTML(profile.bio)}</p>
        ${profile.goals ? `<p class="hero-bio" style="font-style:italic;opacity:.7">"${sanitizeHTML(profile.goals)}"</p>` : ""}
        <div class="hero-btns">
          <a href="#contact" class="btn-primary">./contact_me</a>
          <a href="#projects" class="btn-outline">ls -la projects/</a>
        </div>
        <div class="hero-stats">
          <div><div class="stat-val">${projects.length}+</div><div class="stat-lbl">Projects</div></div>
          <div><div class="stat-val">${skills.length}+</div><div class="stat-lbl">Skills</div></div>
          ${experience.length > 0 ? `<div><div class="stat-val">${workExp.length}+</div><div class="stat-lbl">Roles</div></div>` : ""}
        </div>
      </div>
      ${profile.avatarUrl
        ? `<img src="${profile.avatarUrl}" alt="${sanitizeHTML(profile.displayName)}" class="hero-avatar"/>`
        : `<div class="hero-avatar-ph">{ }</div>`}
    </div>
  </section>

  <!-- About -->
  <section id="about">
    <div class="sec">
      <h2 class="sec-title">about_me</h2>
      <div class="sec-divider"></div>
      <div class="about-grid">
        <div class="about-text">
          <p>${sanitizeHTML(profile.bio)}</p>
          ${profile.goals ? `<p style="font-style:italic;opacity:.7">"${sanitizeHTML(profile.goals)}"</p>` : ""}
        </div>
        <div class="term-box">
          <div class="term-bar">
            <div class="dot" style="background:#ff5f57"></div>
            <div class="dot" style="background:#febc2e"></div>
            <div class="dot" style="background:#28c840"></div>
            <span style="margin-left:.5rem;font-family:var(--mono);font-size:.7rem;color:rgba(0,255,65,.4)">~/portfolio</span>
          </div>
          <div class="term-line"><span class="cmd">$ whoami</span></div>
          <div class="term-line"><span class="out">${sanitizeHTML(profile.displayName)}</span></div>
          <div class="term-line"><span class="cmd">$ cat role.txt</span></div>
          <div class="term-line"><span class="out">${sanitizeHTML(profile.title)}</span></div>
          ${contact.location ? `<div class="term-line"><span class="cmd">$ pwd</span></div><div class="term-line"><span class="out">${sanitizeHTML(contact.location)}</span></div>` : ""}
          ${contact.email ? `<div class="term-line"><span class="cmd">$ echo $EMAIL</span></div><div class="term-line"><span class="out">${sanitizeHTML(contact.email)}</span></div>` : ""}
          <div class="term-line" style="margin-top:.75rem"><span style="color:rgba(0,255,65,.3)">█</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Skills -->
  <section id="skills">
    <div class="sec">
      <h2 class="sec-title">tech_stack</h2>
      <div class="sec-divider"></div>
      ${skillsHTML || `<p style="color:rgba(0,255,65,.4);font-family:var(--mono)">// No skills added yet</p>`}
    </div>
  </section>

  <!-- Projects -->
  <section id="projects">
    <div class="sec">
      <h2 class="sec-title">projects</h2>
      <div class="sec-divider"></div>
      <div class="proj-grid">
        ${projectsHTML || `<p style="color:rgba(0,255,65,.4);font-family:var(--mono)">// No projects added yet — add some from the editor</p>`}
      </div>
    </div>
  </section>

  <!-- Timeline -->
  ${experience.length > 0 ? `
  <section id="timeline">
    <div class="sec">
      <h2 class="sec-title">timeline</h2>
      <div class="sec-divider"></div>
      <div class="tl-list">${timelineHTML}</div>
    </div>
  </section>` : ""}

  <!-- Contact -->
  <section id="contact">
    <div class="sec">
      <h2 class="sec-title">contact</h2>
      <div class="sec-divider"></div>
      <div class="contact-grid">
        <div>
          <p style="font-family:var(--mono);font-size:.9rem;color:rgba(0,255,65,.65);margin-bottom:1rem">Interested in working together? Let's talk.</p>
          <div class="contact-info">
            ${contact.email ? `<div class="contact-info-item">✉ ${sanitizeHTML(contact.email)}</div>` : ""}
            ${contact.phone ? `<div class="contact-info-item">✆ ${sanitizeHTML(contact.phone)}</div>` : ""}
            ${contact.location ? `<div class="contact-info-item">◎ ${sanitizeHTML(contact.location)}</div>` : ""}
          </div>
          <div class="socials">${socialsHTML}</div>
        </div>
        ${contact.showContactForm ? `
        <form class="cf-form" onsubmit="return false;">
          <input class="cf-inp" type="text" placeholder="// Your name"/>
          <input class="cf-inp" type="email" placeholder="// Your email"/>
          <textarea class="cf-ta" placeholder="// Your message..."></textarea>
          <button type="submit" class="btn-primary" style="font-family:var(--mono)">./send_message()</button>
        </form>` : ""}
      </div>
    </div>
  </section>

  <footer>© ${new Date().getFullYear()} ${sanitizeHTML(profile.displayName)} · Built with <a href="https://gitfolio.dev" style="color:var(--g)">GitFolio</a></footer>

  <script>
    // Matrix canvas
    (function(){
      const c=document.getElementById('matrix-canvas');
      const ctx=c.getContext('2d');
      function rs(){c.width=innerWidth;c.height=innerHeight;}
      rs();window.addEventListener('resize',rs);
      const chars=['0','1','A','B','C','D','E','F','G','H'];
      const fs=13;
      let cols=Math.floor(c.width/fs);
      let drops=Array(cols).fill(0);
      function draw(){
        ctx.fillStyle='rgba(0,0,0,.05)';
        ctx.fillRect(0,0,c.width,c.height);
        ctx.fillStyle='#0f0';
        ctx.font=fs+'px monospace';
        for(let i=0;i<drops.length;i++){
          ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*fs,drops[i]*fs);
          if(drops[i]*fs>c.height&&Math.random()>.975)drops[i]=0;
          drops[i]++;
        }
        requestAnimationFrame(draw);
      }
      draw();
    })();

    // Typewriter
    const roles=${JSON.stringify([profile.title, ...skills.slice(0,3).map(s=>s.name+" Specialist")])};
    let ri=0,ci=0,del=false;
    const tw=document.getElementById('typewriter');
    function type(){
      const cur=roles[ri];
      if(del){tw.textContent=cur.slice(0,--ci);}
      else{tw.textContent=cur.slice(0,++ci);}
      let sp=del?35:80;
      if(!del&&ci===cur.length){sp=2200;del=true;}
      else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;}
      setTimeout(type,sp);
    }
    type();

    // Scroll progress
    window.addEventListener('scroll',()=>{
      const p=window.pageYOffset/(document.documentElement.scrollHeight-window.innerHeight)*100;
      document.getElementById('scrollProgress').style.width=p+'%';
    });

    // Side nav active
    const sections=['home','about','skills','projects','timeline','contact'];
    function updateActive(){
      sections.forEach(id=>{
        const el=document.getElementById(id);
        const dot=document.querySelector('[data-target="'+id+'"]');
        if(!el||!dot)return;
        const r=el.getBoundingClientRect();
        if(r.top<=100&&r.bottom>100){dot.classList.add('active');}
        else{dot.classList.remove('active');}
      });
    }
    window.addEventListener('scroll',updateActive);
    updateActive();

    function scrollTo(id){
      const el=document.getElementById(id);
      if(el)el.scrollIntoView({behavior:'smooth'});
    }

    // Mobile nav
    function toggleMobNav(){
      const n=document.getElementById('navLinks');
      n.style.display=n.style.display==='flex'?'none':'flex';
      if(n.style.display==='flex'){n.style.flexDirection='column';n.style.position='absolute';n.style.top='4.5rem';n.style.left='0';n.style.right='0';n.style.background='rgba(0,0,0,.95)';n.style.padding='1rem';n.style.borderRadius='12px';}
    }
    function closeMobNav(){
      document.getElementById('navLinks').style.display='';
    }

    // Smooth nav scroll
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click',e=>{
        e.preventDefault();
        const t=document.querySelector(a.getAttribute('href'));
        if(t)t.scrollIntoView({behavior:'smooth'});
        closeMobNav();
      });
    });
  </script>
</body>
</html>`;
}
