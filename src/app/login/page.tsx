import type { Metadata } from "next";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { LoginClient } from "./LoginClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: getDictionary(locale).auth.signInTitle };
}

export default async function LoginPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale).auth;
  return <LoginClient dict={dict} />;
}
