import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag, TrendingUp, Search, ChevronRight, Home } from 'lucide-react';
import { blogPosts, categories } from '../data/blogPosts';

const BlogPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const filteredPosts = blogPosts.filter((post) => {
        const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
        const matchesSearch =
            searchQuery === '' ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const featuredPost = blogPosts.find((p) => p.featured);
    const regularPosts = filteredPosts.filter((p) => !(activeCategory === 'All' && p.featured));

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Header */}
            <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-6 relative z-10">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-primary-200 text-sm mb-8 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" />
                            Home
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-white font-medium">Blog</span>
                    </nav>

                    <div className="max-w-3xl animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-primary-100 px-4 py-1.5 rounded-full text-sm font-bold mb-6 backdrop-blur-sm">
                            <TrendingUp className="w-4 h-4" />
                            Sustainability Insights
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-bold font-outfit text-white mb-6 leading-tight">
                            Our <span className="text-primary-300">Blog</span>
                        </h1>
                        <p className="text-primary-100 text-lg lg:text-xl max-w-2xl leading-relaxed">
                            Expert insights, practical tips, and inspiring stories to help you live more sustainably every day.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-10 max-w-xl animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles by title, topic, or tag..."
                                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-primary-300 pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white/15 transition-all text-base"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-100/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-100/30 rounded-full blur-3xl -z-10"></div>

                <div className="container mx-auto px-6">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-14 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${activeCategory === cat
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 scale-105'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-700 hover:shadow-md'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Featured Post (only in 'All' view with no search) */}
                    {activeCategory === 'All' && searchQuery === '' && featuredPost && (
                        <Link to={`/blog/${featuredPost.id}`} className="block mb-14 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                            <div className="group relative bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="relative h-64 lg:h-full min-h-[360px] overflow-hidden">
                                        <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                        <span className="absolute top-6 left-6 bg-accent-gold text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                            ✨ Featured
                                        </span>
                                    </div>
                                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full border border-primary-100">{featuredPost.category}</span>
                                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {featuredPost.date}
                                            </div>
                                        </div>
                                        <h2 className="text-2xl lg:text-3xl font-bold font-outfit text-primary-900 mb-4 group-hover:text-primary-700 transition-colors leading-tight">{featuredPost.title}</h2>
                                        <p className="text-gray-500 leading-relaxed mb-6 text-base lg:text-lg">{featuredPost.excerpt}</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {featuredPost.tags.map((tag) => (
                                                <span key={tag} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                                    <Tag className="w-3 h-3" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-3">
                                                <img src={featuredPost.authorAvatar} alt={featuredPost.author} className="w-10 h-10 rounded-full border-2 border-primary-200 object-cover" />
                                                <div>
                                                    <p className="text-sm font-bold text-primary-900">{featuredPost.author}</p>
                                                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                        <Clock className="w-3 h-3" />
                                                        {featuredPost.readTime}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm group-hover:gap-3 transition-all">
                                                Read Article
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Results Count */}
                    {searchQuery && (
                        <p className="text-gray-500 text-sm mb-8 text-center">
                            {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                    )}

                    {/* Blog Grid */}
                    {regularPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {regularPosts.map((post, index) => (
                                <Link to={`/blog/${post.id}`} key={post.id} className="block">
                                    <article
                                        className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-500 cursor-pointer flex flex-col h-full animate-fade-in-up opacity-0"
                                        style={{ animationDelay: `${0.15 + index * 0.08}s`, animationFillMode: 'forwards' }}
                                    >
                                        <div className="relative h-52 overflow-hidden">
                                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                            <span className={`absolute top-4 left-4 bg-gradient-to-r ${post.gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                                                {post.category}
                                            </span>
                                        </div>
                                        <div className="p-7 flex flex-col flex-grow">
                                            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {post.date}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {post.readTime}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold font-outfit text-primary-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">{post.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3 flex-grow">{post.excerpt}</p>
                                            <div className="flex flex-wrap gap-1.5 mb-5">
                                                {post.tags.map((tag) => (
                                                    <span key={tag} className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">{tag}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                                                <div className="flex items-center gap-2.5">
                                                    <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full border-2 border-primary-100 object-cover" />
                                                    <span className="text-xs font-semibold text-gray-700">{post.author}</span>
                                                </div>
                                                <span className="inline-flex items-center gap-1.5 text-primary-600 text-xs font-bold group-hover:gap-2.5 transition-all">
                                                    Read
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold font-outfit text-primary-900 mb-2">No articles found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                className="mt-6 px-6 py-2.5 bg-primary-50 text-primary-700 rounded-full font-semibold hover:bg-primary-100 transition-colors cursor-pointer"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
