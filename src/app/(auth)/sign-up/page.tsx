import * as Form from "@/components/forms/form";
import { SubmitWithPending } from "@/components/forms/form/submit-with-pending";
import * as Input from "@/components/forms/input";
import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { passwordRange, usernameRange } from "@/lib/validators/user";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signupAction } from "./action";

const SignUpPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user } = await getAuthenticatedUserFromRequest();
  if (user) redirect("/recipes");

  return (
    <>
      <h1 className="font-medium">Create an account</h1>
      <div className="max-w-(--breakpoint-sm) py-4">
        <p className="mb-4 max-w-prose">
          Passwords are stored as an Argon2ID hash powered by{" "}
          <a
            className="underline decoration-stone-400 underline-offset-2"
            href="https://oslo.js.org/"
          >
            oslo
          </a>
          . Please note that no e-mail or password reset functionality is
          currently implemented and won't be as part of this small private test
          run.
        </p>
        <Form.Root action={signupAction}>
          <div className="mb-4">
            <Input.Root name="username">
              <Input.Label className="pb-2">Username</Input.Label>
              <Input.Group>
                <Input.Element
                  type="text"
                  required
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
                  required
                  minLength={passwordRange.min}
                  maxLength={passwordRange.max}
                  autoComplete="new-password"
                />
              </Input.Group>
              <Input.InlineError />
            </Input.Root>
          </div>
          <div className="mb-4">
            <Input.Root name="confirmation-password">
              <Input.Label className="pb-2">Confirm Password</Input.Label>
              <Input.Group>
                <Input.Element
                  type="password"
                  required
                  minLength={passwordRange.min}
                  maxLength={passwordRange.max}
                  autoComplete="new-password"
                />
              </Input.Group>
              <Input.InlineError />
            </Input.Root>
          </div>
          <div className="mb-4 w-48">
            <Input.Root name="invite-code">
              <Input.Label className="pb-2">Invite Code</Input.Label>
              <Input.Group>
                <Input.Element type="text" required autoComplete="off" />
              </Input.Group>
              <Input.InlineError />
            </Input.Root>
          </div>

          <Form.Alert />

          <div className="mt-2 flex items-baseline justify-between">
            <span>
              Already have an account?{" "}
              <Link className="text-lime-300 underline" href="/login">
                Sign in
              </Link>
            </span>
            <SubmitWithPending>Register</SubmitWithPending>
          </div>
        </Form.Root>
      </div>
    </>
  );
};

export default SignUpPage;
