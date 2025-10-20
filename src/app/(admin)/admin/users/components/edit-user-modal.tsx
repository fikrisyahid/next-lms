"use client";

import { updateUser } from "@/app/api/users/update";
import { BASE_COLOR } from "@/config/color";
import {
  Button,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Modal,
  ActionIcon,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditUserModalProps = {
  userId: string;
  fullname: string;
  username: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

type UserValues = EditUserModalProps & {
  password: string;
};

export default function EditUserModal({
  userId,
  fullname,
  username,
  role,
}: EditUserModalProps) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const form = useForm<UserValues>({
    initialValues: {
      userId,
      fullname,
      username,
      password: "",
      role,
    },
    validate: {
      fullname: (v) => (v.trim() ? null : "Nama lengkap wajib diisi"),
      username: (v) =>
        v.length >= 3 ? null : "Username harus terdiri dari minimal 3 karakter",
      password: (v) => {
        if (!changePassword) return null;
        if (v.length < 6)
          return "Password harus terdiri dari minimal 6 karakter";
        return null;
      },
      role: (v) => (v ? null : "Hak akses wajib diisi"),
    },
  });

  const handleSubmit = async (values: UserValues) => {
    setLoading(true);
    try {
      const result = await updateUser(values);

      if (result.status === "error") {
        notifications.show({
          title: "Gagal",
          message: result.message || "Gagal mengubah pengguna",
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Sukses",
        message: `Pengguna ${result?.user?.username} (${result.user?.role}) berhasil diubah!`,
        color: "green",
      });

      form.reset();
      setOpened(false);
      modals.closeAll();
      router.refresh();
    } catch (_) {
      notifications.show({
        title: "Gagal",
        message: "Gagal mengubah pengguna",
        color: "red",
      });
    }
    setLoading(false);
  };

  const confirmSubmit = (values: UserValues) => {
    modals.openConfirmModal({
      title: "Konfirmasi perubaha data pengguna",
      centered: true,
      children: (
        <Text size="sm">
          Apakah kamu yakin ingin mengubah data pengguna{" "}
          <b>{values.username}</b>?
        </Text>
      ),
      labels: { confirm: "Ya, Ubah", cancel: "Batal" },
      confirmProps: { color: BASE_COLOR.primary, loading },
      onConfirm: () => handleSubmit(values),
    });
  };

  return (
    <>
      <ActionIcon
        variant="filled"
        color="yellow"
        onClick={() => setOpened(true)}
      >
        <IconPencil style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
        title="Ubah data pengguna"
        centered
      >
        <form onSubmit={form.onSubmit((values) => confirmSubmit(values))}>
          <Stack gap="sm">
            <TextInput
              label="Nama lengkap"
              placeholder="Full name"
              required
              {...form.getInputProps("fullname")}
            />

            <TextInput
              label="Username"
              placeholder="Username"
              required
              {...form.getInputProps("username")}
            />

            <Checkbox
              label="Ganti password pengguna"
              checked={changePassword}
              onChange={(e) => setChangePassword(e.currentTarget.checked)}
            />

            <PasswordInput
              label="Password baru"
              placeholder="Password baru"
              required={changePassword}
              disabled={!changePassword}
              {...form.getInputProps("password")}
            />

            <Select
              label="Hak akses"
              placeholder="Pilih hak akses"
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
              Ubah
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
