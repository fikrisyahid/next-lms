"use client";

import { updateCategory } from "@/app/api/categories";
import { BASE_COLOR } from "@/config/color";
import {
  ActionIcon,
  Button,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditCategoryModalProps = {
  id: string;
  name: string;
};

type FormValues = {
  name: string;
};

export default function EbookEditCategoryModal({
  id,
  name,
}: EditCategoryModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    initialValues: { name },
    validate: { name: (v) => (v.trim() ? null : "Nama kategori wajib diisi") },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await updateCategory({
        id,
        name: values.name,
        type: "EBOOK",
      });

      if (result.status === "error") {
        notifications.show({
          title: "Gagal",
          message: result.message || "Gagal mengubah kategori",
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Sukses",
        message: `Kategori ${result.category?.name} berhasil diubah`,
        color: "green",
      });

      form.reset();
      setOpen(false);
      modals.closeAll();
      router.refresh();
    } catch (_) {
      notifications.show({
        title: "Gagal",
        message: "Gagal mengubah kategori",
        color: "red",
      });
    }
    setLoading(false);
  };

  const confirmSubmit = (values: FormValues) => {
    modals.openConfirmModal({
      title: "Konfirmasi perubahan kategori",
      centered: true,
      children: (
        <Text size="sm">
          Apakah kamu yakin ingin mengubah kategori dengan nama{" "}
          <b>{values.name}</b>?
        </Text>
      ),
      labels: { confirm: "Ya, Ubah", cancel: "Batal" },
      confirmProps: { color: BASE_COLOR.primary, loading },
      onConfirm: () => handleSubmit(values),
    });
  };

  return (
    <>
      <ActionIcon variant="filled" color="yellow" onClick={() => setOpen(true)}>
        <IconPencil style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>

      <Modal
        opened={open}
        onClose={() => {
          setOpen(false);
          form.reset();
        }}
        title="Ubah data kategori"
        centered
      >
        <form onSubmit={form.onSubmit(confirmSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Nama kategori"
              placeholder="Nama kategori"
              required
              {...form.getInputProps("name")}
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
