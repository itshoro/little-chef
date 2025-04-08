import * as Form from "@/app/components/form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import * as Input from "@/app/components/input";
import { validateRequest } from "@/lib/auth";
import { passwordRange, usernameRange } from "@/lib/dal/user/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "./action";
import { isRateLimitedGlobally } from "@/lib/rate-limit/helper";

const LoginPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user } = await validateRequest();
  if (user) redirect("/recipes");

  return (
    <>
      <h1 className="font-medium">Login</h1>
      <div className="max-w-(--breakpoint-sm) py-4">
        <Form.Root action={loginAction}>
          <div className="mb-4">
            <Input.Root name="username">
              <Input.Label className="pb-2">Username</Input.Label>
              <Input.Group>
                <Input.Element
                  type="text"
                  minLength={usernameRange.min}
                  maxLength={usernameRange.max}
                  autoComplete="username"
                />
              </Input.Group>
              <Input.InlineError />
            </Input.Root>
          </div>
          <div className="mb-4">
            <Input.Root name="password">
              <Input.Label className="pb-2">Password</Input.Label>
              <Input.Group>
                <Input.Element
                  type="password"
                  minLength={passwordRange.min}
                  maxLength={passwordRange.max}
                  autoComplete="current-password"
                />
              </Input.Group>
              <Input.InlineError />
            </Input.Root>
          </div>

          <Form.Alert />

          <div className="mt-2 flex items-baseline justify-between">
            <span>
              Don't have an account?{" "}
              <Link className="text-lime-300 underline" href="/sign-up">
                Sign up
              </Link>
            </span>
            <SubmitWithPending>Login</SubmitWithPending>
          </div>
        </Form.Root>
      </div>
    </>
  );
};

export default LoginPage;
