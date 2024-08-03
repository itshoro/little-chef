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
} from "@/lib/dal/user";

const UserPage = async () => {
  const { user } = await validateRequest();

  const setProfileImageWithUser = setProfileImage.bind(null, user?.publicId);
  const updatePasswordWithUser = updatePassword.bind(null, user?.publicId);
  const updateUsernameActionWithUser = updateUsernameAction.bind(
    null,
    user?.publicId,
  );

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>User Preferences</SettingsSection.Label>

        <SettingsSection.Grid>
          <UpdateAvatar
            action={setProfileImageWithUser}
            defaultValue={user ? `/${user.publicId}/avatar.webp` : ""}
          />

          <form action={updatePasswordWithUser}>
            <Fieldset label="Password">
              <div className="mb-4 flex flex-col gap-4">
                <div>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    className="mt-2 w-full rounded-lg"
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    className="mt-2 w-full rounded-lg"
                    type="password"
                    name="newPassword"
                    id="newPassword"
                  />
                </div>
              </div>
              <button
                className="rounded-full bg-lime-300 px-5 py-3 font-medium"
                type="submit"
              >
                Update Password
              </button>
            </Fieldset>
          </form>

          <form action={updateUsernameActionWithUser}>
            <Fieldset label="Username">
              <div>
                <label className="sr-only" htmlFor="username">
                  Username
                </label>
                <input
                  className="mt-2 w-full rounded-lg"
                  type="text"
                  name="username"
                  defaultValue={user?.username}
                  id="username"
                />
              </div>
              <button
                className="mt-4 rounded-full bg-lime-300 px-5 py-3 font-medium"
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
  publicUserId: string | undefined,
  formData: FormData,
) {
  "use server";
  if (typeof publicUserId !== "string") return;

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  if (typeof currentPassword !== "string" || !validatePassword(newPassword))
    return;

  await changePassword(publicUserId, currentPassword, newPassword);
}

const setProfileImage = async (
  publicUserId: string | undefined,
  formData: FormData,
) => {
  "use server";
  if (typeof publicUserId !== "string") return;

  const image = formData.get("image");
  if (!(image instanceof File)) return;

  await changeAvatar(publicUserId, image);
  revalidatePath("/settings/user", "page");
};

const updateUsernameAction = async (
  publicUserId: string | undefined,
  formData: FormData,
) => {
  "use server";
  if (typeof publicUserId !== "string") return;

  const username = formData.get("username");
  try {
    if (!validateUsername(username)) return;
  } catch {
    return;
  }

  await changeUsername(publicUserId, username);
  revalidatePath("/settings/user", "page");
};

export default UserPage;
