"use client";

import { Card, Image, SimpleGrid, Stack, Text } from "@mantine/core";
import type { Publisher } from "@prisma/client";
import { IconPhoto } from "@tabler/icons-react";
import DeletePublisherModal from "./delete-publisher-modal";

export default function PublisherList({
  publishers,
}: {
  publishers: Publisher[];
}) {
  if (!publishers || publishers.length === 0) {
    return (
      <Text ta="center" c="dimmed" mt="md">
        No publishers found.
      </Text>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
      spacing="md"
      verticalSpacing="lg"
    >
      {publishers.map((pub) => (
        <Card
          key={pub.id}
          shadow="sm"
          radius="md"
          padding="sm"
          withBorder
          className="flex flex-col items-center justify-between text-center hover:shadow-md transition-shadow"
        >
          {pub.logoUrl ? (
            <Image
              src={pub.logoUrl}
              alt={pub.name}
              height={100}
              width={100}
              fit="contain"
              radius="md"
              mb="xs"
            />
          ) : (
            <div className="flex items-center justify-center h-[100px] w-full bg-gray-100 rounded-md">
              <IconPhoto size={40} stroke={1.3} color="gray" />
            </div>
          )}
          <Stack align="center">
            <Text fw={500} size="sm" mt="xs">
              {pub.name}
            </Text>
            <DeletePublisherModal id={pub.id} name={pub.name} />
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
