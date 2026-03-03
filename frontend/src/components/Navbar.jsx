import React, { useState, useEffect } from 'react';
import { Menu, X, User, LayoutDashboard } from 'lucide-react';
import LogoIcon from './LogoIcon';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('access_token');
    const username = localStorage.getItem('username');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', scrollId: null, path: '/' },
        { name: 'About', scrollId: 'about' },
        { name: 'Impact', scrollId: 'impact' },
        { name: 'Blog', scrollId: null, path: '/blog' },
        { name: 'Contact', scrollId: 'contact' },
    ];

    const isBlogPage = location.pathname.startsWith('/blog');
    const isNavbarDark = isBlogPage && !isScrolled && !isMobileMenuOpen;

    const navTextColor = isNavbarDark ? 'text-white/90' : 'text-primary-900/80';
    const logoTextColor = isNavbarDark ? 'text-white' : 'text-primary-900';
    const iconColor = isNavbarDark ? 'text-white' : 'text-primary-900';

    const handleNavClick = (link) => {
        setIsMobileMenuOpen(false);
        if (link.path) return;

        if (location.pathname !== '/') {
            // If not on home page, navigate to home with hash
            navigate(`/${link.scrollId ? '#' + link.scrollId : ''}`);
        } else if (link.scrollId) {
            scrollTo(link.scrollId);
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'glass py-3 shadow-md' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                        <LogoIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-2xl font-bold font-outfit transition-colors duration-300 ${logoTextColor}`}>Ecological</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) =>
                        link.path ? (
                            <Link key={link.name} to={link.path} className={`${navTextColor} hover:text-primary-600 font-medium transition-colors`}>
                                {link.name}
                            </Link>
                        ) : (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link)}
                                className={`${navTextColor} hover:text-primary-600 font-medium transition-colors cursor-pointer bg-transparent border-none`}
                            >
                                {link.name}
                            </button>
                        )
                    )}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <span className={`text-sm font-medium ${isNavbarDark ? 'text-white/80' : 'text-primary-700'}`}>Hi, {username}!</span>
                            <Link to="/dashboard" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-primary-200 flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`flex items-center gap-2 font-bold px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isNavbarDark ? 'text-white' : 'text-primary-900 hover:bg-primary-50'}`}>
                                <User className="w-5 h-5" />
                                Login
                            </Link>
                            <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-primary-200">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    {isLoggedIn ? (
                        <Link to="/dashboard" className={`${iconColor} p-2`}>
                            <LayoutDashboard className="w-5 h-5" />
                        </Link>
                    ) : (
                        <Link to="/login" className={`${iconColor} p-2`}>
                            <User className="w-5 h-5" />
                        </Link>
                    )}
                    <button className={`${iconColor} p-2`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 flex flex-col p-6 gap-4 animate-fade-in-up">
                    {navLinks.map((link) =>
                        link.path ? (
                            <Link key={link.name} to={link.path} className="text-xl font-bold text-primary-900 py-3 border-b border-gray-100 hover:text-primary-600">
                                {link.name}
                            </Link>
                        ) : (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link)}
                                className="text-left text-xl font-bold text-primary-900 py-3 border-b border-gray-100 hover:text-primary-600 bg-transparent border-none"
                            >
                                {link.name}
                            </button>
                        )
                    )}
                    <div className="mt-4 flex flex-col gap-4">
                        {isLoggedIn ? (
                            <Link to="/dashboard" className="w-full text-center py-4 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-200">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="w-full text-center py-4 border border-gray-200 rounded-xl font-bold text-primary-900 hover:bg-gray-50">
                                    Log In
                                </Link>
                                <Link to="/login" className="w-full text-center py-4 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-200">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
