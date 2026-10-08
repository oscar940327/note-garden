export function resolveGraphSlug(
  pageSlug: string | undefined,
  fullSlug: string,
  basePath: string,
): string {
  if (pageSlug) return pageSlug;

  let slug = fullSlug;
  const base = basePath.replace(/^\//, "");
  if (base && slug.startsWith(base)) {
    slug = slug.slice(base.length);
    if (slug.startsWith("/")) slug = slug.slice(1);
  }

  return slug;
}
