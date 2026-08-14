import type { Metadata } from "next";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).shipping.pageTitle };
}

const sectionClasses = "flex flex-col gap-2";
const headingClasses = "text-lg font-semibold tracking-tight";
const bodyClasses = "text-sm leading-relaxed text-foreground/70";

export default async function ShippingReturnsPage() {
  const locale = await getLocale();
  const dict = (await getDictionary(locale)).shipping;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{dict.pageTitle}</h1>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>{dict.deliveryHeading}</h2>
        <p className={bodyClasses}>{dict.delivery}</p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>{dict.paymentHeading}</h2>
        <p className={bodyClasses}>{dict.payment}</p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>{dict.returnsHeading}</h2>
        <p className={bodyClasses}>{dict.returns}</p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>{dict.questionsHeading}</h2>
        <p className={bodyClasses}>
          {dict.questionsPrefix}{" "}
          <a href="/contact" className="underline hover:no-underline">
            {dict.questionsLinkLabel}
          </a>{" "}
          {dict.questionsSuffix}
        </p>
      </div>
    </div>
  );
}
