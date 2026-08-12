import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/Button";
import { signOutAction } from "@/app/actions";

export const metadata: Metadata = {
  title: "Your account",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const { user } = session;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-16 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your account</h1>
        <p className="text-sm text-foreground/60">
          Manage your profile details.
        </p>
      </div>

      <dl className="flex flex-col gap-4 rounded-2xl border border-border-subtle p-6">
        <div className="flex justify-between text-sm">
          <dt className="text-foreground/60">Name</dt>
          <dd className="font-medium">{user.name}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-foreground/60">Email</dt>
          <dd className="font-medium">{user.email}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-foreground/60">Role</dt>
          <dd className="font-medium">{user.role}</dd>
        </div>
      </dl>

      <form action={signOutAction}>
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>
    </div>
  );
}
