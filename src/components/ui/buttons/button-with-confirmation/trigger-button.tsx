"use client";

import { Button, type ButtonProps } from "../button";
import { useDialogContext } from "../../../recipes/dialog/root";

const TriggerButton = ({ children, ...props }: ButtonProps) => {
  const { openDialog } = useDialogContext(TriggerButton.name);

  return (
    <Button {...props} onClick={openDialog}>
      {children}
    </Button>
  );
};

export { TriggerButton };
