"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import type { Dictionary } from "@/i18n/dictionaries";
import { loginAction } from "./actions";

function LoginForm({ dict }: { dict: Dictionary["auth"] }) {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              {dict.password}
            </label>
            <Link href="#" className="text-xs text-foreground/60 hover:underline">
              {dict.forgotPassword}
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground"
          />
        </div>

        <Button type="submit" size="lg" className="mt-2" disabled={isPending}>
          {isPending ? dict.signingIn : dict.signIn}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/60">
        {dict.noAccount}{" "}
        <Link
          href={
            callbackUrl
              ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : "/register"
          }
          className="font-medium text-foreground hover:underline"
        >
          {dict.createOne}
        </Link>
      </p>
    </>
  );
}

export function LoginClient({ dict }: { dict: Dictionary["auth"] }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{dict.signInTitle}</h1>
        <p className="text-sm text-foreground/60">{dict.signInSubtitle}</p>
      </div>

      <Suspense fallback={null}>
        <LoginForm dict={dict} />
      </Suspense>
    </div>
  );
}
