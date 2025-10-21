"use client";

import { createCategory } from "@/app/api/categories";
import { BASE_COLOR } from "@/config/color";
import { Button, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormValues = {
  name: string;
};

export default function EbookAddCategoryModal() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    initialValues: { name: "" },
    validate: { name: (v) => (v.trim() ? null : "Nama kategori wajib diisi") },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await createCategory({
        name: values.name,
        type: "EBOOK",
      });

      if (result.status === "error") {
        notifications.show({
          title: "Gagal",
          message: result.message || "Gagal menambahkan kategori",
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Sukses",
        message: `Kategori ${result.category?.name} berhasil ditambahkan!`,
        color: "green",
      });

      form.reset();
      setOpened(false);
      modals.closeAll();
      router.refresh();
    } catch (_) {
      notifications.show({
        title: "Gagal",
        message: "Gagal menambahkan kategori",
        color: "red",
      });
    }
    setLoading(false);
  };

  const confirmSubmit = (values: FormValues) => {
    modals.openConfirmModal({
      title: "Konfirmasi Penambahan Kategori",
      centered: true,
      children: (
        <Text size="sm">
          Apakah kamu yakin ingin menambahkan kategori dengan nama{" "}
          <b>{values.name}</b>?
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
        leftSection={<IconPlus stroke={1.5} />}
        onClick={() => setOpened(true)}
        color={BASE_COLOR.primary}
      >
        Tambah Kategori
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
        title="Tambah Kategori Baru"
        centered
      >
        <form onSubmit={form.onSubmit(confirmSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Name"
              placeholder="Nama Kategori"
              required
              {...form.getInputProps("name")}
            />
            <Button
              type="submit"
              loading={loading}
              fullWidth
              color={BASE_COLOR.primary}
            >
              Tambah Kategori
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
