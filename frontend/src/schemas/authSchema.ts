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