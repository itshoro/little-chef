"use client";

import { useDialogContext } from "../../../recipes/dialog/root";
import { Button, type ButtonProps } from "../button";

const ConfirmButton = ({
  children,
  type = "submit",
  ...props
}: ButtonProps) => {
  const { closeDialog } = useDialogContext(ConfirmButton.name);

  return (
    <Button
      {...props}
      type={type}
      onClick={(e: React.MouseEvent<React.ComponentRef<"button">>) => {
        if (props.onClick) props.onClick(e);
        closeDialog();
      }}
    >
      {children}
    </Button>
  );
};

export { ConfirmButton };
