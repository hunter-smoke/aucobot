/** App subdomain — chat + auth (`app.aucobot.com`). */
export function getAppOrigin(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://app.localhost:8386";
}

/** Marketing root domain (`aucobot.com`). */
export function getMarketingOrigin(): string {
  return process.env.NEXT_PUBLIC_MARKETING_URL ?? "http://localhost:8386";
}

export function appUrl(path = "/"): string {
  const origin = getAppOrigin().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}

export function marketingUrl(path = "/"): string {
  const origin = getMarketingOrigin().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}
