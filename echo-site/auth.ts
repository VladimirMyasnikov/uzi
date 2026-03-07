import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        login: { label: "Логин", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      authorize: async (credentials) => {
        const raw = credentials ?? {};
        const login = (raw.login ?? "") as string;
        const password = (raw.password ?? "") as string;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword || typeof password !== "string" || password === "") {
          return null;
        }
        if (password.trim() !== adminPassword.trim()) {
          return null;
        }
        return { id: "admin", name: (login && login.trim()) || "admin", email: null };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
});
