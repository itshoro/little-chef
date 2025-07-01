"use client";

import { BaseButton } from "../button";
import { useDialogContext } from "../../../recipes/dialog/root";

type TriggerButtonProps = {
  children: React.ReactNode;
} & React.ComponentProps<"button">;

const TriggerButton = ({ children, ...props }: TriggerButtonProps) => {
  const { openDialog } = useDialogContext(TriggerButton.name);

  return (
    <BaseButton {...props} onClick={openDialog}>
      {children}
    </BaseButton>
  );
};

export { TriggerButton };
