import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { redirect } from "next/navigation";
import { SingUpForm } from "./_components/sign-up-form";
const SignUpPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";

  const { user } = await validateSession();
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
        <SingUpForm />
      </div>
    </>
  );
};

export default SignUpPage;
