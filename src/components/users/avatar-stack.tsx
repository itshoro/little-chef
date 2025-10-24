import type { User } from "@/lib/domain/user/user";
import { Avatar } from "./avatar";

const AvatarStack = ({
  users,
  size = "size-8",
}: {
  users: User[];
  size?: `size-${number}`;
}) => {
  const slice = users.slice(0, 5);

  return (
    <div className="isolate flex shrink-0 -space-x-3">
      {slice.map((user, i) => (
        <Avatar
          size={size}
          key={user.publicId}
          alt={user.username}
          src={user.avatar?.url}
          className="z-[var(--stack-position)] transition-transform hover:z-50 hover:scale-110 focus:z-50 focus:scale-110"
          style={
            { "--stack-position": slice.length - i } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export { AvatarStack };
