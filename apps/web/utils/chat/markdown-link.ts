/** Link nội bộ app (điều hướng SPA) vs link ngoài (mở tab mới). */
export function isInternalAppHref(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  return value.startsWith("/") || value.startsWith("#");
}
