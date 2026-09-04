import { Button } from "@/components/ui/buttons/button";
import { FieldRoot } from "@/components/ui/controls/field-root";
import { Option, Select } from "@/components/ui/controls/select";
import { Avatar } from "@/components/users/avatar";
import type { Collaborator } from "@/lib/domain/shared/collaborator";
import { roles } from "@/lib/domain/shared/role";

const CollaboratorRow = ({
  collaborator,
  modifiable,
}: {
  collaborator: Collaborator;
  modifiable: boolean;
}) => {
  return (
    <>
      <td className="my-px py-2 pl-4">
        <div className="flex items-center gap-2">
          <Avatar src={collaborator.user.avatar?.url} alt="" />
          <div>{collaborator.user.username}</div>
          <div></div>
        </div>
      </td>
      <td className="my-px py-2">
        <FieldRoot name="role">
          <Select defaultValue={collaborator.role} disabled={!modifiable}>
            {roles.map((role) => (
              <Option key={role} value={role}>
                {role.substring(0, 1).toLocaleUpperCase() + role.substring(1)}
              </Option>
            ))}
          </Select>
        </FieldRoot>
      </td>
      <td className="my-px py-2 pr-4 text-right">
        <Button variant="outline" disabled={!modifiable}>
          Remove
        </Button>{" "}
      </td>
    </>
  );
};

export { CollaboratorRow };
