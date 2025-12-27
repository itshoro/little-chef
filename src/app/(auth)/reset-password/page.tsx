import { passwordResetRequestExists } from "@/lib/utils/auth/password-reset-request-exists";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import { ResetPasswordForm } from "./_components/reset-password-form";
import { resetPasswordAction } from "./action";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const token = (await searchParams).token;

  if (!(await passwordResetRequestExists(token))) {
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
        <ResetPasswordForm action={boundResetPasswordAction} />
      </div>
    </>
  );
};

export default ResetPasswordPage;
