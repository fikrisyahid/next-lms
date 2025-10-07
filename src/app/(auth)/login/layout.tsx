import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-blue-800">
      {children}
    </div>
  );
}
