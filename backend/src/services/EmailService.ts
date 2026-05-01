import { brevo,  sender } from "../config/brevo";

export default class EmailService {
    static async sendResetEmail (email : string, name : string, resetLink : string) {
        try {
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 30px;">
            <div style="max-width: 500px; margin: auto; background: white; border-radius: 12px; padding: 30px; border: 1px solid #d1d5db;">
                
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                <div style="width: 55px; height: 55px; background: #111827; border-radius: 999px; display: flex; align-items: center; justify-content: center;">
                    <img src="/logo.png" alt="logo" style="width: 35px; height: 35px;" />
                </div>

                <h2 style="margin: 0; font-size: 16px; color: #111827;">
                    Zhiyuan Enterprice Group Inc.
                </h2>
                </div>

                <hr style="border: none; border-top: 1px solid #d1d5db; margin-bottom: 20px;" />

                <h1 style="font-size: 20px; color: #111827; margin-bottom: 10px;">
                Hello, ${name}
                </h1>

                <p style="font-size: 14px; color: #374151; margin-bottom: 20px;">
                We received a request to reset your password. Click the button below to continue.
                </p>

                <a href="${resetLink}"
                style="display: inline-block; margin-top: 10px; background: #111827; color: white; padding: 12px 18px;
                text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: bold;">
                Reset Password
                </a>

                <p style="font-size: 13px; color: #6b7280; margin-top: 25px;">
                If the button does not work, copy and paste this link into your browser:
                </p>

                <p style="font-size: 12px; color: #111827; word-break: break-word;">
                ${resetLink}
                </p>

                <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
                If you did not request a password reset, please ignore this email.
                </p>

            </div>
        </div>
        `;

        await brevo.sendTransacEmail({
            sender,
            to: [{ email }],
            subject: "Reset Your Password",
            htmlContent,
        });

        return true;
    } catch (err: any) {
        console.error("Error sending forgot password email:", err);
        return false;
    }
    }
}