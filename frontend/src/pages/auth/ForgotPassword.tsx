import { useForm, type SubmitHandler } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/Textfield";
import Button from "../../components/ui/Button";
import {ForgotPasswordSchema, type ForgotPasswordFormData } from "../../schemas/authSchema";
import { useForgotPassword } from "../../hooks/auth/use-forgot-password-hook";
import { promiseToast } from "../../utils/sileo";

export default function ForgotPassword() {
    const forgotPasswordMutation = useForgotPassword();

    const{
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(ForgotPasswordSchema),    
    });

    const OnSubmit: SubmitHandler<ForgotPasswordFormData> = (data) => {
        promiseToast(
            forgotPasswordMutation.mutateAsync(data.email)
        );
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
                        Forgot Password
                    </span>
                </div>
    
                <div className="w-full h-[1px] bg-gray-400 mb-4"></div>
    
                <TextField 
                    label="Email"
                    placeholder="Enter Your Email"
                    className="mb-4"
                    registration={register("email")}
                    error={errors.email?.message}
                    />
                <Button type="submit" disabled={forgotPasswordMutation.isPending}>
                    {forgotPasswordMutation.isPending 
                        ? "Sending..."
                        : "Send Reset Link"} 
                </Button>
            </Card>
        </form>
        );
}

