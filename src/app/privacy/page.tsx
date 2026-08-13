import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const sectionClasses = "flex flex-col gap-2";
const headingClasses = "text-lg font-semibold tracking-tight";
const bodyClasses = "text-sm leading-relaxed text-foreground/70";

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-foreground/50">Last updated August 12, 2026</p>
      </div>

      <p className={bodyClasses}>
        TBN Store (&quot;we&quot;, &quot;us&quot;) respects your privacy. This page explains what
        information we collect when you use this website, why we collect it, and how it&apos;s
        used.
      </p>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Information we collect</h2>
        <p className={bodyClasses}>
          <strong>Account information:</strong> your name, email address, and password (stored as
          a secure hash — we never store or see your password in plain text).
        </p>
        <p className={bodyClasses}>
          <strong>Booking information:</strong> when you submit a booking request, we collect your
          full name, contact number, delivery address, and — optionally — your email and shop
          name.
        </p>
        <p className={bodyClasses}>
          <strong>Reviews:</strong> if you leave a product review, your name and the review text
          are shown publicly on that product&apos;s page.
        </p>
        <p className={bodyClasses}>
          We do not collect any payment or card details through this website — bookings are
          confirmed and paid for directly with our team, not online.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>How we use your information</h2>
        <p className={bodyClasses}>
          We use the information you provide to create and manage your account, to contact you by
          phone or email about a booking (to confirm availability, arrange payment, and delivery),
          and to keep a record of your booking history. We do not use your information for
          advertising, and we do not sell your information to anyone.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Sharing your information</h2>
        <p className={bodyClasses}>
          We don&apos;t share your personal information with third parties, except where required
          by law. Your data is stored with our database provider solely to operate this website.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Cookies</h2>
        <p className={bodyClasses}>
          We use a single functional cookie to keep you signed in. We don&apos;t use tracking or
          advertising cookies.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Children&apos;s privacy</h2>
        <p className={bodyClasses}>
          We sell children&apos;s clothing, but this website is intended to be used by parents and
          guardians, not by children. Accounts and bookings should be created by an adult. We do
          not knowingly collect information directly from children.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Your choices</h2>
        <p className={bodyClasses}>
          You can update your account details at any time, and you can ask us to delete your
          account and personal information by contacting us below.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Changes to this policy</h2>
        <p className={bodyClasses}>
          If we make changes to this policy, we&apos;ll update the date at the top of this page.
        </p>
      </div>

      <div className={sectionClasses}>
        <h2 className={headingClasses}>Contact us</h2>
        <p className={bodyClasses}>
          Questions about your data, or want it removed? Contact us at{" "}
          <a
            href="mailto:NeupanetejParsad59@gmail.com"
            className="font-medium text-foreground hover:underline"
          >
            NeupanetejParsad59@gmail.com
          </a>{" "}
          or{" "}
          <a href="tel:+9779849430041" className="font-medium text-foreground hover:underline">
            +977 984-9430041
          </a>
          .
        </p>
      </div>
    </div>
  );
}
