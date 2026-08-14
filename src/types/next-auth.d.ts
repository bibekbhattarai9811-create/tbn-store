import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CUSTOMER" | "HELPER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role: "CUSTOMER" | "HELPER" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CUSTOMER" | "HELPER" | "ADMIN";
  }
}
