import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Import hook

export default function LoginPage() {
    const navigate = useNavigate();

    const { user, login, isPending, errors, setErrors } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setEmail(user.email || '');
            setPassword(user.rawPassword || '');
            setRememberMe(!!user.email && !!user.rawPassword);
        }
    }, [user]);

    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (/\s/.test(password)) {
            newErrors.password = 'Password cannot contain spaces';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

 const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  if (!validateForm()) return;

  try {
    await login(email, password, rememberMe);
    console.log('Login successful');
    navigate('/dashboard');
  } catch (err) {
    setErrors({ form: err?.response?.data?.message || err?.response?.data || 'Something went wrong' });
  }
};


    return (
        <div className="min-h-screen bg-linear-to-br from-primary via-primary/80 to-accent/60 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-8 border border-border">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                        <Lock className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2">Sign in to your account</p>
                </div>

                {/* Display General Error if API fails */}
                {errors.form && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">
                        {errors.form}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                className={`w-full pl-10 pr-4 py-3 bg-background border ${errors.email ? 'border-destructive' : 'border-input'
                                    } rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition text-foreground placeholder:text-muted-foreground`}
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value.replaceAll(' ', '').trim())}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                className={`w-full pl-10 pr-12 py-3 bg-background border ${errors.password ? 'border-destructive' : 'border-input'
                                    } rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition text-foreground placeholder:text-muted-foreground`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-destructive">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-primary border-input rounded focus:ring-ring cursor-pointer"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-foreground cursor-pointer">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transform hover:scale-[1.02] transition duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>

                {/* <div className="mt-6 text-center">
                    <p className="text-muted-foreground text-sm">
                        Don't have an account?{' '}
                        <a href="#" className="text-primary hover:text-primary/80 font-semibold transition">
                            Sign up
                        </a>
                    </p>
                </div> */}
            </div>
        </div>
    );
}