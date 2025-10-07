"use client";

import { Button, Center, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Center style={{ minHeight: "100vh", padding: 16 }}>
      <Stack align="center" gap="sm">
        <Title order={2}>Page Not Found</Title>

        <Text c="dimmed" ta="center" maw={360}>
          Oops! The page you’re looking for doesn’t exist or may have been moved
          😕
        </Text>

        <Group>
          <Button
            component={Link}
            href="/"
            variant="light"
            color="blue"
            radius="md"
            leftSection={<IconArrowLeft stroke={1.5} />}
          >
            Back to Home
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}
