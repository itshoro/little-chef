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
  return (
    <span
      {...props}
      className={[
        "after:contents-[''] relative inline-block shrink-0 rounded-full after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-white/30 after:ring-inset",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img src={src} alt={alt} className={`rounded-full ${size}`} />
    </span>
  );
};

export { Avatar };
