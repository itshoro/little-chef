import { validateSession } from "@/lib/utils/auth/validate-session";
import NextLink from "next/link";
import { connection } from "next/server";
import { LinkButton } from "../../ui/buttons/link-button";
import { Avatar } from "../../users/avatar";

const Header = async ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  await connection();
  const { user } = await validateSession();

  return (
    <header className={`flex ${className}`}>
      {children}
      <div className="ml-auto inline-flex items-center">
        {user ? (
          <NextLink href="/settings" className="contents">
            <Avatar src={user.avatar?.url ?? undefined} alt={user.username} />
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
