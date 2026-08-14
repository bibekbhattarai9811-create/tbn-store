"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/dictionaries";
import { registerAction } from "./actions";

function RegisterForm({ dict }: { dict: Dictionary["auth"] }) {
  const [state, formAction, isPending] = useActionState(registerAction, undefined);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "";

  return (
    <>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {state?.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            {dict.fullName}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            {dict.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            {dict.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground"
          />
          <p className="text-xs text-foreground/50">{dict.passwordHint}</p>
        </div>

        <Button type="submit" size="lg" className="mt-2" disabled={isPending}>
          {isPending ? dict.creatingAccount : dict.createAccount}
        </Button>

        <p className="text-center text-xs text-foreground/50">
          {dict.agreePrefix}{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            {dict.privacyLinkLabel}
          </Link>
          .
        </p>
      </form>

      <p className="text-center text-sm text-foreground/60">
        {dict.haveAccount}{" "}
        <Link
          href={
            callbackUrl
              ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : "/login"
          }
          className="font-medium text-foreground hover:underline"
        >
          {dict.signIn}
        </Link>
      </p>
    </>
  );
}

export function RegisterClient({ dict }: { dict: Dictionary["auth"] }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{dict.registerTitle}</h1>
        <p className="text-sm text-foreground/60">{dict.registerSubtitle}</p>
      </div>

      <Suspense fallback={null}>
        <RegisterForm dict={dict} />
      </Suspense>
    </div>
  );
}
