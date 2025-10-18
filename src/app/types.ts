import type { User } from "@prisma/client";

/**
 * Global types stored here
 */

type ExtendedUser = User & {
  ebooks_count: number;
};

export type { ExtendedUser };
