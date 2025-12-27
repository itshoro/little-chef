import { Header } from "@/components/layout/header/header";
import { BackLink } from "@/components/ui/back-link";
import { Avatar } from "@/components/users/avatar";
import { db } from "@/drizzle/db";
import { makeSignOutUser } from "@/lib/application/use-case/user/sign-out";
import { UnauthenticatedError } from "@/lib/domain/auth/unauthenticated-error";
import { StatefulSessionProvider } from "@/lib/infrastructure/auth/session/stateful/session-provider";
import { StatefulSessionTokenProvider } from "@/lib/infrastructure/auth/session/stateful/session-token-provider";
import { DrizzleSessionRepository } from "@/lib/infrastructure/repositories/drizzle/auth/session-repository";
import { requireSession } from "@/lib/utils/auth/require-session";
import { validateSession } from "@/lib/utils/auth/validate-session";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";
import { SettingsSidebarWrapper } from "./_components/settings-sidebar-wrapper";
import { connection } from "next/server";

const SettingsLayout = async (props: { children: React.ReactNode }) => {
  return (
    <div className="h-svh">
      <div className="flex min-h-full flex-col">
        <div className="mx-auto w-full max-w-(--breakpoint-xl) p-4">
          <Header>
            <BackLink />
          </Header>
        </div>
        <section className="border-t border-stone-800">
          <div className="mb-4 border-b border-stone-800">
            <div className="mx-auto max-w-(--breakpoint-xl) p-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <UserCard />
                </div>

                <form action={signoutAction}>
                  <button
                    className="rounded-full border bg-stone-200 px-5 py-2 font-medium text-black dark:border-stone-800"
                    type="submit"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>

          <SettingsSidebarWrapper />

          <div className="mx-auto flex max-w-(--breakpoint-xl) gap-6 p-4">
            <div className="hidden w-xs shrink-0 lg:block">
              <div className="sticky top-4 flex flex-col content-between gap-6">
                <Navigation />
              </div>
            </div>
            <main className="flex w-full flex-col gap-8">{props.children}</main>
          </div>
        </section>
      </div>
    </div>
  );
};

async function signoutAction() {
  "use server";
  const { session } = await requireSession({
    onUnauthenticated: () => {
      throw new UnauthenticatedError();
    },
  });

  const signOut = makeSignOutUser(
    new StatefulSessionProvider(
      new StatefulSessionTokenProvider(),
      new DrizzleSessionRepository(db),
    ),
  );
  await signOut(session);

  redirect("/");
}

const UserCard = async () => {
  await connection();
  const { user } = await validateSession();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <Avatar src={user.avatar?.url} alt="" size="size-12" />
      <div className="flex-1">
        <div className="font-semibold">{user.username}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
