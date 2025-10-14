"use client";

import { createUser } from "@/app/api/users";
import {
  Button,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RegisterValues = {
  fullname: string;
  username: string;
  password: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

export default function AddUserModal() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterValues>({
    initialValues: {
      fullname: "",
      username: "",
      password: "",
      role: "STUDENT",
    },
    validate: {
      fullname: (v) => (v.trim() ? null : "Full name is required"),
      username: (v) =>
        v.length >= 3 ? null : "Username must be at least 3 characters",
      password: (v) =>
        v.length >= 6 ? null : "Password must be at least 6 characters",
      role: (v) => (v ? null : "Role is required"),
    },
  });

  const handleSubmit = async (values: RegisterValues) => {
    setLoading(true);
    try {
      const result = await createUser(values);

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
        message: `User ${result?.user?.username} (${result.user?.role}) has been created successfully!`,
        color: "green",
      });

      form.reset();
      setOpened(false);
      modals.closeAll();
      router.refresh();
    } catch (_) {
      notifications.show({
        title: "Error",
        message: "Failed to create user",
        color: "red",
      });
    }
    setLoading(false);
  };

  const confirmSubmit = (values: RegisterValues) => {
    modals.openConfirmModal({
      title: "Confirm user creation",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to add <b>{values.username}</b> as{" "}
          <b>{values.role}</b>?
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
        onClick={() => setOpened(true)}
        leftSection={<IconPlus stroke={1.5} />}
      >
        Add User
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add New User"
        centered
      >
        <form onSubmit={form.onSubmit((values) => confirmSubmit(values))}>
          <Stack gap="sm">
            <TextInput
              label="Full name"
              placeholder="Full name"
              required
              {...form.getInputProps("fullname")}
            />

            <TextInput
              label="Username"
              placeholder="Username"
              required
              {...form.getInputProps("username")}
            />

            <PasswordInput
              label="Password"
              placeholder="Password"
              required
              {...form.getInputProps("password")}
            />

            <Select
              label="Role"
              placeholder="Select role"
              data={[
                { value: "ADMIN", label: "Admin" },
                { value: "TEACHER", label: "Teacher" },
                { value: "STUDENT", label: "Student" },
              ]}
              required
              {...form.getInputProps("role")}
            />

            <Button type="submit" loading={loading} fullWidth>
              Register
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
