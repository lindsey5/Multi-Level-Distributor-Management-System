import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/Textfield";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ChangePasswordSchema, type ChangePasswordFormData } from "../../schemas/authSchema";
import { useChangePassword } from "../../hooks/auth/use-change-password.hook";
import { promiseToast } from "../../utils/sileo";

export default function ChangePassword () {
    const changePasswordMutation = useChangePassword();
    const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(ChangePasswordSchema),
    });

    const onSubmit: SubmitHandler<ChangePasswordFormData> = (data) => {
        const isConfirmed = confirm("Are you sure you want to change your password?");

        if (!isConfirmed) return;

        promiseToast(
            changePasswordMutation.mutateAsync({
                currentPassword: data.currentPassword,
                newPassword: data.password,
            })
        );
    };

    return (
        <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
            <Card className="space-y-3">
                <h1 className="font-bold text-md md:text-lg mb-5">Change Password</h1>
                <TextField 
                    label="Current Password"
                    placeholder="Enter current password"
                    type="password"
                    registration={register("currentPassword")}
                    error={errors.currentPassword?.message}
                />
                <TextField 
                    label="New Password"
                    placeholder="Enter new password"
                    type="password"
                    registration={register("password")}
                    error={errors.password?.message}
                />
                <TextField 
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    type="password"
                    registration={register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />
                <div className="flex justify-end">
                    <Button className="text-xs md:text-sm px-6 py-2 mt-5">
                        Change Password
                    </Button>
                </div>
            </Card>
        </form>
    )
}