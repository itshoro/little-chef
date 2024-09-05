import { validateRequest } from "@/lib/auth/lucia";
import { Fieldset } from "../components/primitives/fieldset";
import * as SettingsSection from "../components/settings-section";
import { UpdateAvatar } from "./update-image";
import { revalidatePath } from "next/cache";
import {
  changePassword,
  changeAvatar,
  changeUsername,
  validateUsername,
  validatePassword,
  authorizeFromSession,
} from "@/lib/dal/user";
import * as Input from "@/app/components/input";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "User Preferences",
};

const UserPage = async () => {
  const { user, session } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const setProfileImageWithSession = setProfileImage.bind(null, session.id);
  const updatePasswordWithSession = updatePassword.bind(null, session.id);
  const updateUsernameActionWithSession = updateUsernameAction.bind(
    null,
    session.id,
  );

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>User Preferences</SettingsSection.Label>

        <SettingsSection.Grid>
          <UpdateAvatar
            action={setProfileImageWithSession}
            defaultValue={user?.avatar ?? undefined}
          />

          <form action={updatePasswordWithSession}>
            <Fieldset label="Password">
              <div className="mb-4 flex flex-col gap-4">
                <div>
                  <Input.Root name="currentPassword">
                    <Input.Label>Current password</Input.Label>
                    <Input.Group>
                      <Input.Element type="password" />
                    </Input.Group>
                  </Input.Root>
                </div>
                <div>
                  <Input.Root name="newPassword">
                    <Input.Label>New password</Input.Label>
                    <Input.Group>
                      <Input.Element type="password" />
                    </Input.Group>
                  </Input.Root>
                </div>
                <div>
                  <Input.Root name="confirmPassword">
                    <Input.Label>Confirm new password</Input.Label>
                    <Input.Group>
                      <Input.Element type="password" />
                    </Input.Group>
                  </Input.Root>
                </div>
              </div>
              <button
                className="rounded-full bg-lime-300 px-5 py-3 font-medium dark:text-black"
                type="submit"
              >
                Update Password
              </button>
            </Fieldset>
          </form>

          <form action={updateUsernameActionWithSession}>
            <Fieldset label="Username">
              <div>
                <Input.Root name="username">
                  <Input.Label>New Username</Input.Label>
                  <Input.Group>
                    <Input.Element type="text" defaultValue={user.username} />
                  </Input.Group>
                </Input.Root>
              </div>
              <button
                className="mt-4 rounded-full bg-lime-300 px-5 py-3 font-medium dark:text-black"
                type="submit"
              >
                Update Username
              </button>
            </Fieldset>
          </form>
        </SettingsSection.Grid>
      </SettingsSection.Root>
    </>
  );
};

async function updatePassword(
  sessionId: string | undefined,
  formData: FormData,
) {
  "use server";
  const user = await authorizeFromSession(sessionId);

  const currentPassword = formData.get("currentPassword");
  const confirmPassword = formData.get("confirmPassword");
  const newPassword = formData.get("newPassword");
  if (typeof currentPassword !== "string" || !validatePassword(newPassword))
    return;

  if (confirmPassword !== newPassword) return;

  await changePassword(user, currentPassword, newPassword);
}

const setProfileImage = async (
  sessionId: string | undefined,
  formData: FormData,
) => {
  "use server";
  const user = await authorizeFromSession(sessionId);

  const image = formData.get("image");
  if (!(image instanceof File)) return;

  await changeAvatar(user, image);
  revalidatePath("/settings/user", "page");
};

const updateUsernameAction = async (
  sessionId: string | undefined,
  formData: FormData,
) => {
  "use server";
  const user = await authorizeFromSession(sessionId);

  const username = formData.get("username");
  if (!validateUsername(username)) return;

  await changeUsername(user, username);
  revalidatePath("/settings/user", "page");
};

export default UserPage;
