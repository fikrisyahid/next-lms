"use client";

import logout from "@/lib/auth/logout";
import { AppShell, Burger, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactNode } from "react";

export default function AdminLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      layout="alt"
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar>
        <Button fullWidth variant="light" color="red" onClick={logout}>
          Logout
        </Button>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
