import { getAllSubjects } from "@/app/api/subjects";
import { SubjectTableClient } from "./client";

export default async function SubjectTable() {
  const subjectAPIResponse = await getAllSubjects({ ebooks_count: true });

  const subjects =
    subjectAPIResponse.status === "success"
      ? subjectAPIResponse.subjects || []
      : [];

  return (
    <div className="flex flex-col gap-4 items-center">
      <SubjectTableClient subjects={subjects} />
    </div>
  );
}
