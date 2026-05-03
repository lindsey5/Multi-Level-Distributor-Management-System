import { useForm, type SubmitHandler } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/Textfield";
import Button from "../../components/ui/Button";
import { ResetPasswordSchema, type ResetPasswordFormData } from "../../schemas/authSchema";
import { useResetPassword } from "../../hooks/auth/use-reset-password.hook";
import { useParams } from "react-router-dom";
import { promiseToast } from "../../utils/sileo";

export default function ResetPassword() {
    const { token } = useParams();
    const resetPasswordMutation = useResetPassword();

    const{
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(ResetPasswordSchema),    
    });

    const OnSubmit: SubmitHandler<ResetPasswordFormData> = (data) => {
        promiseToast(
            resetPasswordMutation.mutateAsync({
                newPassword: data.newPassword,
                token: token || ""
            }),
            "top-center",
            () => { 
                window.location.href = '/'
            }
        )
    };

    return (
        <form
            onSubmit={handleSubmit(OnSubmit)}
            className="h-screen flex items-center justify-center"
        >
            <Card className="flex flex-col w-[95vw] md:w-full md:max-w-sm px-8 py-12">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-15 h-15 rounded-full p-2 bg-gray-800 flex items-center justify-center">
                        <img src="/logo.png" alt="logo" />
                    </div>
                    <span className="text-lg font-medium text-gray-900">
                        Reset Password
                    </span>
                </div>
    
                <div className="w-full h-[1px] bg-gray-400 mb-4"></div>
    
                <TextField 
                    label="New Password"
                    placeholder="Enter new password"
                    className="mb-4"
                    registration={register("newPassword")}
                    error={errors.newPassword?.message}
                    type="password"
                />
                <TextField 
                    label="Confirm Password"
                    placeholder="Confirm your new password"
                    className="mb-4"
                    registration={register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                    type="password"
                />
                <Button type="submit" disabled={resetPasswordMutation.isPending}>
                    {resetPasswordMutation.isPending 
                        ? "Loading..."
                        : "Reset Password"} 
                </Button>
            </Card>
        </form>
        );
}

