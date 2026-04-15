import { NextResponse, type NextRequest } from "next/server";

// Next.js 16: middleware is now called "proxy"
//
// Auth architecture:
//   - Authentication: Auth.js (GitHub OAuth) — sessions in JWT cookies
//   - Database/Storage: Supabase — NOT used for auth, only for data
//
// This proxy refreshes the Supabase STORAGE client session so server
// components can read/write portfolio configs. Route protection is
// handled by src/app/dashboard/layout.tsx (calls Auth.js auth()).
//
// IMPORTANT: This middleware runs on Vercel's EDGE runtime.
// @supabase/ssr uses Node.js APIs — we must guard every import
// with try-catch to avoid Vercel returning an HTML 500 page.

export async function proxy(request: NextRequest) {
  // ── Skip middleware entirely for API routes ──────────────────────────
  // API routes manage their own auth. Running the Supabase session
  // refresh here for API calls caused 500 HTML responses on Vercel
  // because @supabase/ssr can crash on the Edge runtime.
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next({ request });
  }

  // ── Skip if Supabase env vars are missing ────────────────────────────
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  // ── Supabase session refresh (best-effort, never blocks the request) ──
  try {
    const { createServerClient } = await import("@supabase/ssr");

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    await supabase.auth.getUser();
    return supabaseResponse;
  } catch {
    // If anything in the Supabase block fails (import, init, getUser),
    // pass the request through unchanged rather than returning a 500.
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
