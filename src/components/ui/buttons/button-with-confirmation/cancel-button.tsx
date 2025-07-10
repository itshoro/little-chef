"use client";

import { Button, type ButtonProps } from "../button";
import { useDialogContext } from "../../../recipes/dialog/root";

const CancelButton = ({ children, type = "button", ...props }: ButtonProps) => {
  const { closeDialog } = useDialogContext(CancelButton.name);

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

export { CancelButton };
