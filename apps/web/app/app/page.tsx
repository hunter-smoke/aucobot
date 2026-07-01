import { redirect } from "next/navigation";

import { ClientAppShell } from "./_components/ClientAppShell/ClientAppShell";
import { marketingUrl } from "@/lib/host/urls";
import { getServerUser } from "@/lib/http/server-auth";

export default async function AppHomePage() {
  const user = await getServerUser();

  if (!user) {
    redirect(marketingUrl("/login"));
  }

  return <ClientAppShell userName={user.name ?? user.email} />;
}
