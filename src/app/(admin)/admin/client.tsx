"use client";

import logout from "@/lib/auth/logout";
import {
  AppShell,
  Burger,
  Button,
  Group,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconBooks,
  IconUsers,
  IconCategory,
  IconLogout,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import type { ReactNode } from "react";

const sidebarContents = [
  {
    label: "Ebooks",
    icon: IconBooks,
    color: "blue",
  },
  {
    label: "Users",
    icon: IconUsers,
    color: "green",
  },
  {
    label: "Categories",
    icon: IconCategory,
    color: "teal",
  },
];

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
        width: 200,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      styles={{
        navbar: {
          backgroundColor: "#2F3146 ",
        },
      }}
    >
      <AppShell.Header>
        <Group justify="space-between" px="md" h="100%">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="sm"
            />
            <Text fw={600}>Admin Dashboard</Text>
          </Group>
          <Text c="dimmed" size="sm">
            Welcome, Admin
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <div className="flex flex-col h-full">
          <Group justify="space-between" align="start">
            <div className="text-xl font-semibold mb-4 text-white text-center">
              Next Digital E-Library
            </div>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="sm"
              color="white"
            />
          </Group>
          <div className="flex-1">
            {sidebarContents.map((item) => (
              <Button
                key={item.label}
                variant="subtle"
                color="gray"
                fullWidth
                leftSection={
                  <ThemeIcon color={item.color} variant="light" size={30}>
                    <item.icon size={18} />
                  </ThemeIcon>
                }
                styles={(theme) => ({
                  root: {
                    marginBottom: theme.spacing.sm,
                    color: theme.white,

                    "&:hover": {
                      backgroundColor: theme.colors.dark[6],
                    },
                  },
                  section: {
                    marginRight: theme.spacing.md,
                  },
                  inner: {
                    justifyContent: "flex-start",
                  },
                })}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <Button
              fullWidth
              color="red"
              leftSection={<IconLogout size={18} />}
              onClick={logoutConfirmationModal}
            >
              Logout
            </Button>
          </div>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
