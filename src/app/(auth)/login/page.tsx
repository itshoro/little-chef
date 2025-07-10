import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";

const LoginPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user } = await getAuthenticatedUserFromRequest();
  if (user) redirect("/recipes");

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
