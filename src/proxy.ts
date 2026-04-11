import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16: middleware is now called "proxy"
//
// ⚠️  IMPORTANT — Auth architecture:
//   - Authentication: Auth.js (GitHub OAuth) — sessions in JWT cookies
//   - Database/Storage: Supabase — NOT used for auth, only for data
//
// This proxy only refreshes the Supabase *storage* client session so that
// server components can read/write portfolio configs. It does NOT protect
// routes — that is handled by src/app/dashboard/layout.tsx which calls
// Auth.js auth() to verify the GitHub session.
//
// Do NOT add redirect logic here based on supabase.auth.getUser() —
// that would always return null (users sign in via GitHub, not Supabase Auth)
// and cause infinite redirect loops → "Server configuration error".

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // Refresh Supabase storage session if expired.
  // Required so server components have a valid Supabase client for DB ops.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
