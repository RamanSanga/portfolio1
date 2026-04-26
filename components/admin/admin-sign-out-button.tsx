"use client";

import { signOut } from "next-auth/react";

export function AdminSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
    >
      Sign Out
    </button>
  );
}
