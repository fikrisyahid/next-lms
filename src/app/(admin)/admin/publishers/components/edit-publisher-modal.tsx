"use client";

import {
  Button,
  Stack,
  Text,
  TextInput,
  Modal,
  ActionIcon,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { BASE_COLOR } from "@/config/color";
import { updatePublisher } from "@/app/api/publishers/update";

type EditPublisherModalProps = {
  id: string;
  name: string;
};

type FormValues = {
  name: string;
};

export default function EditPublisherModal({
  id,
  name,
}: EditPublisherModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File>();
  const [changeLogo, setChangeLogo] = useState(false);

  const form = useForm<FormValues>({
    initialValues: { name },
    validate: { name: (v) => (v.trim() ? null : "Nama penerbit wajib diisi") },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await updatePublisher({
        id,
        name: values.name,
        logo,
      });

      if (result.status === "error") {
        notifications.show({
          title: "Gagal",
          message: result.message || "Gagal mengubah penerbit",
          color: "red",
        });
        setLoading(false);
        return;
      }

      notifications.show({
        title: "Sukses",
        message: `Penerbit ${result.publisher?.name} berhasil diubah`,
        color: "green",
      });

      form.reset();
      setLogo(undefined);
      setOpen(false);
      modals.closeAll();
      router.refresh();
    } catch (_) {
      notifications.show({
        title: "Gagal",
        message: "Gagal mengubah penerbit",
        color: "red",
      });
    }
    setLoading(false);
  };

  const handleFileSizeCheck = (file: File) => {
    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      notifications.show({
        title: "Ukuran file terlalu besar",
        message: "Ukuran file logo tidak boleh lebih dari 1MB",
        color: "red",
      });
      return false;
    }
    return true;
  };

  const confirmSubmit = (values: FormValues) => {
    modals.openConfirmModal({
      title: "Konfirmasi perubahan penerbit",
      centered: true,
      children: (
        <Text size="sm">
          Apakah kamu yakin ingin mengubah penerbit dengan nama{" "}
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
          setLogo(undefined);
          setChangeLogo(false);
        }}
        title="Ubah data penerbit"
        centered
      >
        <form onSubmit={form.onSubmit(confirmSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Nama penerbit"
              placeholder="Nama penerbit"
              required
              {...form.getInputProps("name")}
            />

            <Checkbox
              label="Ganti logo penerbit"
              checked={changeLogo}
              onChange={(e) => setChangeLogo(e.currentTarget.checked)}
            />

            {changeLogo && (
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
            )}

            {logo && changeLogo && (
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
              Ubah
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
