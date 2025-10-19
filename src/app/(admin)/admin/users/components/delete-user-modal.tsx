"use client";

import { deleteUser } from "@/app/api/users";
import { ActionIcon, Code, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function DeleteUserModal({
  id,
  username,
  fullname,
  role,
}: {
  id: string;
  username: string;
  fullname: string;
  role: string;
}) {
  const router = useRouter();
  const handleDeleteUser = async () => {
    try {
      const result = await deleteUser(id);

      if (result.status === "error") {
        throw new Error();
      }

      notifications.show({
        title: "Sukses",
        message: "Pengguna berhasil dihapus",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Gagal",
        message: "Gagal menghapus pengguna",
        color: "red",
      });
    }
    router.refresh();
  };

  const handleConfirmDelete = () => {
    modals.openConfirmModal({
      title: "Apakah kamu yakin?",
      centered: true,
      children: (
        <Stack gap="sm">
          <Text size="sm">
            Hal ini tidak dapat dibatalkan. Pengguna berikut akan dihapus secara
            permanen:
          </Text>
          <Code block>
            {`username: ${username}
fullname: ${fullname}
role: ${role}`}
          </Code>
        </Stack>
      ),
      labels: { confirm: "Hapus pengguna", cancel: "Batal" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDeleteUser(),
    });
  };
  return (
    <ActionIcon variant="filled" color="red" onClick={handleConfirmDelete}>
      <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
    </ActionIcon>
  );
}
