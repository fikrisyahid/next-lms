"use client";

import { createSubject } from "@/app/api/subjects";
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

export default function AddSubjectModal() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    initialValues: { name: "" },
    validate: { name: (v) => (v.trim() ? null : "Nama mata pelajaran wajib diisi") },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await createSubject({ name: values.name });

      if (result.status === "error") {
        notifications.show({
          title: "Gagal",
          message: result.message || "Gagal menambahkan mata pelajaran",
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Sukses",
        message: `Mata pelajaran ${result.subject?.name} berhasil ditambahkan!`,
        color: "green",
      });

      form.reset();
      setOpened(false);
      modals.closeAll();
      router.refresh();
    } catch (_) {
      notifications.show({
        title: "Gagal",
        message: "Gagal menambahkan mata pelajaran",
        color: "red",
      });
    }
    setLoading(false);
  };

  const confirmSubmit = (values: FormValues) => {
    modals.openConfirmModal({
      title: "Konfirmasi Penambahan Mata pelajaran",
      centered: true,
      children: (
        <Text size="sm">
          Apakah kamu yakin ingin menambahkan mata pelajaran dengan nama{" "}
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
        Tambah Mata pelajaran
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
        title="Tambah Mata pelajaran Baru"
        centered
      >
        <form onSubmit={form.onSubmit(confirmSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Nama"
              placeholder="Nama Mata pelajaran"
              required
              {...form.getInputProps("name")}
            />
            <Button
              type="submit"
              loading={loading}
              fullWidth
              color={BASE_COLOR.primary}
            >
              Tambah Mata pelajaran
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
