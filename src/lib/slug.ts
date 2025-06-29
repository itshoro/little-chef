export function parseHandle(handle: string) {
  const lastIndex = handle.lastIndexOf("-");

  return {
    slug: handle.substring(0, lastIndex),
    publicId: handle.substring(lastIndex + 1),
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

export function generateHandle(slug: string, publicId: string) {
  return [slug, publicId].join("-");
}
