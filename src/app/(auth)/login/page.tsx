import NextLink from "next/link";
import { login } from "./action";
import * as Input from "@/app/components/input";
import { Submit } from "@/app/recipes/components/recipe-form";
import { validateRequest } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { user } = await validateRequest();

  if (user) redirect("/recipes");

  return (
    <>
      <h1 className="font-medium">Login</h1>
      <form className="py-4" action={login}>
        <div className="pb-2">
          <Input.Root name="username">
            <Input.Label>Username</Input.Label>
            <Input.Group>
              <Input.Element type="text" />
            </Input.Group>
          </Input.Root>
        </div>
        <div className="pb-6">
          <Input.Root name="password">
            <Input.Label>Password</Input.Label>
            <Input.Group>
              <Input.Element type="password" />
            </Input.Group>
          </Input.Root>
        </div>
        <Submit>Continue</Submit>
      </form>
      <NextLink href="/sign-up">Create an account</NextLink>
    </>
  );
};

export default LoginPage;
