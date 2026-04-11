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

export async function proxy(request: NextRequest) {
  // If Supabase env vars are not set (e.g. missing on a new Vercel project),
  // skip Supabase session refresh and just pass the request through.
  // This prevents the proxy from crashing and returning an HTML error page.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  // Dynamically import to avoid module-level crashes when env vars are missing
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

  try {
    // Refresh Supabase storage session if expired.
    await supabase.auth.getUser();
  } catch {
    // If Supabase refresh fails, still pass the request through.
    // Never let this crash the entire request pipeline.
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
