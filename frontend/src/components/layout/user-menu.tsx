"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getApiBaseUrl } from "@/lib/api";

type CurrentUser = {
  id: string;
  name: string;
  role: string;
};

type FetchState = "idle" | "loading" | "success" | "error";

export function UserMenu() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<FetchState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let apiBase: string;

    try {
      apiBase = getApiBaseUrl();
    } catch (envError) {
      setError((envError as Error).message);
      setStatus("error");
      return;
    }

    const controller = new AbortController();

    const loadUser = async () => {
      try {
        setStatus("loading");
        const response = await fetch(`${apiBase.replace(/\/$/, "")}/auth/me`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          setStatus("error");
          return;
        }

        const payload = (await response.json()) as CurrentUser;
        setUser(payload);
        setStatus("success");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setStatus("error");
        setError((err as Error).message);
      }
    };

    loadUser();

    return () => controller.abort();
  }, []);

  const handleLogout = useCallback(async () => {
    let apiBase: string;

    try {
      apiBase = getApiBaseUrl();
    } catch (envError) {
      console.error(envError);
      return;
    }

    try {
      await fetch(`${apiBase.replace(/\/$/, "")}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Failed to log out", err);
    }
  }, []);

  if (status === "loading") {
    return <span className="text-sm text-zinc-500">Checking session…</span>;
  }

  if (status === "error" && error) {
    return <span className="text-xs text-red-500">{error}</span>;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link href="/auth/login" className="text-zinc-600 hover:text-zinc-900">
          Log in
        </Link>
        <Link
          href="/auth/register"
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm text-zinc-700">
      <span className="hidden sm:inline">Hi, {user.name}</span>
      <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs uppercase tracking-wide text-zinc-500">
        {user.role}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
      >
        Log out
      </button>
    </div>
  );
}
