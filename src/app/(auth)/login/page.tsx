import { validateRequest } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";
import { loginAction } from "./action";
import { LoginForm } from "./form";

const LoginPage = async () => {
  const { user } = await validateRequest();
  if (user) redirect("/recipes");

  return (
    <>
      <h1 className="font-medium">Login</h1>
      <div className="max-w-(--breakpoint-sm) py-4">
        <LoginForm action={loginAction} />
      </div>
    </>
  );
};

export default LoginPage;
