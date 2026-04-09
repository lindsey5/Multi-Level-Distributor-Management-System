import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/Textfield";
import { LoginSchema, type LoginFormData } from "../../schemas/authSchema";
import { useLogin } from "../../hooks/auth/use-login.hook";
import Button from '../../components/ui/Button';
import { type RootState } from '../../lib/features/store';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function Login() {
    const auth = useSelector((state : RootState) => state.auth);
    const loginMutation = useLogin();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit: SubmitHandler<LoginFormData> = (data) => loginMutation.mutate(data);

    if(auth.distributor && auth.accessToken) return <Navigate to="/distributor" />

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="h-screen flex items-center justify-center"
        >
            <Card className="flex flex-col w-[95vw] md:w-full md:max-w-sm px-8 py-12">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-18 h-18 rounded-full p-2 bg-gray-800 flex items-center justify-center">
                        <img src="/logo.png" alt="logo" />
                    </div>
                    <span className="w-50 text-2xl font-medium text-gray-900">
                        Distributor Login
                    </span>
                </div>

                <div className="w-full h-[1px] bg-gray-400 mb-4"></div>
                {loginMutation.error?.message && <span className='text-red-500 text-sm my-3'>{loginMutation.error?.message}</span>}
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

                <Button type='submit' disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? 'Logging in...' : 'Log In'}
                </Button>
            </Card>
        </form>
    );
}