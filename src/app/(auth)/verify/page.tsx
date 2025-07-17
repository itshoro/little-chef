import { getAuthenticatedUserFromRequest } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { redirect } from "next/navigation";
import { VerifyForm } from "./_components/verify-form";
import { verifyAction, verifySchema } from "./action";

type VerifyPageProps = {
  searchParams: Promise<{
    redirect?: string | string[];
    scope?: string | string[];
  }>;
};

const VerifyPage = async (params: VerifyPageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await getAuthenticatedUserFromRequest();
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
        <VerifyForm action={boundVerifyAction} />
      </div>
    </>
  );
};

export default VerifyPage;
