import React from 'react';
import { ArrowRight, Play, Check, Leaf } from 'lucide-react';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Hero = () => {
    return (
        <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary-100/50 rounded-full blur-3xl -z-10 animate-pulse-soft"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-primary-50/70 rounded-full blur-3xl -z-10 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col items-start">
                        <div className="animate-fade-in-up inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            Leading the Sustainable Revolution
                        </div>

                        <h1 className="animate-fade-in-up opacity-0 text-5xl lg:text-7xl font-bold font-outfit text-primary-900 leading-tight mb-6" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                            Nurture Nature with <span className="text-gradient">Ecological</span>
                        </h1>

                        <p className="animate-fade-in-up opacity-0 text-lg text-gray-600 mb-10 max-w-lg leading-relaxed" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                            Discover eco-friendly products that don't compromise on quality.
                            Join thousands making a positive impact on our planet through
                            sustainable choices and conscious living.
                        </p>

                        <div className="animate-fade-in-up opacity-0 flex flex-wrap gap-5" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>


                            <button
                                onClick={() => scrollTo('how-it-works')}
                                className="bg-white hover:bg-gray-50 text-primary-900 border border-gray-200 px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
                            >
                                <div className="bg-primary-100 p-2 rounded-full">
                                    <Play className="w-4 h-4 fill-primary-600 text-primary-600" />
                                </div>
                                How It Works
                            </button>
                        </div>

                        <div className="animate-fade-in-up opacity-0 mt-12 flex items-center gap-6" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User avatar" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-white bg-primary-600 flex items-center justify-center text-white text-xs font-bold">+2k</div>
                            </div>
                            <div>
                                <div className="flex text-accent-gold mb-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Trusted by 25,000+ eco-warriors</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative md:block hidden animate-slide-in-right opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <div className="relative rounded-[40px] overflow-hidden shadow-2xl z-10 animate-float-slow group bg-green-50">
                            <img
                                src="/hero-image.png"
                                alt="Eco-friendly products surrounded by lush greenery"
                                loading="eager"
                                className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Floating cards */}
                        <div className="absolute top-20 -left-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-20 animate-float hover:scale-105 transition-transform cursor-default" style={{ animationDelay: '1s' }}>
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2.5 rounded-xl">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Material</p>
                                    <p className="text-sm font-bold text-gray-900">100% Organic</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-24 -right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-20 animate-float hover:scale-105 transition-transform cursor-default" style={{ animationDelay: '1.5s' }}>
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-100 p-2.5 rounded-xl">
                                    <Leaf className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Packaging</p>
                                    <p className="text-sm font-bold text-gray-900">Plastic-Free</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
