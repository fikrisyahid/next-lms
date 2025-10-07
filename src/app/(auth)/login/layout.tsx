import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (user && user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  if (user && user.role !== "ADMIN") {
    redirect("/");
  }
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-blue-800">
      {children}
    </div>
  );
}
