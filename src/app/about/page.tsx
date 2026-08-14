import type { Metadata } from "next";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).about.pageTitle };
}

const sectionClasses = "flex flex-col gap-2";
const headingClasses = "text-lg font-semibold tracking-tight";
const bodyClasses = "text-sm leading-relaxed text-foreground/70";

export default async function AboutPage() {
  const locale = await getLocale();
  const dict = (await getDictionary(locale)).about;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{dict.pageTitle}</h1>
        <p className="text-sm text-foreground/50">{dict.subtitle}</p>
      </div>

      <p className={bodyClasses}>{dict.intro}</p>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>{dict.howWeWorkHeading}</h2>
        <p className={bodyClasses}>{dict.howWeWork}</p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>{dict.whyBookingHeading}</h2>
        <p className={bodyClasses}>{dict.whyBooking}</p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>{dict.getInTouchHeading}</h2>
        <p className={bodyClasses}>
          {dict.getInTouchPrefix}{" "}
          <a href="/contact" className="underline hover:no-underline">
            {dict.getInTouchLinkLabel}
          </a>{" "}
          {dict.getInTouchSuffix}
        </p>
      </div>
    </div>
  );
}
