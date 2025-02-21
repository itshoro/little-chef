import { validateRequest } from "@/lib/auth";
import { Avatar } from "./avatar";
import NextLink from "next/link";
import { BaseButton } from "../base-button";

const Header = async ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const { user } = await validateRequest();

  return (
    <header className={`flex ${className}`}>
      {children}
      <div className="ml-auto inline-flex items-center">
        {user ? (
          <NextLink href="/settings/user" className="contents">
            <Avatar src={user.avatar ?? undefined} alt={user.username} />
          </NextLink>
        ) : (
          <BaseButton href="/login">
            <span>Login</span>
          </BaseButton>
        )}
      </div>
    </header>
  );
};

export { Header };
