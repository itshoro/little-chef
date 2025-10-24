"use client";

import { useDialogContext } from "../../../recipes/dialog/root";
import { Button, type ButtonProps } from "../button";

const TriggerButton = ({ children, ...props }: ButtonProps) => {
  const { openDialog } = useDialogContext(TriggerButton.name);

  return (
    <Button {...props} onClick={openDialog}>
      {children}
    </Button>
  );
};

export { TriggerButton };
