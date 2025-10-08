"use client";

import logout from "@/lib/auth/logout";
import { AppShell, Burger, Button, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import type { ReactNode } from "react";

export default function AdminLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();

  const logoutConfirmationModal = () =>
    modals.openConfirmModal({
      title: "Logout confirmation",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to logout? You will need to login again to
          access the admin panel.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: logout,
    });

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
        <Button
          fullWidth
          variant="light"
          color="red"
          onClick={logoutConfirmationModal}
        >
          Logout
        </Button>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
