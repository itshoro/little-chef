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
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
}

export function generateSlugPathSegment(slug: string, publicId: string) {
  return [slug, publicId].join("-");
}
