"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/Button";
import { updateUserRoleAction } from "@/app/admin/customers/actions";

const ROLES = ["CUSTOMER", "HELPER", "ADMIN"] as const;

export function RoleForm({
  userId,
  currentRole,
  roleLabels,
  dict,
}: {
  userId: string;
  currentRole: string;
  roleLabels: Record<string, string>;
  dict: {
    changeRole: string;
    updateRole: string;
    updatingRole: string;
    roleUpdated: string;
  };
}) {
  const [role, setRole] = useState(currentRole);
  const [savedRole, setSavedRole] = useState(currentRole);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dirty = role !== savedRole;

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await updateUserRoleAction(userId, role);
      if (result.error) {
        setError(result.error);
      } else {
        setSavedRole(role);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 1500);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="role" className="text-sm font-medium">
        {dict.changeRole}
      </label>
      <div className="flex items-center gap-2">
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="h-11 rounded-lg border border-border-subtle bg-surface px-3 text-sm outline-none focus:border-foreground"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {roleLabels[r] ?? r}
            </option>
          ))}
        </select>
        <Button
          type="button"
          size="md"
          onClick={handleSubmit}
          disabled={!dirty || isPending}
        >
          {isPending ? dict.updatingRole : dict.updateRole}
        </Button>
      </div>
      {justSaved && !dirty && (
        <span className="text-xs text-accent">{dict.roleUpdated}</span>
      )}
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
