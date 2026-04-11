import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // auth() reads the Auth.js JWT session cookie.
  // Requires AUTH_URL to be set on Vercel (https://gitfolio-kappa.vercel.app).
  // If not set, this will return null and redirect to /login every time.
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
