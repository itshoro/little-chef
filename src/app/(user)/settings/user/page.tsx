import { validateRequest } from "@/lib/auth/lucia";
import { Fieldset } from "../components/primitives/fieldset";
import * as SettingsSection from "../components/settings-section";
import { UpdateAvatar } from "./update-image";
import { revalidatePath } from "next/cache";
import {
  changePassword,
  changeAvatar,
  changeUsername,
} from "@/lib/dal/settings/user";

const UserPage = async () => {
  const { user, session } = await validateRequest();

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>User Preferences</SettingsSection.Label>

        <SettingsSection.Grid>
          <form action={setProfileImage}>
            <Fieldset label="Avatar">
              <UpdateAvatar defaultValue={user?.imgSrc ?? ""} />
              <input type="hidden" name="sessionId" value={session?.id} />
              <button
                className="rounded-full bg-lime-300 px-5 py-3 font-medium"
                type="submit"
              >
                Save
              </button>
            </Fieldset>
          </form>

          <form action={updatePassword}>
            <Fieldset label="Password">
              <input type="hidden" name="sessionId" value={session?.id} />

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
                className="rounded-full bg-lime-300 px-5 py-3 font-medium "
                type="submit"
              >
                Update Password
              </button>
            </Fieldset>
          </form>

          <form action={updateUsernameAction}>
            <Fieldset label="Username">
              <div>
                <input type="hidden" name="sessionId" value={session?.id} />
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

async function updatePassword(formData: FormData) {
  "use server";

  const sessionId = formData.get("sessionId");
  if (typeof sessionId !== "string") return;

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  if (typeof currentPassword !== "string" || typeof newPassword !== "string")
    return;

  await changePassword(sessionId, currentPassword, newPassword);
}

const setProfileImage = async (formData: FormData) => {
  "use server";
  const image = formData.get("image");
  const sessionId = formData.get("sessionId");

  if (typeof sessionId !== "string") return;
  if (!(image instanceof File)) return;

  await changeAvatar(sessionId, image);

  revalidatePath("/settings/user", "page");
};

const updateUsernameAction = async (formData: FormData) => {
  "use server";

  const sessionId = formData.get("sessionId");
  const username = formData.get("username");
  if (typeof sessionId !== "string" || typeof username !== "string") return;

  await changeUsername(sessionId, username);

  revalidatePath("/settings/user", "page");
};

export default UserPage;
