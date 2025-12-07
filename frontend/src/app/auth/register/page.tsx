import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Create your account</h1>
        <p className="text-sm text-zinc-600">Register as a customer or admin to unlock the full commerce toolkit.</p>
      </header>
      <RegisterForm />
      <p className="text-center text-xs text-zinc-500">
        Already have an account? <Link href="/auth/login" className="font-medium text-zinc-700 hover:text-zinc-900">Log in</Link>.
      </p>
    </div>
  );
}
