"use client";

import { BaseButton } from "../button";
import { useDialogContext } from "../../../recipes/dialog/root";

type CancelButtonProps = {
  children: React.ReactNode;
} & React.ComponentProps<"button">;

const CancelButton = ({
  children,
  type = "button",
  ...props
}: CancelButtonProps) => {
  const { closeDialog } = useDialogContext(CancelButton.name);

  return (
    <BaseButton
      {...props}
      type={type}
      onClick={(e: React.MouseEvent<React.ComponentRef<"button">>) => {
        if (props.onClick) props.onClick(e);
        closeDialog();
      }}
    >
      {children}
    </BaseButton>
  );
};

export { CancelButton };
