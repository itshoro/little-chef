import { Submit } from "@/app/(search)/recipes/components/RecipeForm/Form";
import { signup } from "./action";
import * as Input from "@/app/components/input";

const SignUpPage = async () => {
  return (
    <>
      <h1 className="font-medium">Create an account</h1>
      <p className="py-4 max-w-prose">
        Passwords are stored as an Argon2ID hash powered by{" "}
        <a
          className="underline underline-offset-2 decoration-stone-400"
          href="https://oslo.js.org/"
        >
          oslo
        </a>
        . Please note that no e-mail or password reset functionality is
        currently implemented and won't be as part of this small private test
        run.
      </p>
      <form action={signup}>
        <div className="pb-2">
          <Input.Root name="username">
            <Input.Label>Username</Input.Label>
            <Input.Group>
              <Input.Element type="text" />
            </Input.Group>
          </Input.Root>
        </div>
        <div className="pb-6">
          <Input.Root name="password">
            <Input.Label>Password</Input.Label>
            <Input.Group>
              <Input.Element type="password" />
            </Input.Group>
          </Input.Root>
        </div>
        <Submit>Continue</Submit>
      </form>
    </>
  );
};

export default SignUpPage;
