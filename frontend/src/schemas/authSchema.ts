import * as z from 'zod';

export const LoginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .min(3, "Email must be at least 3 characters")
        .email("Invalid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const PasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include at least 1 uppercase letter")
        .regex(/[a-z]/, "Must include at least 1 lowercase letter")
        .regex(/[0-9]/, "Must include at least 1 number")
        .regex(/[^A-Za-z0-9]/, "Must include at least 1 special character"),

    confirmPassword: z
        .string()
        .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordFormData = z.infer<typeof PasswordSchema>;