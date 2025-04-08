import * as Form from "@/app/components/form";
import { SubmitWithPending } from "@/app/components/form/submit-with-pending";
import * as Input from "@/app/components/input";
import { validateRequest } from "@/lib/auth";
import { changeAvatar, findUserBySessionId } from "@/lib/dal/user";
import { isRateLimitedGlobally } from "@/lib/rate-limit/helper";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Fieldset } from "../components/primitives/fieldset";
import * as SettingsSection from "../components/settings-section";
import { changePasswordAction } from "./actions/change-password";
import { updateUsernameAction } from "./actions/update-username";
import { UpdateAvatar } from "./update-image";

export const metadata: Metadata = {
  title: "User Preferences",
};

const UserPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user, session } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const setProfileImageWithSession = changeAvatarAction.bind(null, session.id);
  const updatePasswordWithSession = changePasswordAction.bind(null, session.id);
  const updateUsernameWithSession = updateUsernameAction.bind(null, session.id);

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>User Preferences</SettingsSection.Label>

        <SettingsSection.Grid>
          <UpdateAvatar
            action={setProfileImageWithSession}
            defaultValue={user?.avatar ?? undefined}
          />

          <Form.Root action={updatePasswordWithSession}>
            <Fieldset label="Password">
              <div className="mb-4">
                <Input.Root name="current-password">
                  <Input.Label className="pb-2">Current password</Input.Label>
                  <Input.Group>
                    <Input.Element type="password" />
                  </Input.Group>
                  <Input.InlineError />
                </Input.Root>
              </div>
              <div className="mb-4">
                <Input.Root name="new-password">
                  <Input.Label className="pb-2">New password</Input.Label>
                  <Input.Group>
                    <Input.Element type="password" />
                  </Input.Group>
                  <Input.InlineError />
                </Input.Root>
              </div>
              <div className="mb-4">
                <Input.Root name="confirmation-password">
                  <Input.Label className="pb-2">
                    Confirm new password
                  </Input.Label>
                  <Input.Group>
                    <Input.Element type="password" />
                  </Input.Group>
                  <Input.InlineError />
                </Input.Root>
              </div>
              <Form.Alert />
              <SubmitWithPending className="mt-2">
                Change Password
              </SubmitWithPending>
            </Fieldset>
          </Form.Root>

          <Form.Root action={updateUsernameWithSession}>
            <Fieldset label="Username">
              <div className="mb-4">
                <Input.Root name="username">
                  <Input.Label className="pb-2">New Username</Input.Label>
                  <Input.Group>
                    <Input.Element type="text" />
                  </Input.Group>
                  <Input.InlineError />
                </Input.Root>
              </div>

              <Form.Alert />

              <SubmitWithPending className="mt-2">
                Change Username
              </SubmitWithPending>
            </Fieldset>
          </Form.Root>
        </SettingsSection.Grid>
      </SettingsSection.Root>
    </>
  );
};

const changeAvatarAction = async (
  sessionId: string | undefined,
  formData: FormData,
) => {
  "use server";

  const user = await findUserBySessionId(sessionId);

  const image = formData.get("image");
  if (!(image instanceof File)) return;

  await changeAvatar(user, image);
};

export default UserPage;
