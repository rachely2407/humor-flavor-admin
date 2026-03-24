import { ReactNode } from "react";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";

export default async function AdminImagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireMatrixOrSuperadmin();
  return children;
}