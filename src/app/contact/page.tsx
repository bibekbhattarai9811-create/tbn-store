import type { Metadata } from "next";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (await getDictionary(locale)).contact.pageTitle };
}

const rowClasses = "flex items-start gap-3";
const labelClasses = "text-xs uppercase tracking-wide text-foreground/50";
const valueClasses = "text-sm font-medium";

export default async function ContactPage() {
  const locale = await getLocale();
  const dict = (await getDictionary(locale)).contact;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{dict.pageTitle}</h1>
        <p className="text-sm text-foreground/60">{dict.subtitle}</p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-border-subtle p-6">
        <div className={rowClasses}>
          <User size={18} className="mt-0.5 shrink-0 text-foreground/50" />
          <div>
            <p className={labelClasses}>{dict.contactPerson}</p>
            <p className={valueClasses}>Tej Neupane</p>
          </div>
        </div>

        <div className={rowClasses}>
          <Phone size={18} className="mt-0.5 shrink-0 text-foreground/50" />
          <div>
            <p className={labelClasses}>{dict.phone}</p>
            <a href="tel:+9779849430041" className={`${valueClasses} hover:underline`}>
              +977 984-9430041
            </a>
          </div>
        </div>

        <div className={rowClasses}>
          <Mail size={18} className="mt-0.5 shrink-0 text-foreground/50" />
          <div>
            <p className={labelClasses}>{dict.email}</p>
            <a
              href="mailto:NeupanetejParsad59@gmail.com"
              className={`${valueClasses} hover:underline`}
            >
              NeupanetejParsad59@gmail.com
            </a>
          </div>
        </div>

        <div className={rowClasses}>
          <MapPin size={18} className="mt-0.5 shrink-0 text-foreground/50" />
          <div>
            <p className={labelClasses}>{dict.location}</p>
            <p className={valueClasses}>Aakriti House</p>
            <p className="text-sm text-foreground/70">Mahaboudha, Ganesh Mandir</p>
          </div>
        </div>
      </div>
    </div>
  );
}
