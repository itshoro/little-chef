import * as Form from "@/app/components/form";
import * as Input from "@/app/components/input";
import { Submit } from "@/app/(default)/recipes/components/recipe-form";
import { validateRequest } from "@/lib/auth/lucia";
import { passwordRange, usernameRange } from "@/lib/dal/user";
import { redirect } from "next/navigation";
import { signupAction } from "./action";

const SignUpPage = async () => {
  const { user } = await validateRequest();

  if (user) redirect("/recipes");

  return (
    <>
      <h1 className="font-medium">Create an account</h1>
      <p className="max-w-prose py-4">
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
        <div className="max-w-96 pb-2">
          <Input.Root name="username">
            <Input.Label>Username</Input.Label>
            <Input.Group>
              <Input.Element
                type="text"
                required
                minLength={usernameRange.min}
                maxLength={usernameRange.max}
              />
            </Input.Group>
          </Input.Root>
        </div>
        <div className="max-w-96 pb-6">
          <Input.Root name="password">
            <Input.Label>Password</Input.Label>
            <Input.Group>
              <Input.Element
                type="password"
                required
                minLength={passwordRange.min}
                maxLength={passwordRange.max}
              />
            </Input.Group>
          </Input.Root>
        </div>
        <div className="max-w-24 pb-6">
          <Input.Root name="invite-code">
            <Input.Label>Invite Code</Input.Label>
            <Input.Group>
              <Input.Element type="text" required />
            </Input.Group>
          </Input.Root>
        </div>
        <Form.ErrorDisplay />
        <Submit>Continue</Submit>
      </Form.Root>
    </>
  );
};

export default SignUpPage;
