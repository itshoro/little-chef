import { Header } from "@/app/components/header/header";
import { lucia, validateRequest } from "@/lib/auth/lucia";
import { getPrismaClient } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeSwitcher } from "./components/theme-switcher";
import { LanguageSelect } from "./components/language-select";
import { Fieldset } from "./components/primitives/fieldset";
import { VisibilitySwitcher } from "./components/visibility-switcher";
import * as SettingsSection from "./components/settings-section";
import * as TabNavigation from "./components/tab-navigation";

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

  return (
    <div className="rounded-2xl bg-stone-100 p-4">
      <div className="flex items-center gap-4">
        <img
          className="size-16 rounded-full border-2 border-white"
          src={user?.imgSrc ?? ""}
        />
        <div className="flex-1">
          <div className="text-xs">Current User</div>
          <div className="font-medium">{user?.username}</div>
        </div>

        <form action={signout}>
          <input type="hidden" name="sessionId" value={session?.id} />
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

const MenuItem = ({ children }: { children: React.ReactNode }) => {
  return <li className="border-b p-3">{children}</li>;
};

// function blobToBase64(blob: Blob): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result as string);
//     reader.onerror = () => reject();

//     reader.readAsDataURL(blob);
//   });
// }

async function signout(formData: FormData) {
  "use server";
  const sessionId = formData.get("sessionId");

  if (typeof sessionId !== "string") return;
  await lucia.invalidateSession(sessionId);
  redirect("/");
}

export default SettingsLayout;
