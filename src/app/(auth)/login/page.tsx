"use client";

import login from "@/lib/auth/login";
import { useRouter } from "@bprogress/next/app";
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

type LoginValues = {
  username: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({
    initialValues: {
      username: "",
      password: "",
      remember: true,
    },

    validate: {
      username: (value) =>
        value.trim().length >= 3
          ? null
          : "Username must be at least 3 characters",
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const handleSubmit = async (values: LoginValues) => {
    setLoading(true);
    try {
      const result = await login({
        username: values.username,
        password: values.password,
        rememberMe: values.remember,
      });

      if (result.status === "error") {
        notifications.show({
          color: "red",
          title: "Login failed",
          message: result.errorMessage,
        });
        setLoading(false);
        return;
      }

      notifications.show({
        color: "green",
        title: "Login successful",
        message: `Welcome back, ${result.user?.username}!`,
      });

      if (result.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch {
      notifications.show({
        color: "red",
        title: "Login failed",
        message: "An unexpected error occurred",
      });
    }
    setLoading(false);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <Paper
      radius="md"
      p="xl"
      withBorder
      shadow="sm"
      style={{ width: 420, maxWidth: "100%" }}
    >
      <Stack gap="xs">
        <div>
          <Title order={2}>Sign In</Title>
          <Text size="sm" c="dimmed">
            Sign in to browse digital books
          </Text>
        </div>

        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <Stack gap="md">
            <TextInput
              label="Username"
              placeholder="Input your username"
              required
              {...form.getInputProps("username")}
            />

            <PasswordInput
              label="Password"
              placeholder="Input your password"
              required
              {...form.getInputProps("password")}
            />

            <Group align="center">
              <Checkbox
                label="Remember me"
                {...form.getInputProps("remember", { type: "checkbox" })}
              />

              <Anchor<"a">
                href="#"
                size="sm"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </Anchor>
            </Group>

            <Button type="submit" fullWidth loading={loading} radius="md">
              Sign In
            </Button>
            <Button
              variant="default"
              fullWidth
              radius="md"
              onClick={handleBackToHome}
            >
              Back to Home
            </Button>
          </Stack>
        </form>

        <Group mt="md">
          <Text size="sm">
            Don't have an account?{" "}
            <Anchor<"a"> href="#" onClick={(e) => e.preventDefault()}>
              Contact the admin
            </Anchor>
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}
