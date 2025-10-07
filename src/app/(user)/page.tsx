"use client";

import { useRouter } from "@bprogress/next/app";
import { Button, Text } from "@mantine/core";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-2">
      <Text size="xl" fw={700}>
        Welcome to{" "}
        <a href="https://nextjs.org" className="text-blue-600">
          Next.js!
        </a>
      </Text>
      <Button mt="md" component="a" radius="md" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
}
