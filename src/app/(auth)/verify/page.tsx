import {
  redirectToSignIn,
  requireSession,
} from "@/lib/utils/auth/require-session";
import { isRateLimitedGlobally } from "@/lib/utils/rate-limit/global";
import type { Route } from "next";
import { VerifyForm } from "./_components/verify-form";
import { verifyAction } from "./action";

type VerifyPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

const VerifyPage = async (params: VerifyPageProps) => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const searchParams = await params.searchParams;
  if (
    !searchParams.redirect ||
    typeof searchParams.redirect !== "string" ||
    !searchParams.redirect.startsWith("/")
  ) {
    throw new Error("Invalid redirect URL");
  }

  await requireSession({
    onUnauthenticated: () => redirectToSignIn(searchParams.redirect as Route),
  });

  const boundVerifyAction = verifyAction.bind(null, searchParams.redirect);

  return (
    <>
      <h1 className="font-medium">Verify Session</h1>
      <div className="max-w-(--breakpoint-sm) py-4">
        <div className="mb-4 space-y-2">
          <p>
            Please verify your credentials to continue. This is required to
            access certain features.
          </p>
        </div>
        <VerifyForm action={boundVerifyAction} />
      </div>
    </>
  );
};

export default VerifyPage;
