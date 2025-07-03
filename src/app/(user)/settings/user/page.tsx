import * as Form from "@/components/forms/form";
import { SubmitWithPending } from "@/components/forms/form/submit-with-pending";
import * as Input from "@/components/forms/input";
import { Fieldset } from "@/components/ui/fieldset";
import { getAuthenticatedUserOrRedirect } from "@/lib/services/auth";
import { isRateLimitedGlobally } from "@/lib/services/rate-limit/global";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import * as SettingsSection from "../../../../components/layout/settings-section";
import { changeAvatarAction } from "./actions/update-avatar";
import { changePasswordAction } from "./actions/update-password";
import { updateUsernameAction } from "./actions/update-username";
import { UpdateAvatar } from "./update-image";

export const metadata: Metadata = {
  title: "User Preferences",
};

const UserPage = async () => {
  if (await isRateLimitedGlobally("read")) return "Too many requests";
  const { user } = await getAuthenticatedUserOrRedirect();

  return (
    <>
      <SettingsSection.Root>
        <SettingsSection.Label>User Preferences</SettingsSection.Label>

        <SettingsSection.Grid>
          <UpdateAvatar
            action={changeAvatarAction}
            defaultValue={user?.avatar ?? undefined}
          />

          <Form.Root action={changePasswordAction}>
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

          <Form.Root action={updateUsernameAction}>
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

export default UserPage;
