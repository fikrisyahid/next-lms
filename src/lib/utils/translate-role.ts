export default function translateRole({ role }: { role: string }) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "TEACHER":
      return "Guru";
    case "STUDENT":
      return "Siswa";
    default:
      return "Unknown Role";
  }
}
