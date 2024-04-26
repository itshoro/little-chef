type AvatarProps = {
  src: string;
  alt: string;
  size?: `size-${number}`;
};

const Avatar = ({ src, alt, size = "size-10" }: AvatarProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`aspect-square rounded-full ${size} border-2 border-stone-200`}
    />
  );
};

export { Avatar };
