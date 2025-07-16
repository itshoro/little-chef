"use client";

import { PendingButton } from "@/components/ui/buttons/pending-button";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Input } from "@/components/ui/controls/input";
import { Label } from "@/components/ui/controls/label";
import { passwordRange, usernameRange } from "@/lib/validators/user";
import Link from "next/link";
import { useTransition } from "react";
import { loginAction } from "../action";

const LoginForm = () => {
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      await loginAction(formData);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <FieldRoot name="username">
          <Label>Username</Label>
          <Input
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
            minLength={passwordRange.min}
            maxLength={passwordRange.max}
            autoComplete="current-password"
            type="password"
          />
        </FieldRoot>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <span>
          Don't have an account?{" "}
          <Link className="text-lime-300 underline" href="/sign-up">
            Sign up
          </Link>
        </span>
        <PendingButton pending={pending}>Login</PendingButton>
      </div>
    </form>
  );
};

export { LoginForm };
