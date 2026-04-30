import * as z from 'zod';

export const distributorSchema = z.object({
    distributor_name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must not exceed 100 characters"),
    email: z
        .string()
        .email('Invalid email address')
        .max(100, "Email must not exceed 100 characters"),
});

export type DistributorFormData = z.infer<typeof distributorSchema>;

const WithdrawalMethodTypes = ["card", "gcash", "maya"] as const;

export const withdrawalMethodSchema = z.object({
    type: z.enum(WithdrawalMethodTypes),

    account_name: z
        .string()
        .min(1, "Account name is required")
        .max(100, "Account name must not exceed 100 characters"),

    account_number: z
        .string()
        .min(1, "Account number is required")
        .max(50, "Account number must not exceed 50 characters"),

    bank_name: z.string().max(100).optional(),

    is_default: z.boolean()
}).superRefine((data, ctx) => {
    if (data.type === "card" && !data.bank_name) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Bank name is required",
            path: ["bank_name"],
        });
    }
});

export type WithdrawalMethodFormData = z.infer<typeof withdrawalMethodSchema>;