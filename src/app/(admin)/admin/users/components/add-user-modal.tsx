"use client";

import { createUser } from "@/app/api/users";
import { BASE_COLOR } from "@/config/color";
import {
  Button,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RegisterValues = {
  fullname: string;
  username: string;
  password: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

export default function AddUserModal() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterValues>({
    initialValues: {
      fullname: "",
      username: "",
      password: "",
      role: "STUDENT",
    },
    validate: {
      fullname: (v) => (v.trim() ? null : "Nama lengkap wajib diisi"),
      username: (v) =>
        v.length >= 3 ? null : "Username harus terdiri dari minimal 3 karakter",
      password: (v) =>
        v.length >= 6 ? null : "Password harus terdiri dari minimal 6 karakter",
      role: (v) => (v ? null : "Hak akses wajib diisi"),
    },
  });

  const handleSubmit = async (values: RegisterValues) => {
    setLoading(true);
    try {
      const result = await createUser(values);

      if (result.status === "error") {
        notifications.show({
          title: "Gagal",
          message: result.message || "Gagal menambahkan pengguna",
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Sukses",
        message: `Pengguna ${result?.user?.username} (${result.user?.role}) berhasil ditambahkan!`,
        color: "green",
      });

      form.reset();
      setOpened(false);
      modals.closeAll();
      router.refresh();
    } catch (_) {
      notifications.show({
        title: "Gagal",
        message: "Gagal menambahkan pengguna",
        color: "red",
      });
    }
    setLoading(false);
  };

  const confirmSubmit = (values: RegisterValues) => {
    modals.openConfirmModal({
      title: "Konfirmasi Penambahan Pengguna",
      centered: true,
      children: (
        <Text size="sm">
          Apakah kamu yakin ingin menambahkan <b>{values.username}</b> sebagai{" "}
          <b>{values.role}</b>?
        </Text>
      ),
      labels: { confirm: "Ya, Tambah", cancel: "Batal" },
      confirmProps: { color: BASE_COLOR.primary, loading },
      onConfirm: () => handleSubmit(values),
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpened(true)}
        leftSection={<IconPlus stroke={1.5} />}
        color={BASE_COLOR.primary}
      >
        Tambah Pengguna
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Tambah Pengguna Baru"
        centered
      >
        <form onSubmit={form.onSubmit((values) => confirmSubmit(values))}>
          <Stack gap="sm">
            <TextInput
              label="Nama Lengkap"
              placeholder="Nama Lengkap"
              required
              {...form.getInputProps("fullname")}
            />

            <TextInput
              label="Username"
              placeholder="Username"
              required
              {...form.getInputProps("username")}
            />

            <PasswordInput
              label="Password"
              placeholder="Password"
              required
              {...form.getInputProps("password")}
            />

            <Select
              label="Role"
              placeholder="Select role"
              data={[
                { value: "ADMIN", label: "Admin" },
                { value: "TEACHER", label: "Guru" },
                { value: "STUDENT", label: "Siswa" },
              ]}
              required
              {...form.getInputProps("role")}
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              color={BASE_COLOR.primary}
            >
              Tambah Pengguna
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
