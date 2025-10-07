import type { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return <div className="p-2">{children}</div>;
}
