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
  email: z.email("Invalid Email"),
  password: passwordSchema,
});
