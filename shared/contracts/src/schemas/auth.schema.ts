import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

export const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(10, "At least 10 characters")
      .max(32, "At most 32 characters")
      .regex(/[a-z]/, "At least one lowercase character")
      .regex(/[A-Z]/, "At least one uppercase character")
      .regex(/[0-9]/, "At least one number")
      .regex(/[!@#$%^&*(),.?\":{}|<>]/, "At least one special character"),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    organizationName: z.string().min(1, "Organization is required")
  })
  .refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
