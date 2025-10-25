import { validateSession } from "@/lib/utils/auth/validate-session";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ returnTo: string }>;
}) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const returnTo = (await searchParams).returnTo;
  const { user } = await validateSession();

  if (user) redirect((returnTo as Route) || "/recipes");

  return (
    <>
      <h1 className="font-medium">Login</h1>
      <div className="max-w-(--breakpoint-sm) py-4">
        <LoginForm returnTo={returnTo} />
      </div>
    </>
  );
};

export default LoginPage;
