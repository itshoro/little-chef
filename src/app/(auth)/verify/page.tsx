import * as Form from "@/app/components/form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import * as Input from "@/app/components/input";
import { validateRequest } from "@/lib/auth";
import { passwordRange, usernameRange } from "@/lib/dal/user/types";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { redirect } from "next/navigation";
import { verifyAction, verifySchema } from "./action";

type VerifyPageProps = {
  searchParams: Promise<{
    redirect?: string | string[];
    scope?: string | string[];
  }>;
};

const VerifyPage = async (params: VerifyPageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const verifiedParams = verifySchema.safeParse(await params.searchParams);
  if (!verifiedParams.success) {
    return (
      <>
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="mb-4 text-4xl font-bold">Invalid Parameters</h1>
          <p className="text-lg">{verifiedParams.error.message}</p>
        </div>
      </>
    );
  }

  const boundVerifyAction = verifyAction.bind(
    null,
    verifiedParams.data.redirect,
    verifiedParams.data.scope,
  );

  return (
    <>
      <h1 className="font-medium">Verify Session</h1>
      <div className="max-w-(--breakpoint-sm) py-4">
        <div className="mb-4 space-y-2">
          <p>
            Please verify your credentials to continue. This is required to
            access certain features.
          </p>
          <p>
            Verifying your credentials will add the scopes{" "}
            {verifiedParams.data.scope.join(", ")} to your session for 15
            minutes.
          </p>
        </div>
        <Form.Root action={boundVerifyAction}>
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
            <SubmitWithPending>Verify Credentials</SubmitWithPending>
          </div>
        </Form.Root>
      </div>
    </>
  );
};

export default VerifyPage;
