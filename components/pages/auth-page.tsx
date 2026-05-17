"use client";

import { ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, register } from "@/lib/auth";

type AuthPageProps = {
  mode: "login" | "register";
};

export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "", email: "", firstName: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      setError("Login va parolni kiriting.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (isRegister) {
        await register({
          username: form.username.trim(),
          password: form.password,
          email: form.email.trim() || undefined,
          first_name: form.firstName.trim() || undefined,
        });
        router.replace("/setup");
      } else {
        await login(form.username.trim(), form.password);
        router.replace("/dashboard");
      }
    } catch {
      setError(isRegister ? "Ro'yxatdan o'tishda xato. Ma'lumotlarni tekshiring." : "Login yoki parol noto'g'ri.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5f2] px-4 py-10 text-[#17201b]">
      <section className="w-full max-w-md rounded-lg border border-[#dfe4dc] bg-white p-5 shadow-sm">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#17201b] text-white">
            <BarChart3 className="h-5 w-5" />
          </span>
          <span className="font-semibold">Business Dashboard</span>
        </Link>

        <h1 className="text-2xl font-semibold">{isRegister ? "Akkaunt ochish" : "Kirish"}</h1>
        <p className="mt-2 text-sm leading-6 text-[#69756c]">
          {isRegister ? "Biznes ma'lumotlari alohida akkauntga bog'lanadi." : "Dashboard va hisob-kitoblaringizni davom ettiring."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister ? (
            <>
              <AuthField label="Ism" value={form.firstName} onChange={(value) => setForm((current) => ({ ...current, firstName: value }))} />
              <AuthField label="Email" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
            </>
          ) : null}
          <AuthField label="Login" value={form.username} onChange={(value) => setForm((current) => ({ ...current, username: value }))} />
          <AuthField label="Parol" type="password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} />

          {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#17201b] px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Kuting..." : isRegister ? "Akkaunt ochish" : "Kirish"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#69756c]">
          {isRegister ? "Akkauntingiz bormi?" : "Akkauntingiz yo'qmi?"}{" "}
          <Link className="font-medium text-[#17201b]" href={isRegister ? "/login" : "/register"}>
            {isRegister ? "Kirish" : "Ro'yxatdan o'tish"}
          </Link>
        </p>
      </section>
    </main>
  );
}

function AuthField({ label, value, onChange, type = "text" }: { label: string; value: string; type?: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-lg border border-[#d8ded5] px-3 text-sm outline-none transition focus:border-[#17201b] focus:ring-2 focus:ring-[#dfe7dd]"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
