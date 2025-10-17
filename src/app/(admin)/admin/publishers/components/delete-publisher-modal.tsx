"use client";

import { deletePublisher } from "@/app/api/publishers";
import {
  ActionIcon,
  Button,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePublisherModal({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [nameConfirm, setNameConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeletePublisher = async () => {
    if (nameConfirm !== name) {
      notifications.show({
        title: "Error",
        message: "Publisher name does not match",
        color: "red",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await deletePublisher(id);

      if (result.status === "error") {
        notifications.show({
          title: "Error",
          message: result.message || "Failed to delete publisher",
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Success",
        message: result.message || "Publisher has been deleted successfully",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete publisher",
        color: "red",
      });
    }
    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <ActionIcon variant="filled" color="red" onClick={() => setOpen(true)}>
        <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="Delete Publisher"
        centered
      >
        <Stack gap="sm">
          <Text size="sm">
            This action is irreversible. Are you sure you want to delete this
            publisher?
          </Text>
          <Text size="sm">
            Type <b>{name}</b> for confirmation
          </Text>
          <TextInput
            placeholder="Input the publisher name"
            value={nameConfirm}
            onChange={(e) => setNameConfirm(e.target.value)}
          />
          <Button color="red" onClick={handleDeletePublisher} loading={loading}>
            Delete
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
