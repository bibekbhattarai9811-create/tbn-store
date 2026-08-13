import type { Metadata } from "next";
import { Mail, MapPin, Phone, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact us",
};

const rowClasses = "flex items-start gap-3";
const labelClasses = "text-xs uppercase tracking-wide text-foreground/50";
const valueClasses = "text-sm font-medium";

export default function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Contact us</h1>
        <p className="text-sm text-foreground/60">
          Have a question about a product or a booking? Reach out — we&apos;re happy to help.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-border-subtle p-6">
        <div className={rowClasses}>
          <User size={18} className="mt-0.5 shrink-0 text-foreground/50" />
          <div>
            <p className={labelClasses}>Contact person</p>
            <p className={valueClasses}>Tej Neupane</p>
          </div>
        </div>

        <div className={rowClasses}>
          <Phone size={18} className="mt-0.5 shrink-0 text-foreground/50" />
          <div>
            <p className={labelClasses}>Phone</p>
            <a href="tel:+9779849430041" className={`${valueClasses} hover:underline`}>
              +977 984-9430041
            </a>
          </div>
        </div>

        <div className={rowClasses}>
          <Mail size={18} className="mt-0.5 shrink-0 text-foreground/50" />
          <div>
            <p className={labelClasses}>Email</p>
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
            <p className={labelClasses}>Location</p>
            <p className={valueClasses}>Aakriti House</p>
            <p className="text-sm text-foreground/70">Mahaboudha, Ganesh Mandir</p>
          </div>
        </div>
      </div>
    </div>
  );
}
