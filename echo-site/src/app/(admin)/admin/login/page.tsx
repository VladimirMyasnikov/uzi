"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--muted)]/20">
      <div
        className="w-full max-w-sm rounded-2xl border bg-[color:var(--card)] p-6 shadow-sm"
        style={{ borderColor: "var(--border)" }}
      >
        <h1 className="text-xl font-semibold text-[color:var(--fg)]">
          Вход в админку
        </h1>
        <form className="mt-4 space-y-3" action={formAction}>
          <div>
            <label
              htmlFor="login"
              className="block text-sm font-medium text-[color:var(--fg)]"
            >
              Логин
            </label>
            <input
              id="login"
              name="login"
              type="text"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[color:var(--fg)]"
            >
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-[color:var(--fg)] py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
