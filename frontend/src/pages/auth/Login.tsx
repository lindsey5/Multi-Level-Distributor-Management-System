import { useState } from "react";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/Textfield";
import { LoginSchema, type LoginFormData } from "../../schemas/authSchema";
import { useAdminLogin } from "../../hooks/auth/use-admin-login.hook";

export default function Login() {
    const [user, setUser] = useState<"Admin" | "Distributor">("Distributor");
    const adminLoginMutation = useAdminLogin();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit: SubmitHandler<LoginFormData> = (data) => {
        adminLoginMutation.mutate(data);
    };
    
    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="bg-main h-screen flex items-center justify-center"
        >
            <Card className="flex flex-col w-full max-w-sm px-8 py-12">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-18 h-18 rounded-full p-2 bg-gray-800 flex items-center justify-center">
                        <img src="/logo.png" alt="logo" />
                    </div>
                    <span className="w-50 text-xl font-medium text-gray-900">
                        Zhiyuan Enterprice Group Inc.
                    </span>
                </div>

                <div className="w-full h-[1px] bg-gray-400 mb-8"></div>

                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Welcome back</h1>

                {/* Selection */}
                <div className="flex gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => setUser("Distributor")}
                        className={`flex-1 h-11 rounded-lg text-sm font-medium border transition-colors
                        ${
                            user === "Distributor"
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        Distributor
                    </button>

                    <button
                        type="button"
                        onClick={() => setUser("Admin")}
                        className={`flex-1 h-11 rounded-lg text-sm font-medium border transition-colors
                        ${
                            user === "Admin"
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        Admin
                    </button>
                </div>

                <TextField
                    label="Email"
                    placeholder="you@example.com"
                    className="mb-3"
                    registration={register("email")}
                    error={errors.email?.message}
                />

                <TextField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    className="mb-3"
                    registration={register("password")}
                    error={errors.password?.message}
                />

                <a href="#" className="text-sm font-medium mb-8 mt-4">Forgot password?</a>

                <button
                    type="submit"
                    className="py-3 px-5 rounded-lg text-sm font-medium border transition-colors bg-gray-900 text-white border-gray-900 hover:opacity-70"
                >
                    Login as {user}
                </button>
            </Card>
        </form>
    );
}