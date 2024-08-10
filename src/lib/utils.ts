export function generateAttribution(maintainers: { username: string }[]) {
  return new Intl.ListFormat(undefined, {
    type: "conjunction",
  }).format(maintainers.map((u) => u.username));
}
