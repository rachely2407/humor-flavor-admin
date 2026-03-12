import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireMatrixOrSuperadmin();

  return <>{children}</>;
}