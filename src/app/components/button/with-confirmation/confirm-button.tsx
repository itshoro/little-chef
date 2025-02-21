"use client";

import { BaseButton } from "../../base-button";
import { useDialogContext } from "../../dialog/root";

type ConfirmButtonProps = {
  children: React.ReactNode;
} & React.ComponentProps<"button">;

const ConfirmButton = ({
  children,
  type = "submit",
  ...props
}: ConfirmButtonProps) => {
  const { closeDialog } = useDialogContext(ConfirmButton.name);

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

export { ConfirmButton };
