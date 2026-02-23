import React, { useState } from 'react';
import { Leaf, Mail, Lock, ArrowRight, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!isLogin && !formData.name.trim()) newErrors.name = 'Username is required.';
        if (isLogin && !formData.name.trim()) newErrors.name = 'Username is required.';
        if (!isLogin && !formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!isLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setIsLoading(true);
        setErrors({});
        setSuccess('');

        try {
            if (isLogin) {
                // Login: get JWT tokens
                const res = await loginUser(formData.name, formData.password);
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                localStorage.setItem('username', formData.name);
                setSuccess('Welcome back! Redirecting...');
                setTimeout(() => navigate('/dashboard'), 800);
            } else {
                // Register: create account, then auto-login
                await registerUser(formData.name, formData.email, formData.password);
                const res = await loginUser(formData.name, formData.password);
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                localStorage.setItem('username', formData.name);
                setSuccess('Account created! Redirecting...');
                setTimeout(() => navigate('/dashboard'), 800);
            }
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const newErrors = {};
                // Django REST may return errors as { field: [messages] } or { detail: "..." }
                if (data.detail) {
                    newErrors.password = data.detail;
                } else {
                    if (data.username) newErrors.name = Array.isArray(data.username) ? data.username[0] : data.username;
                    if (data.email) newErrors.email = Array.isArray(data.email) ? data.email[0] : data.email;
                    if (data.password) newErrors.password = Array.isArray(data.password) ? data.password[0] : data.password;
                    if (data.non_field_errors) newErrors.password = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
                }
                if (Object.keys(newErrors).length === 0) {
                    newErrors.password = 'Something went wrong. Please try again.';
                }
                setErrors(newErrors);
            } else {
                setErrors({ password: 'Network error. Is the backend running?' });
            }
        } finally {
            setIsLoading(false);
        }
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
                        {isLogin ? 'Enter your credentials to access your eco-dashboard.' : 'Start your sustainable journey today.'}
                    </p>

                    {/* Success message */}
                    {success && (
                        <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium animate-fade-in">
                            <CheckCircle className="w-5 h-5 shrink-0" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Username field (both login and signup) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'} focus:ring-2 outline-none transition-all`}
                                    placeholder="your_username"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email field (signup only) */}
                        {!isLogin && (
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
                        )}

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
