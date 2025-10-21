import type { Category, Publisher, User } from "@prisma/client";

/**
 * Global types stored here
 */

type ExtendedUser = User & {
  ebooks_count: number;
};

type ExtendedPublisher = Publisher & {
  ebooks_count: number;
};

type ExtendedCategory = Category & {
  ebooks_count: number;
};

export type { ExtendedUser, ExtendedPublisher, ExtendedCategory };
