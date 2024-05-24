export function extractParts(slugWithPublicId: string) {
  const lastIndex = slugWithPublicId.lastIndexOf("-");

  return {
    slug: slugWithPublicId.substring(0, lastIndex),
    publicId: slugWithPublicId.substring(lastIndex + 1),
  };
}
