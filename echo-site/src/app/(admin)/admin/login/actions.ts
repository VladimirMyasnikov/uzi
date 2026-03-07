"use server";

import { signIn } from "auth";

export type LoginState = { error?: string } | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    const login = (formData.get("login") as string) ?? "";
    const password = (formData.get("password") as string) ?? "";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword?.trim()) {
      return { error: "Сервер: ADMIN_PASSWORD не задан в .env.local" };
    }
    if (password.trim() !== adminPassword.trim()) {
      return { error: "Неверный логин или пароль" };
    }

    await signIn("credentials", {
      login: login.trim() || "admin",
      password: password.trim(),
      redirectTo: "/admin",
    });
  } catch (e) {
    const err = e as { type?: string; digest?: string };
    if (err?.type === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) throw e;
    const message = e instanceof Error ? e.message : "Ошибка входа";
    return { error: message };
  }

  return null;
}
