import React, { useState } from 'react';
import { ShoppingCart, Star, Heart, Check } from 'lucide-react';

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Toast notification component
const Toast = ({ message, onClose }) => (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-primary-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="bg-primary-500 p-1.5 rounded-full">
            <Check className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium">{message}</span>
    </div>
);

const Products = () => {
    const [wishlist, setWishlist] = useState({});
    const [toast, setToast] = useState(null);

    const toggleWishlist = (id) => {
        setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const addToCart = (name) => {
        setToast(`${name} added to cart! 🌿`);
        setTimeout(() => setToast(null), 2500);
    };

    const products = [
        {
            id: 1,
            name: 'Eco-Bamboo Water Bottle',
            price: '$35.00',
            rating: 4.9,
            reviews: 128,
            image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
            tag: 'Best Seller'
        },
        {
            id: 2,
            name: 'Organic Cotton Tote',
            price: '$18.00',
            rating: 4.8,
            reviews: 95,
            image: 'https://images.unsplash.com/photo-1591339102716-4bc218a0df6b?auto=format&fit=crop&q=80&w=800',
            tag: 'Eco-Fashion'
        },
        {
            id: 3,
            name: 'Bamboo Toothbrush Set',
            price: '$12.00',
            rating: 4.7,
            reviews: 210,
            image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=800',
            tag: 'New Arrival'
        },
        {
            id: 4,
            name: 'Handmade Organic Soap',
            price: '$9.00',
            rating: 4.9,
            reviews: 156,
            image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800',
            tag: 'Cruelty Free'
        }
    ];

    return (
        <section id="products" className="py-24 bg-primary-50">
            {toast && <Toast message={toast} />}

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-bold font-outfit text-primary-900 mb-4">Our Sustainable Best Sellers</h2>
                        <p className="text-gray-600">
                            Handpicked products that combine style, functionality, and sustainability.
                            Ethically sourced and plastic-free for a cleaner tomorrow.
                        </p>
                    </div>
                    <button
                        onClick={() => scrollTo('products')}
                        className="text-primary-600 font-bold hover:text-primary-700 transition-colors flex items-center gap-2 border-b-2 border-primary-600 pb-1 hover:border-primary-700 shrink-0"
                    >
                        View All Products ↓
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-[32px] overflow-hidden group hover:shadow-2xl hover:shadow-primary-100 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-sm">
                                    {product.tag}
                                </div>
                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className={`absolute top-4 right-4 p-2.5 backdrop-blur-sm rounded-full shadow-sm transition-all active:scale-90 ${wishlist[product.id] ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-400'}`}
                                    title={wishlist[product.id] ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    <Heart className={`w-4 h-4 transition-all ${wishlist[product.id] ? 'fill-red-500' : ''}`} />
                                </button>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold font-outfit text-primary-900 leading-tight">{product.name}</h3>
                                    <span className="text-lg font-bold text-primary-600 shrink-0 ml-2">{product.price}</span>
                                </div>

                                <div className="flex items-center gap-1 mb-6">
                                    <Star className="w-4 h-4 fill-accent-gold text-accent-gold" />
                                    <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                                    <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
                                </div>

                                <button
                                    onClick={() => addToCart(product.name)}
                                    className="w-full mt-auto bg-gray-50 group-hover:bg-primary-600 group-hover:text-white text-primary-900 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
