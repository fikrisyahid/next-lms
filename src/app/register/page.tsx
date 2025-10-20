import { redirect } from "next/navigation";
import { RegisterForm } from "./form";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function RegisterPage(props: {
  searchParams: SearchParams;
}) {
  const SECRET_KEY = process.env.REGISTER_KEY || "adminsecret";

  const searchParams = await props.searchParams;
  const key = searchParams.key;

  if (key !== SECRET_KEY) {
    redirect("/");
  }

  return <RegisterForm />;
}
