import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
    const reviews = [
        {
            name: 'Sarah Johnson',
            role: 'Home Gardener',
            image: 'https://i.pravatar.cc/150?u=sarah',
            text: 'The bamboo water bottle is stunning! I take it everywhere. It stays cold all day and I love that it’s completely plastic-free.'
        },
        {
            name: 'Michael Chen',
            role: 'Outdoor Enthusiast',
            image: 'https://i.pravatar.cc/150?u=michael',
            text: 'I’ve tried many eco-friendly brands, but Ecological actually delivers on quality. Their tote bags are incredibly durable and stylish.'
        },
        {
            name: 'Emma Williams',
            role: 'Sustainability Advocate',
            image: 'https://i.pravatar.cc/150?u=emma',
            text: 'Switching to their bamboo toothbrushes was the easiest change I made this year. High quality bristles and great for the planet!'
        }
    ];

    return (
        <section className="py-24 bg-primary-900 text-white relative overflow-hidden">
            {/* Decorative leaf shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-700 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-30"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold font-outfit mb-4">What Our Community Says</h2>
                    <p className="text-primary-100">Don't just take our word for it. Hear from others making the switch.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-[32px] border border-white/10 flex flex-col items-start hover:bg-white/15 transition-all">
                            <div className="flex text-accent-gold gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <Quote className="w-10 h-10 text-primary-400 mb-4 opacity-50" />
                            <p className="text-lg text-primary-50 mb-8 leading-relaxed italic">
                                "{review.text}"
                            </p>
                            <div className="flex items-center gap-4 mt-auto">
                                <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary-400" />
                                <div>
                                    <h4 className="font-bold font-outfit">{review.name}</h4>
                                    <p className="text-xs text-primary-300">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
