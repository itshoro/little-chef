import NextLink from "next/link";
import { loginAction } from "./action";
import * as Input from "@/app/components/input";
import * as Form from "@/app/components/form";
import { Submit } from "@/app/(default)/recipes/components/recipe-form";
import { validateRequest } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";
import { passwordRange, usernameRange } from "@/lib/dal/user";

const LoginPage = async () => {
  const { user } = await validateRequest();

  if (user) redirect("/recipes");

  return (
    <>
      <h1 className="font-medium">Login</h1>
      <div className="max-w-(--breakpoint-sm) py-4">
        <Form.Root action={loginAction}>
          <div>
            <Input.Root name="username">
              <Input.Label>Username</Input.Label>
              <Input.Group>
                <Input.Element
                  type="text"
                  minLength={usernameRange.min}
                  maxLength={usernameRange.max}
                />
              </Input.Group>
            </Input.Root>
          </div>
          <div className="mt-2 mb-6">
            <Input.Root name="password">
              <Input.Label>Password</Input.Label>
              <Input.Group>
                <Input.Element
                  type="password"
                  minLength={passwordRange.min}
                  maxLength={passwordRange.max}
                />
              </Input.Group>
            </Input.Root>
          </div>
          <Form.ErrorDisplay />
          <div className="flex items-baseline justify-between">
            <NextLink className="text-lime-300 underline" href="/sign-up">
              Create an account
            </NextLink>
            <Submit>Continue</Submit>
          </div>
        </Form.Root>
      </div>
    </>
  );
};

export default LoginPage;
