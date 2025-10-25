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
import { BASE_COLOR } from "@/config/color";
import getFilesURL from "@/lib/storage/get-files-url";

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
    validate: { name: (v) => (v.trim() ? null : "Nama penerbit wajib diisi") },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const { data: logoUrls } = await getFilesURL({
        files: logo,
      });

      const logoUrl = logoUrls ? logoUrls[0].publicUrl : undefined;

      const result = await createPublisher({
        name: values.name,
        logoUrl,
      });

      if (result.status === "error") {
        notifications.show({
          title: "Gagal",
          message: result.message || "Gagal menambahkan penerbit",
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Sukses",
        message: `Penerbit ${result.publisher?.name} berhasil ditambahkan!`,
        color: "green",
      });

      form.reset();
      setLogo(undefined);
      setOpened(false);
      modals.closeAll();
      router.refresh();
    } catch (_) {
      notifications.show({
        title: "Gagal",
        message: "Gagal menambahkan penerbit",
        color: "red",
      });
    }
    setLoading(false);
  };

  const handleFileSizeCheck = (file: File) => {
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      notifications.show({
        title: "Ukuran file terlalu besar",
        message: "Ukuran file logo tidak boleh lebih dari 2MB",
        color: "red",
      });
      return false;
    }
    return true;
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
        Tambah Penerbit
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
          setLogo(undefined);
        }}
        title="Tambah Penerbit Baru"
        centered
      >
        <form onSubmit={form.onSubmit(confirmSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Nama"
              placeholder="Nama Penerbit"
              required
              {...form.getInputProps("name")}
            />

            <Text fw={500}>Logo Penerbit (opsional)</Text>
            <Dropzone
              onDrop={(files) => {
                const fileSizeValid = handleFileSizeCheck(files[0]);
                if (fileSizeValid) {
                  setLogo(files[0]);
                }
              }}
              accept={IMAGE_MIME_TYPE}
              multiple={false}
            >
              <Text ta="center">
                Drop atau klik untuk mengunggah logo (maks 1MB)
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

            <Button
              type="submit"
              loading={loading}
              fullWidth
              color={BASE_COLOR.primary}
            >
              Tambah Penerbit
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
