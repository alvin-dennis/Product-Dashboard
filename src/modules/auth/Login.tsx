import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner'; // ✅ import from sonner

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/';

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: '', password: '' },
    });

    if (isAuthenticated) return <Navigate to={from} replace />;

    const onSubmit = async (data: LoginFormValues) => {
        clearError();
        const success = await login(data.username, data.password);

        if (success) {
            toast.success('Welcome back! You have successfully logged in.'); // ✅ sonner toast
            navigate(from, { replace: true });
        } else {
            toast.error(error || 'Invalid credentials. Please try again.'); // ✅ sonner toast
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side - decorative */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12"
            >
                <div className="max-w-md text-center text-primary-foreground">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm"
                    >
                        <Package className="h-10 w-10" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="font-display text-4xl font-bold"
                    >
                        ShopDash
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mt-4 text-lg opacity-90"
                    >
                        Your complete product management dashboard. Browse, manage, and shop with ease.
                    </motion.p>
                </div>
            </motion.div>

            {/* Right side - login form */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8 text-center lg:text-left">
                        <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                                <Package className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="font-display text-2xl font-bold">ShopDash</span>
                        </div>
                        <h2 className="font-display text-2xl font-bold">Welcome back</h2>
                        <p className="mt-2 text-muted-foreground">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-muted-foreground">
                                Username
                            </label>
                            <Input
                                placeholder="Enter your username"
                                autoComplete="username"
                                {...register('username')}
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs text-destructive">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-muted-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    {...register('password')}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full btn-primary-shadow" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
