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
  position: z.coerce.number().int().default(0),
});

export const bookingSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  fullName: z.string().trim().min(1, "Full name is required").max(150),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid contact number")
    .max(30, "Enter a valid contact number"),
  email: z.union([z.email("Enter a valid email address"), z.literal("")]).optional(),
  address: z.string().trim().min(1, "Address is required").max(500),
  shopName: z.string().trim().max(150).optional(),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1, "Select a rating").max(5, "Select a rating"),
  comment: z.string().trim().max(1000).optional(),
});
