import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ returnTo: string }>;
}) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const targetPage = (await searchParams).returnTo;

  console.log({ targetPage });

  const { user } = await getAuthenticatedUserFromRequest();
  if (user) redirect(targetPage || "/recipes");

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
