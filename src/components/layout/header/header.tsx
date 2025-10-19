import { validateSession } from "@/lib/auth/validate-session";
import NextLink from "next/link";
import { LinkButton } from "../../ui/buttons/link-button";
import { Avatar } from "../../users/avatar";

const Header = async ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const { user } = await validateSession();

  return (
    <header className={`flex ${className}`}>
      {children}
      <div className="ml-auto inline-flex items-center">
        {user ? (
          <NextLink href="/settings" className="contents">
            <Avatar src={user.avatar ?? undefined} alt={user.username} />
          </NextLink>
        ) : (
          <LinkButton href="/login">
            <span>Login</span>
          </LinkButton>
        )}
      </div>
    </header>
  );
};

export { Header };
