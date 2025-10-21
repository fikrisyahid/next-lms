import { Title } from "@mantine/core";
import AddSubjectModal from "./components/add-subject-modal";
import SubjectTable from "./components/table";

export default function SubjectsPage() {
  return (
    <div className="flex flex-col gap-4 items-stretch">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Title>Daftar Mata Pelajaran</Title>
        <AddSubjectModal />
      </div>
      <SubjectTable />
    </div>
  );
}
