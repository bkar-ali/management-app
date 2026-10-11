import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/\d/, "Password must contain a number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain a special character (!@#$%^&*)",
  );

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Must Be At Least 3 characters")
    .max(20, "Name cannot exceed 20 characters"),

  email: z.email("Invalid email"),

  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z
    .string()
    .check(
      z.minLength(1, "Email is required"),
      z.email("Invalid email address"),
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});
export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .check(
      z.minLength(1, { error: "Email is required" }),
      z.email({ error: "Invalid email address" }),
    ),
});
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });
