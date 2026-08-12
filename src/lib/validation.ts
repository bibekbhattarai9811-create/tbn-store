import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200)
    .regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  sku: z.string().trim().min(1, "SKU is required").max(100),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  brand: z.string().trim().max(100).optional(),
  categoryId: z.string().min(1, "Select a category"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100)
    .regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
});
