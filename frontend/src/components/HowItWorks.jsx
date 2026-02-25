import React from 'react';
import { UserPlus, Activity, Upload, Trophy } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <UserPlus className="w-8 h-8 text-primary-600" />,
            title: 'Create Your Account',
            description: 'Sign up and set up your household profile to start tracking your carbon footprint.'
        },
        {
            icon: <Activity className="w-8 h-8 text-primary-600" />,
            title: 'Log Your Activities',
            description: 'Record daily activities like transport, energy use, and waste — we auto-calculate your CO₂ emissions.'
        },
        {
            icon: <Upload className="w-8 h-8 text-primary-600" />,
            title: 'Upload Proof of Action',
            description: 'Submit photo proof of eco-friendly actions like recycling or using public transit for verification.'
        },
        {
            icon: <Trophy className="w-8 h-8 text-primary-600" />,
            title: 'Earn Rewards & Credits',
            description: 'Get reward points, climb the community leaderboard, and earn carbon credits for your sustainable efforts.'
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold font-outfit text-primary-900 mb-4">How It Works</h2>
                    <p className="text-gray-600">Start your sustainability journey in four simple steps — track, reduce, earn, and sustain.</p>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-100 -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-white border-2 border-primary-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary-50 relative group hover:border-primary-500 transition-colors">
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold font-outfit text-primary-900 mb-3">{step.title}</h3>
                                <p className="text-gray-500 max-w-[200px]">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
