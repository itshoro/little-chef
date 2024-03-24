"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "type" | "aria-disabled"
>;

const SubmitButton = (props: SubmitButtonProps) => {
  const { pending, data } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={props.disabled || pending}
      {...props}
    />
  );
};

export { SubmitButton };
