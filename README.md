<div align="center">

# ⚡ GitFolio Engine

**Generate a production-ready developer portfolio from your GitHub profile in under 60 seconds.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/gitfolio)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

</div>

---

## ✨ What it does

GitFolio Engine connects to your GitHub account, extracts your repositories, contribution history, and language stats, and turns them into a beautiful **static portfolio website** — which it can push directly to a new GitHub repository and enable GitHub Pages, all in one click.

| Feature | Description |
|---|---|
| 🔐 GitHub Auth | Sign in via GitHub App — no passwords, no API keys |
| 📊 Smart Aggregation | Filters forks, calculates language skill clouds |
| 🖼️ Live Preview | 1:1 preview of your final site before generating |
| 🚀 One-Click Deploy | Pushes to GitHub repo + enables Pages automatically |
| 📦 ZIP Export | Download as a static site bundle if you prefer |
| 🎨 Templates | Curated, component-driven templates (Minimalist, more coming) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript |
| Styling | Tailwind CSS v4, Shadcn UI, Framer Motion |
| Auth | Auth.js v5 (NextAuth) — GitHub App |
| Database | Supabase (PostgreSQL + Row Level Security) |
| GitHub API | GitHub GraphQL API + Octokit |
| Generation | `react-dom/server` → Static HTML |
| Security | Zod validation, DOMPurify XSS prevention |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/gitfolio.git
cd gitfolio
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Then fill in `.env.local` with your credentials (see [Configuration](#-configuration) below).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## ⚙️ Configuration

You need three external services. All are free to start.

### GitHub App

1. Go to **GitHub → Settings → Developer Settings → GitHub Apps → New GitHub App**
2. Set **Homepage URL** to your app URL
3. Set **Callback URL** to `http://localhost:3000/api/auth/callback/github`
4. Permissions needed: `read:user`, `user:email`, `public_repo` (for push)
5. Copy **Client ID** and generate a **Client Secret**

### Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy the **Project URL** and **anon public key** from Settings → API
3. Run the migrations (see below)

### Auth.js Secret

Generate a cryptographically secure secret:

```bash
openssl rand -hex 32
```

### Environment Variables

```env
AUTH_GITHUB_ID=your_github_app_client_id
AUTH_GITHUB_SECRET=your_github_app_client_secret
AUTH_SECRET=your_generated_secret

NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🗄️ Database Setup

Run the SQL migrations in your Supabase **SQL Editor**. Migration files are in `/supabase/migrations/` (coming soon — see the [project plan](gitfolio_engine_plan.md)).

---

## ☁️ Deployment

### Vercel (Recommended — One Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/gitfolio)

1. Click the button above
2. Connect your GitHub account
3. Add all environment variables in the Vercel dashboard
4. **Update your GitHub App's callback URL** to `https://your-app.vercel.app/api/auth/callback/github`
5. Deploy!

### Manual Vercel Deploy

```bash
npm install -g vercel
vercel --prod
```

### Other Platforms

This is a standard Next.js app and deploys to any platform that supports Node.js (Railway, Render, Fly.io, etc.). Ensure all environment variables are set on the platform.

---

## 📁 Project Structure

```
gitfolio/
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   │   ├── api/          # API routes (auth, github, generate, deploy)
│   │   ├── dashboard/    # Protected dashboard pages
│   │   └── login/        # Auth pages
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/
│   │   ├── auth/         # Auth.js configuration
│   │   ├── github/       # GitHub GraphQL queries & transforms
│   │   ├── supabase/     # Supabase client (server & browser)
│   │   ├── templates/    # Portfolio templates (TSX → Static HTML)
│   │   └── utils/        # Shared utilities
│   ├── types/            # TypeScript type definitions
│   └── middleware.ts     # Supabase session refresh
├── .env.example          # Environment variable template
├── next.config.ts        # Next.js configuration
└── vercel.json           # Vercel deployment settings
```

---

## 🛡️ Security

- **Secrets never hit the client** — all GitHub tokens are server-side only
- **XSS Prevention** — all GitHub README content is DOMPurify-sanitized before generation
- **Rate Limiting** — GraphQL API + TanStack Query caching prevents `403` errors
- **RLS** — Supabase Row Level Security isolates user data

---

## 🗺️ Roadmap

- [ ] Minimalist template (v1)
- [ ] Re-generate & sync existing portfolios
- [ ] More templates (Framer-style, Terminal, etc.)
- [ ] AI repository summarization
- [ ] Developer analytics dashboard

---

## 📄 License

MIT © [Your Name](https://github.com/YOUR_USERNAME)
