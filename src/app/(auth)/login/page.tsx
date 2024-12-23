import * as Form from "@/app/components/form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import * as Input from "@/app/components/input";
import { validateRequest } from "@/lib/auth/lucia";
import { passwordRange, usernameRange } from "@/lib/dal/user/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "./action";

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
              <Input.Label className="pb-2">Username</Input.Label>
              <Input.Group>
                <Input.Element
                  type="text"
                  minLength={usernameRange.min}
                  maxLength={usernameRange.max}
                />
              </Input.Group>
              <Input.InlineError />
            </Input.Root>
          </div>
          <div className="mt-2 mb-6">
            <Input.Root name="password">
              <Input.Label className="pb-2">Password</Input.Label>
              <Input.Group>
                <Input.Element
                  type="password"
                  minLength={passwordRange.min}
                  maxLength={passwordRange.max}
                />
              </Input.Group>
              <Input.InlineError />
            </Input.Root>
          </div>

          <Form.Alert />

          <div className="flex items-baseline justify-between">
            <Link className="text-lime-300 underline" href="/sign-up">
              Create an account
            </Link>
            <SubmitWithPending>Continue</SubmitWithPending>
          </div>
        </Form.Root>
      </div>
    </>
  );
};

export default LoginPage;
