import Link from "next/link";
import { Avatar } from "./avatar";

const AvatarStack = ({
  users,
}: {
  users: { username: string; publicId: string; avatar: string | null }[];
}) => {
  const slice = users.slice(0, 5);

  return (
    <div className="isolate flex shrink-0 -space-x-3">
      {slice.map((user, i) => (
        <Avatar
          size="size-8"
          key={user.publicId}
          alt={user.username}
          src={user.avatar!}
          className="z-[var(--stack-positon)] transition-transform hover:z-50 hover:scale-110 focus:z-50 focus:scale-110"
          style={{ "--stack-positon": slice.length - i } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export { AvatarStack };
