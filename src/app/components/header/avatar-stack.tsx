import type { Route } from "next";
import Link from "next/link";

const AvatarStack = ({
  users,
}: {
  users: { username: string; publicId: string }[];
}) => {
  const slice = users.slice(0, 5);

  return (
    <div className="isolate flex -space-x-3">
      {slice.map((user, i) => (
        <Link
          key={user.publicId}
          href={`/users/${user.publicId}` as Route}
          className="isolate z-[var(--stack-positon)] transition-transform hover:z-50 hover:scale-110 focus:z-50 focus:scale-110"
          style={{ "--stack-positon": slice.length - i } as React.CSSProperties}
        >
          <img
            className="inline-block size-10 rounded-full border-2 border-white"
            src={`/${user.publicId}/avatar.webp`}
            alt={`${user.username}`}
          />
        </Link>
      ))}
    </div>
  );
};

export { AvatarStack };
