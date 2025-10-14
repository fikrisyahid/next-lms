"use client";

import { createPublisher } from "@/app/api/publishers/create";
import { Button, Stack, Text, TextInput, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormValues = {
  name: string;
};

export default function AddPublisherModal() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
    },
    validate: {
      name: (v) => (v.trim() ? null : "Publisher name is required"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await createPublisher(values);

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
        <form onSubmit={form.onSubmit((values) => confirmSubmit(values))}>
          <Stack gap="sm">
            <TextInput
              label="Name"
              placeholder="Publisher name"
              required
              {...form.getInputProps("name")}
            />
            <Button type="submit" loading={loading} fullWidth>
              Create
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
