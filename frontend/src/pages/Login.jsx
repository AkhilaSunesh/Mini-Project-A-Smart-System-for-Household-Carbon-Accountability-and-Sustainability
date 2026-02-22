import React, { useState } from 'react';
import { Leaf, Mail, Lock, ArrowRight, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(null);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!isLogin && !formData.name.trim()) newErrors.name = 'Full name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address.';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setIsLoading(true);
        setErrors({});
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setSuccess(isLogin ? 'Welcome back! Redirecting...' : 'Account created! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 1200);
        }, 1500);
    };

    const handleSocialLogin = (provider) => {
        setSocialLoading(provider);
        // Simulate OAuth flow - in production, integrate Firebase/Auth0/Supabase
        setTimeout(() => {
            setSocialLoading(null);
            navigate('/dashboard');
        }, 1800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Form Side */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                                <Leaf className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold font-outfit text-primary-900">Ecological</span>
                        </Link>
                    </div>

                    <h2 className="text-3xl font-bold font-outfit text-primary-900 mb-2">
                        {isLogin ? 'Welcome Back! 👋' : 'Join the Movement 🌱'}
                    </h2>
                    <p className="text-gray-500 mb-8">
                        {isLogin ? 'Enter your details to access your eco-dashboard.' : 'Start your sustainable journey today.'}
                    </p>

                    {/* Success message */}
                    {success && (
                        <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium animate-fade-in">
                            <CheckCircle className="w-5 h-5 shrink-0" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'} focus:ring-2 outline-none transition-all`}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'} focus:ring-2 outline-none transition-all`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'} focus:ring-2 outline-none transition-all`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                                <span className="text-sm text-gray-500">Remember me</span>
                            </label>
                            {isLogin && (
                                <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700">Forgot Password?</button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Please wait...
                                </>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <span className="relative bg-white px-4 text-sm text-gray-500">Or continue with</span>
                    </div>

                    {/* Social Buttons */}
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            disabled={socialLoading !== null}
                            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium text-gray-700 text-sm"
                        >
                            {socialLoading === 'google' ? (
                                <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span>
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            Google
                        </button>
                        <button
                            onClick={() => handleSocialLogin('facebook')}
                            disabled={socialLoading !== null}
                            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium text-gray-700 text-sm"
                        >
                            {socialLoading === 'facebook' ? (
                                <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></span>
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            )}
                            Facebook
                        </button>
                    </div>

                    {/* GitHub login */}
                    <button
                        onClick={() => handleSocialLogin('github')}
                        disabled={socialLoading !== null}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium text-gray-700 text-sm"
                    >
                        {socialLoading === 'github' ? (
                            <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        )}
                        Continue with GitHub
                    </button>

                    <p className="mt-6 text-center text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => { setIsLogin(!isLogin); setErrors({}); setSuccess(''); }} className="text-primary-600 font-bold hover:underline">
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>

                {/* Image Side */}
                <div className="md:w-1/2 relative bg-primary-600 hidden md:block overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?q=80&w=800&auto=format&fit=crop"
                        alt="Nature"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-900/90 flex flex-col justify-between p-12 text-white">
                        <div>
                            <p className="text-primary-200 font-medium mb-2 uppercase tracking-widest text-xs">Sustainability First</p>
                            <h3 className="text-3xl font-bold font-outfit leading-tight">Be part of the<br />solution, not<br />the pollution.</h3>
                        </div>

                        <div className="space-y-5">
                            {[
                                'Track your carbon footprint daily',
                                'Earn rewards for eco-friendly choices',
                                'Connect with a global green community',
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-lg font-bold border border-white/20 shrink-0">{i + 1}</div>
                                    <p className="text-base text-white/90">{item}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 opacity-80">
                            <div className="flex -space-x-2.5">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-9 h-9 rounded-full border-2 border-primary-600 bg-gray-200 bg-cover overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=user${i + 10}`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm">Join <strong>250k+</strong> eco-warriors</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
