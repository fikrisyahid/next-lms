import type { ReactNode } from "react";
import AdminLayoutClient from "./client";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Panel",
  description: "Admin Panel",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
