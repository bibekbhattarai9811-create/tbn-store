import type { Metadata } from "next";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { LoginClient } from "./LoginClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).auth.signInTitle };
}

export default async function LoginPage() {
  const locale = await getLocale();
  const dict = (await getDictionary(locale)).auth;
  return <LoginClient dict={dict} />;
}
