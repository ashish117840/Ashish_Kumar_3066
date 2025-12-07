"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setStatus("submitting");
      setError(null);
      const apiBase = getApiBaseUrl();
      const response = await fetch(`${apiBase.replace(/\/$/, "")}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Registration failed. Please adjust your input.");
      }

      router.replace("/products");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-xs font-semibold uppercase text-zinc-500">
          Full name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="register-email" className="text-xs font-semibold uppercase text-zinc-500">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="register-password" className="text-xs font-semibold uppercase text-zinc-500">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          required
          value={password}
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        <p className="text-xs text-zinc-500">Minimum 8 characters with a mix of letters and numbers.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
