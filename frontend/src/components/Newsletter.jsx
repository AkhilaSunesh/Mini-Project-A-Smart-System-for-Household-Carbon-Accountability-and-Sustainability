import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setSubmitted(true);
    };

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="bg-primary-600 rounded-[64px] p-8 md:p-16 lg:p-24 relative overflow-hidden shadow-2xl shadow-primary-200">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-700 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                        <div className="text-center lg:text-left lg:flex-1">
                            <h2 className="text-4xl lg:text-5xl font-bold font-outfit text-white mb-6">
                                Ready to Start Your <span className="text-primary-200">Green Journey?</span>
                            </h2>
                            <p className="text-primary-100 text-lg lg:max-w-md">
                                Subscribe to our newsletter for eco-tips, new product reveals, and exclusive sustainability rewards.
                            </p>
                        </div>

                        <div className="w-full lg:flex-1">
                            {submitted ? (
                                <div className="flex flex-col items-center justify-center gap-4 py-10 text-white text-center animate-fade-in-up">
                                    <CheckCircle className="w-16 h-16 text-primary-200" />
                                    <h3 className="text-2xl font-bold font-outfit">You're in! 🌱</h3>
                                    <p className="text-primary-200">Welcome to the movement. Check your inbox for a surprise.</p>
                                </div>
                            ) : (
                                <>
                                    <form
                                        className="bg-white/10 backdrop-blur-md p-2 rounded-[32px] flex flex-col sm:flex-row gap-2 border border-white/20 shadow-xl"
                                        onSubmit={handleSubmit}
                                    >
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                            placeholder="Enter your email address"
                                            className="bg-transparent text-white placeholder-primary-200 px-6 py-4 flex-grow focus:outline-none text-lg"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-white text-primary-900 px-8 py-4 rounded-[24px] font-bold hover:bg-primary-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                                        >
                                            Subscribe Now
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                    {error && (
                                        <p className="text-red-300 text-sm mt-3 px-4 font-medium">{error}</p>
                                    )}
                                    <p className="text-primary-200 text-sm mt-4 text-center lg:text-left px-2">
                                        Join 10,000+ monthly subscribers. No spam, ever.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
