"use client";

import logout from "@/lib/auth/logout";
import {
  AppShell,
  Burger,
  Button,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import {
  IconBooks,
  IconUsers,
  IconLogout,
  IconDashboard,
  IconBook,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import type { ReactNode } from "react";
import NavbarItems from "./components/navbar-items";

const sidebarContents = [
  {
    label: "Dashboard",
    icon: IconDashboard,
    href: "/admin/dashboard",
  },
  {
    label: "E-Books",
    icon: IconBooks,
    subItems: [
      { label: "Daftar", href: "/admin/ebooks" },
      { label: "Kategori", href: "/admin/ebooks/categories" },
      { label: "Mata Pelajaran", href: "/admin/ebooks/subjects" },
      { label: "Kurikulum", href: "/admin/ebooks/curriculums" },
      { label: "Jenjang Sekolah", href: "/admin/ebooks/education-levels" },
      { label: "Kelas", href: "/admin/ebooks/class-levels" },
      { label: "Tipe", href: "/admin/ebooks/types" },
    ],
  },
  {
    label: "Video",
    icon: IconBooks,
    subItems: [
      { label: "Daftar", href: "/admin/video" },
      { label: "Kategori", href: "/admin/video/categories" },
      { label: "Mata Pelajaran", href: "/admin/video/subjects" },
      { label: "Jenjang Sekolah", href: "/admin/video/education-levels" },
      { label: "Kelas", href: "/admin/video/class-levels" },
    ],
  },
  {
    label: "Animasi",
    icon: IconBooks,
    subItems: [
      { label: "Daftar", href: "/admin/animation" },
      { label: "Kategori", href: "/admin/animation/categories" },
      { label: "Mata Pelajaran", href: "/admin/animation/subjects" },
      { label: "Jenjang Sekolah", href: "/admin/animation/education-levels" },
      { label: "Kelas", href: "/admin/animation/class-levels" },
    ],
  },
  {
    label: "Penerbit",
    icon: IconBook,
    href: "/admin/publishers",
  },
  {
    label: "Pengguna",
    icon: IconUsers,
    href: "/admin/users",
  },
];

export default function AdminLayoutClient({
  user,
  children,
}: {
  user: { fullname: string; username: string; role: string };
  children: ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();

  const logoutConfirmationModal = () =>
    modals.openConfirmModal({
      title: "Konfirmasi Logout",
      centered: true,
      children: (
        <Text size="sm">
          Apakah anda yakin ingin logout dari aplikasi? Anda harus login kembali
          untuk mengakses panel admin.
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
          boxShadow: "10px 0px 10px rgba(0, 0, 0, 0.1)",
        },
        main: { backgroundColor: "#E0E0E0" },
        header: {
          backgroundColor: "#FFFFFF",
          borderBottom: "0px",
          boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
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
            <Text fw={600}>Selamat datang, {user.fullname}</Text>
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
          <ScrollArea className="h-full">
            <div className="flex-1 space-y-2">
              {sidebarContents.map((item) => (
                <NavbarItems
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  subItems={item.subItems}
                  leftIcon={<item.icon className="w-5 h-5 mr-2" />}
                  onClick={() => {
                    if (opened) {
                      toggle();
                    }
                  }}
                />
              ))}
            </div>
          </ScrollArea>

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
