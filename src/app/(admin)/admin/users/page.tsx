import { Title } from "@mantine/core";
import UserClient from "./client";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4 items-stretch">
      <Title>Users page</Title>
      <UserClient />
    </div>
  );
}
