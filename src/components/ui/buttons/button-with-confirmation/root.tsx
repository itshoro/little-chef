"use client";

import { Root as DialogRoot, useDialog } from "../../../recipes/dialog/root";

type WithConfirmationProps = {
  children: React.ReactNode;
};

const Root = ({ children }: WithConfirmationProps) => {
  const dialogProps = useDialog();

  return <DialogRoot {...dialogProps}>{children}</DialogRoot>;
};

export { Root };
