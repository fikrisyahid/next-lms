"use client";

import { registerUser } from "@/lib/auth/register";
import {
  Button,
  Center,
  Paper,
  PasswordInput,
  rem,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useTransition } from "react";

type RegisterValues = {
  fullname: string;
  username: string;
  password: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

export function RegisterForm() {
  const [pending, startTransition] = useTransition();

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

  const handleSubmit = (values: RegisterValues) => {
    startTransition(async () => {
      try {
        const result = await registerUser(values);

        notifications.show({
          title: "Success",
          message: `User ${result.user?.username} with role ${result.user?.role} created successfully!`,
          color: "green",
        });

        form.reset();
      } catch (_) {
        notifications.show({
          title: "Error",
          message: "Failed to create user",
          color: "red",
        });
      }
    });
  };

  return (
    <Center style={{ minHeight: "70vh", padding: rem(12) }}>
      <Paper radius="md" p="xl" withBorder style={{ width: 420 }}>
        <Stack gap="md">
          <div>
            <Title order={2}>Register User</Title>
            <Text size="sm" c="dimmed">
              Developer access only 🔐
            </Text>
          </div>

          <form onSubmit={form.onSubmit(handleSubmit)}>
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

              <Button type="submit" loading={pending} fullWidth>
                Register
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Center>
  );
}
