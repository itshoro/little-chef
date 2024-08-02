import { Submit } from "@/app/recipes/components/recipe-form";
import { signupAction } from "./action";
import * as Input from "@/app/components/input";
import * as Form from "@/app/components/form";
import { validateRequest } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";

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
              <Input.Element type="text" />
            </Input.Group>
          </Input.Root>
        </div>
        <div className="max-w-96 pb-6">
          <Input.Root name="password">
            <Input.Label>Password</Input.Label>
            <Input.Group>
              <Input.Element type="password" />
            </Input.Group>
          </Input.Root>
        </div>
        <div className="max-w-24 pb-6">
          <Input.Root name="invite-code">
            <Input.Label>Invite Code</Input.Label>
            <Input.Group>
              <Input.Element type="text" />
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
