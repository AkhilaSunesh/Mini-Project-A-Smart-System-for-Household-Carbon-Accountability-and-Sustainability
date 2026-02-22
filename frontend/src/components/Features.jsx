import React, { useState } from 'react';
import { ShieldCheck, Truck, RefreshCcw, Leaf, Zap, Heart, ArrowRight, TrendingUp } from 'lucide-react';

const Features = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const features = [
        {
            icon: <Leaf className="w-8 h-8 text-green-600" />,
            title: '100% Organic Products',
            description: 'Manufactured with care using pure organic ingredients and eco-friendly raw materials that keep you and the planet safe.',
            bgColor: 'bg-green-50',
            border: 'hover:border-green-200',
            shadow: 'hover:shadow-green-100',
            stat: '100%',
            statLabel: 'Organic certified',
            accentColor: 'text-green-600',
        },
        {
            icon: <Zap className="w-8 h-8 text-amber-600" />,
            title: 'Solar Energy Powered',
            description: 'Our manufacturing plants run entirely on clean, renewable solar and wind energy — zero fossil fuels, ever.',
            bgColor: 'bg-amber-50',
            border: 'hover:border-amber-200',
            shadow: 'hover:shadow-amber-100',
            stat: '0 kg',
            statLabel: 'CO₂ from energy',
            accentColor: 'text-amber-600',
        },
        {
            icon: <RefreshCcw className="w-8 h-8 text-blue-600" />,
            title: 'Zero Waste Packaging',
            description: 'Every product comes in 100% biodegradable or recyclable plastic-free packaging. Nothing goes to landfill.',
            bgColor: 'bg-blue-50',
            border: 'hover:border-blue-200',
            shadow: 'hover:shadow-blue-100',
            stat: '0 plastic',
            statLabel: 'In all our packaging',
            accentColor: 'text-blue-600',
        },
        {
            icon: <Truck className="w-8 h-8 text-purple-600" />,
            title: 'Low Carbon Delivery',
            description: 'We optimize shipping routes and use electric vehicles to minimize our delivery carbon footprint by 80%.',
            bgColor: 'bg-purple-50',
            border: 'hover:border-purple-200',
            shadow: 'hover:shadow-purple-100',
            stat: '80%',
            statLabel: 'Lower emissions',
            accentColor: 'text-purple-600',
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-red-600" />,
            title: 'Certified Sustainable',
            description: 'Fully certified by global eco-standards including Fair Trade, GOTS, and Global Organic Textile Standard.',
            bgColor: 'bg-red-50',
            border: 'hover:border-red-200',
            shadow: 'hover:shadow-red-100',
            stat: '12+',
            statLabel: 'Eco certifications',
            accentColor: 'text-red-600',
        },
        {
            icon: <Heart className="w-8 h-8 text-pink-600" />,
            title: 'Community Driven',
            description: '5% of every purchase goes directly to reforestation projects around the globe — over 15,000 trees planted so far.',
            bgColor: 'bg-pink-50',
            border: 'hover:border-pink-200',
            shadow: 'hover:shadow-pink-100',
            stat: '15k+',
            statLabel: 'Trees planted',
            accentColor: 'text-pink-600',
        }
    ];

    const impactStats = [
        { value: '124k', label: 'Kg CO₂ Saved', icon: '🌍' },
        { value: '15k+', label: 'Trees Planted', icon: '🌳' },
        { value: '50k+', label: 'Happy Members', icon: '💚' },
        { value: '99%', label: 'Plastic-Free', icon: '♻️' },
    ];

    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-50/50 rounded-full blur-3xl -z-10 animate-pulse-soft"></div>
            <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-[500px] h-[500px] bg-green-50/60 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
                    <span className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                        <TrendingUp className="w-4 h-4" />
                        Our Commitment to the Planet
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-bold font-outfit text-primary-900 mb-4">Why Choose <span className="text-gradient">Ecological?</span></h2>
                    <p className="text-gray-600 text-lg">
                        We're on a mission to make sustainable living accessible to everyone.
                        Our products are designed with both <strong>you</strong> and the <strong>planet</strong> in mind.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`p-8 rounded-[32px] border border-gray-100 ${feature.border} hover:shadow-xl ${feature.shadow} transition-all duration-300 group bg-white animate-fade-in-up opacity-0 cursor-default`}
                            style={{ animationDelay: `${0.1 + (index * 0.1)}s`, animationFillMode: 'forwards' }}
                        >
                            <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className={`text-xl font-bold font-outfit text-primary-900 mb-3 group-hover:${feature.accentColor} transition-colors`}>{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 mb-6">
                                {feature.description}
                            </p>

                            {/* Stat chip */}
                            <div className={`flex items-center justify-between p-3 rounded-xl ${feature.bgColor} transition-all duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-70'}`}>
                                <div>
                                    <p className={`text-xl font-bold ${feature.accentColor}`}>{feature.stat}</p>
                                    <p className="text-xs text-gray-500 font-medium">{feature.statLabel}</p>
                                </div>
                                <ArrowRight className={`w-5 h-5 ${feature.accentColor} group-hover:translate-x-1 transition-transform`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Impact Bar */}
                <div className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-[40px] p-10 md:p-14 relative overflow-hidden animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                    <div className="text-center mb-10 relative z-10">
                        <h3 className="text-3xl font-bold font-outfit text-white mb-2">Our Collective Impact</h3>
                        <p className="text-primary-200">Together, our community is making real change happen.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                        {impactStats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <p className="text-4xl font-bold font-outfit text-white mb-1">{stat.value}</p>
                                <p className="text-primary-300 text-sm font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
