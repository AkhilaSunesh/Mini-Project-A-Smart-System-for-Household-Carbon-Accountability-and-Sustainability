import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag, TrendingUp } from 'lucide-react';
import { blogPosts, categories } from '../data/blogPosts';

const Blog = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    // Show only first 5 on homepage
    const homePosts = blogPosts.slice(0, 5);

    const filteredPosts =
        activeCategory === 'All'
            ? homePosts
            : homePosts.filter((post) => post.category === activeCategory);

    const featuredPost = homePosts.find((p) => p.featured);
    const regularPosts = filteredPosts.filter((p) => !p.featured);

    return (
        <section id="blog" className="py-24 bg-gradient-to-b from-white via-primary-50/30 to-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-100/40 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div
                    className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up opacity-0"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <span className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                        <TrendingUp className="w-4 h-4" />
                        Sustainability Insights
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-bold font-outfit text-primary-900 mb-4">
                        Latest from Our <span className="text-gradient">Blog</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Expert insights, practical tips, and inspiring stories to help you live more sustainably every day.
                    </p>
                </div>

                {/* Category Filter Pills */}
                <div
                    className="flex flex-wrap justify-center gap-3 mb-14 animate-fade-in-up opacity-0"
                    style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${activeCategory === cat
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 scale-105'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-700 hover:shadow-md'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured Post */}
                {activeCategory === 'All' && featuredPost && (
                    <Link
                        to={`/blog/${featuredPost.id}`}
                        className="block mb-14 animate-fade-in-up opacity-0"
                        style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
                    >
                        <div className="group relative bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Image Side */}
                                <div className="relative h-64 lg:h-full min-h-[320px] overflow-hidden">
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                    <span className="absolute top-6 left-6 bg-accent-gold text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                        ✨ Featured
                                    </span>
                                </div>

                                {/* Content Side */}
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full border border-primary-100">
                                            {featuredPost.category}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {featuredPost.date}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl lg:text-3xl font-bold font-outfit text-primary-900 mb-4 group-hover:text-primary-700 transition-colors leading-tight">
                                        {featuredPost.title}
                                    </h3>

                                    <p className="text-gray-500 leading-relaxed mb-6 text-base lg:text-lg">
                                        {featuredPost.excerpt}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {featuredPost.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full"
                                            >
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={featuredPost.authorAvatar}
                                                alt={featuredPost.author}
                                                className="w-10 h-10 rounded-full border-2 border-primary-200 object-cover"
                                            />
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

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(activeCategory === 'All' ? regularPosts : filteredPosts).map((post, index) => (
                        <Link to={`/blog/${post.id}`} key={post.id} className="block">
                            <article
                                className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-500 cursor-pointer flex flex-col h-full animate-fade-in-up opacity-0"
                                style={{
                                    animationDelay: `${0.3 + index * 0.1}s`,
                                    animationFillMode: 'forwards',
                                }}
                            >
                                {/* Card Image */}
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    <span
                                        className={`absolute top-4 left-4 bg-gradient-to-r ${post.gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
                                    >
                                        {post.category}
                                    </span>
                                </div>

                                {/* Card Content */}
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

                                    <h3 className="text-lg font-bold font-outfit text-primary-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3 flex-grow">
                                        {post.excerpt}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Author & Read More */}
                                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                src={post.authorAvatar}
                                                alt={post.author}
                                                className="w-8 h-8 rounded-full border-2 border-primary-100 object-cover"
                                            />
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

                {/* View All Button */}
                <div
                    className="text-center mt-14 animate-fade-in-up opacity-0"
                    style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
                >
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-3 bg-primary-900 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-primary-800 hover:shadow-xl hover:shadow-primary-200 transition-all duration-300 active:scale-95 group"
                    >
                        View All Articles
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Blog;
