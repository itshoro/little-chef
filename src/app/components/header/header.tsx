import { validateRequest } from "@/lib/auth/lucia";
import { Avatar } from "./avatar";
import NextLink from "next/link";
import { BaseButton } from "../base-button";

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
              <BaseButton href="/login">
                <span>Login</span>
              </BaseButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
