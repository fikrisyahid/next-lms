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
  const [logo, setLogo] = useState<File | null>(null);

  const form = useForm<FormValues>({
    initialValues: { name: "" },
    validate: { name: (v) => (v.trim() ? null : "Publisher name is required") },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!logo) {
      notifications.show({
        title: "Error",
        message: "Please upload a logo",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await createPublisher({
        name: values.name,
        logo, // kirim ke server
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
      setLogo(null);
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
      title: "Confirm publisher creation",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to add publisher <b>{values.name}</b>?
        </Text>
      ),
      labels: { confirm: "Yes, Add", cancel: "Cancel" },
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
        Add Publisher
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add New Publisher"
        centered
      >
        <form onSubmit={form.onSubmit(confirmSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Name"
              placeholder="Publisher name"
              required
              {...form.getInputProps("name")}
            />

            <Text fw={500}>Publisher Logo</Text>
            <Dropzone
              onDrop={(files) => setLogo(files[0])}
              accept={IMAGE_MIME_TYPE}
              multiple={false}
              maxSize={2 * 1024 * 1024}
            >
              <Text ta="center">Drop or click to upload logo (max 2MB)</Text>
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
              Create
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
