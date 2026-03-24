import { LoginPage } from "@/components/login-page";

function getErrorMessage(error: string | undefined) {
  if (error === "forbidden") {
    return "This account is not authorized. Only superadmins can access this admin panel.";
  }

  if (error === "oauth") {
    return "Google login failed. Please try again.";
  }

  return null;
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return <LoginPage initialErrorMessage={getErrorMessage(error)} />;
}
