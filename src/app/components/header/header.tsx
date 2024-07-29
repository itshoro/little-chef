import { validateRequest } from "@/lib/auth/lucia";
import { Avatar } from "./avatar";
import { CTALink } from "../CallToAction/Link";
import NextLink from "next/link";

const Header = async ({ children }: { children?: React.ReactNode }) => {
  const { user } = await validateRequest();

  return (
    <header className="border-b" style={{ gridArea: "header", gridColumn: 1 }}>
      <div className="px-6 py-3">
        <div className="flex justify-between">
          {children}
          <div className="ml-auto">
            {user ? (
              <NextLink href="/settings/app">
                <Avatar
                  src={`/${user.publicId}/avatar.webp`}
                  alt={user.username}
                />
              </NextLink>
            ) : (
              <CTALink href="/login">
                <span className="pl-2">Login</span>
              </CTALink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
