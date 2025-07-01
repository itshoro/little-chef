import Image from "next/image";

type AvatarProps = {
  src?: string;
  alt: string;
  className?: string;
  size?: `size-${number}`;
} & React.ComponentProps<"span">;

const Avatar = ({
  src,
  alt,
  className,
  size = "size-10",
  ...props
}: AvatarProps) => {
  if (!src) return null;
  const sizePx = Number(size.split("-")[1]) * 4;

  return (
    <span
      {...props}
      className={[
        "after:contents-[''] relative inline-block shrink-0 rounded-full after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-black/30 after:ring-inset dark:after:ring-white/30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={src}
        width={sizePx}
        height={sizePx}
        alt={alt}
        className={`rounded-full ${size}`}
      />
    </span>
  );
};

export { Avatar };
