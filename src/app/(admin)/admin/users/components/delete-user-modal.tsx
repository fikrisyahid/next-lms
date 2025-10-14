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
  const handleDeleteuser = async () => {
    try {
      const result = await deleteUser(id);

      if (result.status === "error") {
        notifications.show({
          title: "Error",
          message: result.message || "Failed to delete user",
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Success",
        message: "User has been deleted successfully",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete user",
        color: "red",
      });
    }
    router.refresh();
  };

  const handleConfirmDelete = () => {
    modals.openConfirmModal({
      title: "Are you sure?",
      centered: true,
      children: (
        <Stack gap="sm">
          <Text size="sm">
            This action is irreversible. Are you sure you want to delete this
            user?
          </Text>
          <Code block>
            {`username: ${username}
fullname: ${fullname}
role: ${role}`}
          </Code>
        </Stack>
      ),
      labels: { confirm: "Delete user", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDeleteuser(),
    });
  };
  return (
    <ActionIcon variant="filled" color="red" onClick={handleConfirmDelete}>
      <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
    </ActionIcon>
  );
}
