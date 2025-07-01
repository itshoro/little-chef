import * as Form from "@/components/forms/form";
import { SubmitWithPending } from "@/components/forms/form/submit-with-pending";
import * as Input from "@/components/forms/input";
import { findPasswordResetRequest } from "@/lib/auth";
import { passwordRange } from "@/lib/dal/user/types";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { resetPasswordAction } from "./action";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const token = (await searchParams).token;

  const resetRequest = await findPasswordResetRequest(token);
  if (resetRequest === null) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-4xl font-bold">Invalid Token</h1>
        <p className="text-lg">The provided token is invalid or expired.</p>
      </div>
    );
  }

  const boundResetPasswordAction = resetPasswordAction.bind(null, token);

  return (
    <>
      <h1 className="font-medium">Reset Password</h1>
      <div className="max-w-(--breakpoint-sm) py-4">
        <p className="mb-4 max-w-prose">
          Passwords are stored as an Argon2ID hash powered by{" "}
          <a
            className="underline decoration-stone-400 underline-offset-2"
            href="https://oslo.js.org/"
          >
            oslo
          </a>
          .
        </p>
        <p className="mb-4 max-w-prose">
          By resetting your password, you will also be logged out from all other
          devices.
        </p>
        <Form.Root action={boundResetPasswordAction}>
          <div className="mb-4">
            <Input.Root name="password">
              <Input.Label className="pb-2">New Password</Input.Label>
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

          <Form.Alert />

          <div className="mt-2 flex items-baseline justify-between">
            <SubmitWithPending>Register</SubmitWithPending>
          </div>
        </Form.Root>
      </div>
    </>
  );
};

export default ResetPasswordPage;
