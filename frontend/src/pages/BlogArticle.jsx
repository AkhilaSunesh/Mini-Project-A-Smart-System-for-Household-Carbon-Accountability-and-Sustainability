import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, User, ChevronRight, Home, Share2, Bookmark, Heart } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const BlogArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = blogPosts.find((p) => p.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-20">
                <div className="text-8xl mb-6">📄</div>
                <h1 className="text-3xl font-bold font-outfit text-primary-900 mb-3">Article Not Found</h1>
                <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been removed.</p>
                <Link to="/blog" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-700 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>
            </div>
        );
    }

    // Find related posts (same category, exclude current)
    const relatedPosts = blogPosts
        .filter((p) => p.category === post.category && p.id !== post.id)
        .slice(0, 3);

    // Find prev/next posts
    const currentIndex = blogPosts.findIndex((p) => p.id === post.id);
    const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image Header */}
            <section className="relative h-[50vh] min-h-[400px] lg:h-[60vh] overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"></div>

                {/* Breadcrumb on image */}
                <div className="absolute top-0 left-0 right-0 pt-28 px-6">
                    <div className="container mx-auto">
                        <nav className="flex items-center gap-2 text-white/70 text-sm animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
                            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                                <Home className="w-3.5 h-3.5" />
                                Home
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="text-white font-medium truncate max-w-[200px]">{post.title}</span>
                        </nav>
                    </div>
                </div>

                {/* Title overlay at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 pb-12 px-6">
                    <div className="container mx-auto max-w-4xl animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`bg-gradient-to-r ${post.gradient} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg`}>
                                {post.category}
                            </span>
                            <div className="flex items-center gap-1 text-white/70 text-xs">
                                <Calendar className="w-3.5 h-3.5" />
                                {post.date}
                            </div>
                            <div className="flex items-center gap-1 text-white/70 text-xs">
                                <Clock className="w-3.5 h-3.5" />
                                {post.readTime}
                            </div>
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-bold font-outfit text-white leading-tight mb-4">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Author Bar */}
                        <div
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 mb-10 border-b border-gray-100 animate-fade-in-up opacity-0"
                            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={post.authorAvatar}
                                    alt={post.author}
                                    className="w-14 h-14 rounded-full border-3 border-primary-200 object-cover shadow-md"
                                />
                                <div>
                                    <p className="font-bold text-primary-900 text-lg font-outfit">{post.author}</p>
                                    <p className="text-gray-500 text-sm">{post.authorBio}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 rounded-xl bg-gray-50 hover:bg-primary-50 text-gray-500 hover:text-primary-600 transition-all cursor-pointer" title="Share">
                                    <Share2 className="w-4.5 h-4.5" />
                                </button>
                                <button className="p-2.5 rounded-xl bg-gray-50 hover:bg-primary-50 text-gray-500 hover:text-primary-600 transition-all cursor-pointer" title="Bookmark">
                                    <Bookmark className="w-4.5 h-4.5" />
                                </button>
                                <button className="p-2.5 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all cursor-pointer" title="Like">
                                    <Heart className="w-4.5 h-4.5" />
                                </button>
                            </div>
                        </div>

                        {/* Article Body */}
                        <article
                            className="prose prose-lg max-w-none
                                prose-headings:font-outfit prose-headings:text-primary-900 prose-headings:font-bold
                                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-5
                                prose-strong:text-primary-900
                                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                                animate-fade-in-up opacity-0"
                            style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Tags */}
                        <div
                            className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-100 animate-fade-in-up opacity-0"
                            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                        >
                            <span className="text-sm font-semibold text-gray-700 mr-2 flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                Tags:
                            </span>
                            {post.tags.map((tag) => (
                                <span key={tag} className="text-sm text-primary-700 bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100 font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Prev / Next Navigation */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 animate-fade-in-up opacity-0" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
                            {prevPost ? (
                                <Link
                                    to={`/blog/${prevPost.id}`}
                                    className="group flex items-center gap-4 p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all"
                                >
                                    <ArrowLeft className="w-5 h-5 text-primary-600 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-400 font-medium mb-1">Previous</p>
                                        <p className="text-sm font-bold text-primary-900 group-hover:text-primary-600 transition-colors truncate">{prevPost.title}</p>
                                    </div>
                                </Link>
                            ) : (
                                <div></div>
                            )}
                            {nextPost ? (
                                <Link
                                    to={`/blog/${nextPost.id}`}
                                    className="group flex items-center gap-4 p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all text-right justify-end"
                                >
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-400 font-medium mb-1">Next</p>
                                        <p className="text-sm font-bold text-primary-900 group-hover:text-primary-600 transition-colors truncate">{nextPost.title}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                </Link>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
                <section className="py-16 bg-gradient-to-b from-primary-50/30 to-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-outfit text-primary-900 mb-2">Related Articles</h2>
                            <p className="text-gray-500">More from the <span className="font-semibold text-primary-600">{post.category}</span> category</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {relatedPosts.map((rPost, index) => (
                                <Link to={`/blog/${rPost.id}`} key={rPost.id} className="block">
                                    <article
                                        className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-500 cursor-pointer flex flex-col h-full animate-fade-in-up opacity-0"
                                        style={{ animationDelay: `${0.1 + index * 0.1}s`, animationFillMode: 'forwards' }}
                                    >
                                        <div className="relative h-44 overflow-hidden">
                                            <img src={rPost.image} alt={rPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                            <span className={`absolute top-4 left-4 bg-gradient-to-r ${rPost.gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                                                {rPost.category}
                                            </span>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {rPost.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {rPost.readTime}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold font-outfit text-primary-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">{rPost.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-grow">{rPost.excerpt}</p>
                                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <img src={rPost.authorAvatar} alt={rPost.author} className="w-7 h-7 rounded-full border border-primary-100 object-cover" />
                                                    <span className="text-xs font-semibold text-gray-600">{rPost.author}</span>
                                                </div>
                                                <span className="inline-flex items-center gap-1 text-primary-600 text-xs font-bold group-hover:gap-2 transition-all">
                                                    Read <ArrowRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link to="/blog" className="inline-flex items-center gap-3 bg-primary-900 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-primary-800 hover:shadow-xl hover:shadow-primary-200 transition-all duration-300 active:scale-95 group">
                                View All Articles
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogArticle;
