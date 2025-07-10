"use client";

import { SubmitWithPending } from "@/components/forms/form/submit-with-pending";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Label } from "@/components/ui/controls/label";
import { passwordRange, usernameRange } from "@/lib/validators/user";
import Link from "next/link";
import { useTransition } from "react";
import { signupAction } from "../action";
import { Input } from "@/components/ui/controls/input";

const SingUpForm = () => {
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      await signupAction(formData);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <FieldRoot name="username">
          <Label>Username</Label>
          <Input
            required
            minLength={usernameRange.min}
            maxLength={usernameRange.max}
            autoComplete="username"
          />
        </FieldRoot>
      </div>
      <div className="mb-4">
        <FieldRoot name="password">
          <Label>Password</Label>
          <Input
            type="password"
            required
            minLength={passwordRange.min}
            maxLength={passwordRange.max}
            autoComplete="new-password"
          />
        </FieldRoot>
      </div>
      <div className="mb-4">
        <FieldRoot name="confirmation-password">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            required
            minLength={passwordRange.min}
            maxLength={passwordRange.max}
            autoComplete="new-password"
          />
        </FieldRoot>
      </div>
      <div className="mb-4 w-48">
        <FieldRoot name="invite-code">
          <Label>Invite Code</Label>
          <Input type="password" required autoComplete="off" />
        </FieldRoot>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <span>
          Already have an account?{" "}
          <Link className="text-lime-300 underline" href="/login">
            Sign in
          </Link>
        </span>
        <SubmitWithPending>Register</SubmitWithPending>
      </div>
    </form>
  );
};

export { SingUpForm };
