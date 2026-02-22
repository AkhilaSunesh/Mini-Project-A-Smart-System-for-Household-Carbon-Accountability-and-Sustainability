import React from 'react';
import { MousePointer2, ClipboardCheck, Truck, Recycle } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <MousePointer2 className="w-8 h-8 text-primary-600" />,
            title: 'Choose Product',
            description: 'Select from our wide range of eco-friendly, plastic-free products.'
        },
        {
            icon: <ClipboardCheck className="w-8 h-8 text-primary-600" />,
            title: 'Place Order',
            description: 'Quick and secure checkout process with multiple payment options.'
        },
        {
            icon: <Truck className="w-8 h-8 text-primary-600" />,
            title: 'Fast Delivery',
            description: 'Low-carbon shipping delivers your items right to your doorstep.'
        },
        {
            icon: <Recycle className="w-8 h-8 text-primary-600" />,
            title: 'Make an Impact',
            description: 'Feel good knowing your purchase supports reforestation projects.'
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold font-outfit text-primary-900 mb-4">How It Works</h2>
                    <p className="text-gray-600">Join the movement in four simple steps.</p>
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
