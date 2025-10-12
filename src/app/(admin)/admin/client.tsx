"use client";

import logout from "@/lib/auth/logout";
import { AppShell, Burger, Button, Group, Text } from "@mantine/core";
import {
  IconBooks,
  IconUsers,
  IconCategory,
  IconLogout,
  IconDashboard,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarContents = [
  {
    label: "Dashboard",
    icon: IconDashboard,
    href: "/admin/dashboard",
  },
  {
    label: "E-Books",
    icon: IconBooks,
    href: "/admin/ebooks",
  },
  {
    label: "Users",
    icon: IconUsers,
    href: "/admin/users",
  },
  {
    label: "Categories",
    icon: IconCategory,
    href: "/admin/categories",
  },
];

export default function AdminLayoutClient({
  user,
  children,
}: {
  user: { fullname: string; username: string; role: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
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
          borderRight: "0px",
        },
        main: { backgroundColor: "#E0E0E0" },
        header: {
          backgroundColor: "#FFFFFF",
          borderBottom: "0px",
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
            <Text fw={600}>Welcome, {user.fullname}</Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <div className="flex flex-col h-full">
          <Group justify="space-between" align="start" mb="md" mt="md">
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
                mb="sm"
                variant="subtle"
                color="white"
                href={item.href}
                component={Link}
                fullWidth
                justify="start"
                leftSection={<item.icon size={18} />}
                style={{
                  backgroundColor:
                    pathname === item.href ? "#393C5A" : "transparent",
                }}
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
