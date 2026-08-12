import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategoryAction } from "../actions";

export const metadata: Metadata = {
  title: "Add category",
};

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Add category</h1>
      <CategoryForm action={createCategoryAction} submitLabel="Create category" />
    </div>
  );
}
