import type { Metadata } from "next";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";
import { RegisterClient } from "./RegisterClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: getDictionary(locale).auth.registerTitle };
}

export default async function RegisterPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale).auth;
  return <RegisterClient dict={dict} />;
}
