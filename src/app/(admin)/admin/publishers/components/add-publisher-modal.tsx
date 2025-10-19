"use client";

import { createPublisher } from "@/app/api/publishers";
import { Button, Stack, Text, TextInput, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

type FormValues = {
  name: string;
};

export default function AddPublisherModal() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File>();

  const form = useForm<FormValues>({
    initialValues: { name: "" },
    validate: { name: (v) => (v.trim() ? null : "Publisher name is required") },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await createPublisher({
        name: values.name,
        logo,
      });

      if (result.status === "error") {
        notifications.show({
          title: "Error",
          message: result.message,
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Success",
        message: `Publisher ${result.publisher?.name} has been created successfully!`,
        color: "green",
      });

      form.reset();
      setLogo(undefined);
      setOpened(false);
      modals.closeAll();
      router.refresh();
    } catch (_) {
      notifications.show({
        title: "Error",
        message: "Failed to create publisher",
        color: "red",
      });
    }
    setLoading(false);
  };

  const confirmSubmit = (values: FormValues) => {
    modals.openConfirmModal({
      title: "Konfirmasi Penambahan Penerbit",
      centered: true,
      children: (
        <Text size="sm">
          Apakah kamu yakin ingin menambahkan penerbit dengan nama{" "}
          <b>{values.name}</b>?
        </Text>
      ),
      labels: { confirm: "Ya, Tambah", cancel: "Batal" },
      confirmProps: { color: "blue", loading },
      onConfirm: () => handleSubmit(values),
    });
  };

  return (
    <>
      <Button
        leftSection={<IconPlus stroke={1.5} />}
        onClick={() => setOpened(true)}
      >
        Tambah Penerbit
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Tambah Penerbit Baru"
        centered
      >
        <form onSubmit={form.onSubmit(confirmSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Name"
              placeholder="Nama Penerbit"
              required
              {...form.getInputProps("name")}
            />

            <Text fw={500}>Logo Penerbit (opsional)</Text>
            <Dropzone
              onDrop={(files) => setLogo(files[0])}
              accept={IMAGE_MIME_TYPE}
              multiple={false}
              maxSize={2 * 1024 * 1024}
            >
              <Text ta="center">
                Drop atau klik untuk mengunggah logo (maks 2MB)
              </Text>
            </Dropzone>

            {logo && (
              <div className="flex flex-col items-center">
                <Image
                  src={URL.createObjectURL(logo)}
                  alt="Preview"
                  width={300}
                  height={300}
                />
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth>
              Tambah Penerbit
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
