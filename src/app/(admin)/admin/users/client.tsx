import { TextInput } from "@mantine/core";
import { UserTable } from "./table";

export default function UserClient() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <TextInput className="w-full" placeholder="Search user data" />
      <UserTable />
    </div>
  )
}
