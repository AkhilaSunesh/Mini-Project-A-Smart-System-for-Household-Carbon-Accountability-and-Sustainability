import React from 'react';
import { TreeDeciduous, Wind, Droplets, Users } from 'lucide-react';

const Impact = () => {
    const stats = [
        {
            icon: <TreeDeciduous className="w-10 h-10 text-primary-600" />,
            value: '250k+',
            label: 'Trees Planted',
            description: 'Restoring forests globally'
        },
        {
            icon: <Wind className="w-10 h-10 text-primary-600" />,
            value: '1.2M',
            label: 'CO2 Reduced (t)',
            description: 'Lowering our carbon footprint'
        },
        {
            icon: <Droplets className="w-10 h-10 text-primary-600" />,
            value: '500k+',
            label: 'Liters Water Saved',
            description: 'Optimizing resource usage'
        },
        {
            icon: <Users className="w-10 h-10 text-primary-600" />,
            value: '50k+',
            label: 'Active Eco-Warriors',
            description: 'Growing climate community'
        }
    ];

    return (
        <section id="impact" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold font-outfit text-primary-900 mb-4">Our Collaborative Environmental Impact</h2>
                    <p className="text-gray-600">Together, we are making a measurable difference in protecting the earth.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-8 rounded-[40px] bg-primary-50/50 text-center hover:bg-primary-100 transition-colors group">
                            <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <h3 className="text-4xl font-bold font-outfit text-primary-900 mb-1">{stat.value}</h3>
                            <p className="text-lg font-bold text-primary-700 mb-2">{stat.label}</p>
                            <p className="text-sm text-gray-500">{stat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Impact;
