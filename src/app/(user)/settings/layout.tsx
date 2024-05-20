import { Header } from "@/app/components/header/header";
import { validateRequest } from "@/lib/auth/lucia";
import { redirect } from "next/navigation";
import * as TabNavigation from "./components/tab-navigation";
import { invalidateSession } from "@/lib/dal/user";
import { Avatar } from "@/app/components/header/avatar";

const SettingsLayout = async (props: { children: React.ReactNode }) => {
  return (
    <>
      <Header>
        <h1>Settings</h1>
      </Header>
      <div className="lg:flex">
        <aside className="mb-8 flex flex-col justify-end gap-4 p-4 lg:w-[23rem] lg:flex-col-reverse lg:border-r">
          <UserCard />

          <TabNavigation.Root>
            <TabNavigation.Link href="/settings/app">App</TabNavigation.Link>
            <TabNavigation.Link href="/settings/user">User</TabNavigation.Link>
            <TabNavigation.Link href="/settings/recipe">
              Recipe
            </TabNavigation.Link>
            <TabNavigation.Link href="/settings/collection">
              Collection
            </TabNavigation.Link>
          </TabNavigation.Root>
        </aside>

        <main className="flex-1 lg:p-4">{props.children}</main>
      </div>
    </>
  );
};

const UserCard = async () => {
  const { user, session } = await validateRequest();

  if (!user) return null;
  const signoutWithSessionId = signout.bind(null, session.id);

  return (
    <div className="rounded-2xl bg-stone-100 p-4">
      <div className="flex items-center gap-4">
        <Avatar src={`/${user.publicId}/avatar.webp`} alt="" size="size-16" />
        <div className="flex-1">
          <div className="text-xs">Current User</div>
          <div className="font-medium">{user.username}</div>
        </div>

        <form action={signoutWithSessionId}>
          <button
            className="rounded-full border bg-black px-5 py-2 font-medium text-white"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
};

async function signout(sessionId: string, _: FormData) {
  "use server";

  await invalidateSession(sessionId);
  redirect("/");
}

export default SettingsLayout;
