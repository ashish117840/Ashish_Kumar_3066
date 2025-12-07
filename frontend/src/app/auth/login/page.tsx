import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Welcome back</h1>
        <p className="text-sm text-zinc-600">Sign in to manage products, track orders, and view analytics.</p>
      </header>
      <LoginForm />
      <p className="text-center text-xs text-zinc-500">
        No account yet? <Link href="/auth/register" className="font-medium text-zinc-700 hover:text-zinc-900">Create one</Link>.
      </p>
    </div>
  );
}
