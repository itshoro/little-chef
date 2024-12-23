import { BaseButton } from "@/app/components/base-button";
import * as Input from "@/app/components/input";
import { validateRequest } from "@/lib/auth/lucia";
import {
  authorizeFromSession,
  changeAvatar,
  changePassword,
  changeUsername,
} from "@/lib/dal/user";
import { passwordSchema, usernameSchema } from "@/lib/dal/user/types";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Fieldset } from "../components/primitives/fieldset";
import * as SettingsSection from "../components/settings-section";
import { UpdateAvatar } from "./update-image";

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
              <BaseButton className="mt-6" type="submit">
                Update Password
              </BaseButton>
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
              <BaseButton className="mt-6" type="submit">
                Update Username
              </BaseButton>
            </Fieldset>
          </form>
        </SettingsSection.Grid>
      </SettingsSection.Root>
    </>
  );
};

const updatePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

async function updatePassword(
  sessionId: string | undefined,
  formData: FormData,
) {
  "use server";
  const user = await authorizeFromSession(sessionId);

  const dto = updatePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    confirmPassword: formData.get("confirmPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!dto.success) return; // TODO

  await changePassword(user, dto.data.currentPassword, dto.data.newPassword);
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

  const dto = usernameSchema.safeParse(formData.get("username"));
  if (!dto.success) return; // TODO

  await changeUsername(user, dto.data);
  revalidatePath("/settings/user", "page");
};

export default UserPage;
