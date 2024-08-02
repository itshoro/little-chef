import NextLink from "next/link";
import { loginAction } from "./action";
import * as Input from "@/app/components/input";
import * as Form from "@/app/components/form";
import { Submit } from "@/app/recipes/components/recipe-form";
import { validateRequest } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { user } = await validateRequest();

  if (user) redirect("/recipes");

  return (
    <>
      <h1 className="font-medium">Login</h1>
      <div className="py-4">
        <Form.Root action={loginAction}>
          <div>
            <Input.Root name="username">
              <Input.Label>Username</Input.Label>
              <Input.Group>
                <Input.Element type="text" />
              </Input.Group>
            </Input.Root>
          </div>
          <div className="mb-6 mt-2">
            <Input.Root name="password">
              <Input.Label>Password</Input.Label>
              <Input.Group>
                <Input.Element type="password" />
              </Input.Group>
            </Input.Root>
          </div>
          <Form.ErrorDisplay />
          <Submit>Continue</Submit>
        </Form.Root>
      </div>
      <NextLink href="/sign-up">Create an account</NextLink>
    </>
  );
};

export default LoginPage;
