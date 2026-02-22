import React, { useState } from 'react';
import { Leaf, Twitter, Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Footer = () => {
    const [comingSoon, setComingSoon] = useState('');

    const showComingSoon = (name) => {
        setComingSoon(name);
        setTimeout(() => setComingSoon(''), 2500);
    };

    const quickLinks = [
        { name: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { name: 'Shop Products', action: () => scrollTo('products') },
        { name: 'Our Impact', action: () => scrollTo('impact') },
        { name: 'About Us', action: () => scrollTo('about') },
    ];

    const supportLinks = ['Shipping Policy', 'Return & Refund', 'FAQ', 'Privacy Policy', 'Terms of Service'];

    const socials = [
        { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
        { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
        { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    ];

    return (
        <footer id="contact" className="bg-primary-50 pt-24 pb-12 border-t border-primary-100 relative">
            {/* Coming Soon Toast */}
            {comingSoon && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-primary-900 text-white px-6 py-3 rounded-2xl shadow-2xl animate-fade-in-up font-medium text-sm">
                    📄 {comingSoon} — Coming soon!
                </div>
            )}

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary-600 p-1.5 rounded-lg">
                                <Leaf className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold font-outfit text-primary-900">Ecological</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed">
                            Making sustainable living the new standard. Empowering people to protect the planet through conscious consumption.
                        </p>
                        <div className="flex gap-4">
                            {socials.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={label}
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm active:scale-90"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold font-outfit text-primary-900">Quick Links</h4>
                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={link.action}
                                        className="text-gray-500 hover:text-primary-600 transition-colors text-left cursor-pointer bg-transparent border-none font-inherit"
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold font-outfit text-primary-900">Support</h4>
                        <ul className="space-y-4">
                            {supportLinks.map((link) => (
                                <li key={link}>
                                    <button
                                        onClick={() => showComingSoon(link)}
                                        className="text-gray-500 hover:text-primary-600 transition-colors text-left cursor-pointer bg-transparent border-none font-inherit"
                                    >
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold font-outfit text-primary-900">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary-600 shrink-0 mt-1" />
                                <span className="text-gray-500">123 Eco Way, Sustainability Grove, Earth 56789</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary-600 shrink-0" />
                                <a href="tel:+15550004733" className="text-gray-500 hover:text-primary-600 transition-colors">+1 (555) 000-GREEN</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary-600 shrink-0" />
                                <a href="mailto:hello@greenify.eco" className="text-gray-500 hover:text-primary-600 transition-colors">hello@greenify.eco</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-primary-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Ecological Eco-Friendly Ltd. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <p className="text-xs text-gray-400 font-medium">Verified Sustainable Brand</p>
                        <p className="text-xs text-gray-400 font-medium">B-Corp Certified</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
