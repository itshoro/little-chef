export function extractParts(slugWithPublicId: string) {
  const lastIndex = slugWithPublicId.lastIndexOf("-");

  return {
    slug: slugWithPublicId.substring(0, lastIndex),
    publicId: slugWithPublicId.substring(lastIndex + 1),
  };
}

export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^A-Za-z0-9\ ]/g, "")
    .split(" ")
    .join("-");
}

export function generateSlugPathSegment(slug: string, publicId: string) {
  return [slug, publicId].join("-");
}
