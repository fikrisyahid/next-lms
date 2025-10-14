"use client";

import { updateUser } from "@/app/api/users/update";
import {
  Button,
  PasswordInput,
  Select,
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
import { IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EditUserModalProps = {
  userId: string;
  fullname: string;
  username: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

type UserValues = EditUserModalProps & {
  password: string;
};

export default function EditUserModal({
  userId,
  fullname,
  username,
  role,
}: EditUserModalProps) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const form = useForm<UserValues>({
    initialValues: {
      userId,
      fullname,
      username,
      password: "",
      role,
    },
    validate: {
      fullname: (v) => (v.trim() ? null : "Full name is required"),
      username: (v) =>
        v.length >= 3 ? null : "Username must be at least 3 characters",
      password: (v) =>
        !changePassword
          ? null
          : v.length >= 6
            ? null
            : "Password must be at least 6 characters",
      role: (v) => (v ? null : "Role is required"),
    },
  });

  const handleSubmit = async (values: UserValues) => {
    setLoading(true);
    try {
      const result = await updateUser(values);

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
        message: `User ${result?.user?.username} (${result.user?.role}) has been updated successfully!`,
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

  const confirmSubmit = (values: UserValues) => {
    modals.openConfirmModal({
      title: "Confirm user update",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to update <b>{values.username}</b> as{" "}
          <b>{values.role}</b>?
        </Text>
      ),
      labels: { confirm: "Yes, Update", cancel: "Cancel" },
      confirmProps: { color: "blue", loading },
      onConfirm: () => handleSubmit(values),
    });
  };

  return (
    <>
      <ActionIcon
        variant="filled"
        color="yellow"
        onClick={() => setOpened(true)}
      >
        <IconPencil style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
        title="Update User"
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

            <Checkbox
              label="Change user password"
              checked={changePassword}
              onChange={(e) => setChangePassword(e.currentTarget.checked)}
            />

            <PasswordInput
              label="New Password"
              placeholder="New Password"
              required
              disabled={!changePassword}
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
              Update
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
