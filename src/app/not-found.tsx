import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function NotFound() {
  const locale = await getLocale();
  const dict = getDictionary(locale).notFound;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-medium text-foreground/50">{dict.code}</p>
      <h1 className="text-2xl font-semibold tracking-tight">{dict.title}</h1>
      <p className="max-w-sm text-sm text-foreground/60">{dict.subtitle}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonClasses("primary", "md")}>
          {dict.goHome}
        </Link>
        <Link href="/products" className={buttonClasses("outline", "md")}>
          {dict.browseProducts}
        </Link>
      </div>
    </div>
  );
}
