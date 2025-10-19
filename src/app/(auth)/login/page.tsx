import { validateSession } from "@/lib/auth/validate-session";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";
import type { Route } from "next";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ returnTo: string }>;
}) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const targetPage = (await searchParams).returnTo;
  const { user } = await validateSession();

  if (user) redirect((targetPage as Route) || "/recipes");

  return (
    <>
      <h1 className="font-medium">Login</h1>
      <div className="max-w-(--breakpoint-sm) py-4">
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
