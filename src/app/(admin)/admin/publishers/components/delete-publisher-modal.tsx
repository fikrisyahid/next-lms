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
        title: "Gagal",
        message: "Nama penerbit tidak cocok",
        color: "red",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await deletePublisher(id);

      if (result.status === "error") {
        throw new Error();
      }

      notifications.show({
        title: "Sukses",
        message: "Penerbit berhasil dihapus",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Gagal",
        message: "Gagal menghapus penerbit",
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
        title="Hapus Penerbit"
        centered
      >
        <Stack gap="sm">
          <Text size="sm">
            Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin
            menghapus penerbit ini?
          </Text>
          <Text size="sm">
            Ketik <b>{name}</b> untuk konfirmasi
          </Text>
          <TextInput
            placeholder="Masukkan nama penerbit"
            value={nameConfirm}
            onChange={(e) => setNameConfirm(e.target.value)}
          />
          <Button color="red" onClick={handleDeletePublisher} loading={loading}>
            Hapus
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
