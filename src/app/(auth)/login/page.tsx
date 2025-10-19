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
      username: (value) => {
        const trimmed = value.trim();
        if (trimmed.length < 3) {
          return "Username harus terdiri dari minimal 3 karakter";
        }
        return null;
      },

      password: (value) => {
        if (value.length < 6) {
          return "Password harus terdiri dari minimal 6 karakter";
        }
        return null;
      },
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
        title: "Sukses login",
        message: `Selamat datang kembali, ${result.user?.username}!`,
      });

      if (result.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch {
      notifications.show({
        color: "red",
        title: "Gagal login",
        message: "Terjadi kesalahan saat proses login",
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
          <Title order={2}>Login</Title>
          <Text size="sm" c="dimmed">
            Masuk untuk menjelajahi buku digital
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
              placeholder="Masukkan username Anda"
              required
              {...form.getInputProps("username")}
            />

            <PasswordInput
              label="Password"
              placeholder="Masukkan password Anda"
              required
              {...form.getInputProps("password")}
            />

            <Group align="center">
              <Checkbox
                label="Ingat saya"
                {...form.getInputProps("remember", { type: "checkbox" })}
              />

              <Anchor<"a">
                href="#"
                size="sm"
                onClick={(e) => e.preventDefault()}
              >
                Lupa password?
              </Anchor>
            </Group>

            <Button type="submit" fullWidth loading={loading} radius="md">
              Masuk
            </Button>
            <Button
              variant="default"
              fullWidth
              radius="md"
              onClick={handleBackToHome}
            >
              Kembali ke Beranda
            </Button>
          </Stack>
        </form>

        <Group mt="md">
          <Text size="sm">
            Tidak memiliki akun?{" "}
            <Anchor<"a"> href="#" onClick={(e) => e.preventDefault()}>
              Hubungi admin
            </Anchor>
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}
