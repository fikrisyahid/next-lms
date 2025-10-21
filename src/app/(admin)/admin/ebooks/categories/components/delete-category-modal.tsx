"use client";

import { deleteCategory } from "@/app/api/categories";
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

export default function EbookDeleteCategoryModal({
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

  const handleDeleteCategory = async () => {
    if (nameConfirm !== name) {
      notifications.show({
        title: "Gagal",
        message: "Nama kategori tidak cocok",
        color: "red",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await deleteCategory({ id });

      if (result.status === "error") {
        notifications.show({
          title: "Gagal",
          message: result.message || "Gagal menghapus kategori",
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Sukses",
        message: `Kategori ${name} berhasil dihapus`,
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Gagal",
        message: "Gagal menghapus kategori",
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
        onClose={() => {
          setOpen(false);
          setNameConfirm("");
        }}
        title="Hapus Kategori"
        centered
      >
        <Stack gap="sm">
          <Text size="sm">
            Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin
            menghapus kategori ini?
          </Text>
          <Text size="sm">
            Ketik <b>{name}</b> untuk konfirmasi
          </Text>
          <TextInput
            placeholder="Masukkan nama kategori"
            value={nameConfirm}
            onChange={(e) => setNameConfirm(e.target.value)}
          />
          <Button color="red" onClick={handleDeleteCategory} loading={loading}>
            Hapus
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
