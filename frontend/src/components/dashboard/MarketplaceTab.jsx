import React from 'react';
import { ShoppingBag, Leaf, Award, FileText } from 'lucide-react';
import { useDashboard } from './DashboardContext';

const MarketplaceTab = () => {
    const {
        purchaseMessage, profile, marketplace, buyQty, setBuyQty, handlePurchase,
        purchaseLoading, purchaseHistory
    } = useDashboard();

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold font-outfit text-primary-900">Carbon Credit Marketplace</h1>
                <p className="text-gray-500">Browse and purchase carbon credits from verified projects.</p>
            </div>

            {purchaseMessage && (
                <div className={`p-3 rounded-xl text-sm font-medium ${purchaseMessage.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {purchaseMessage}
                </div>
            )}

            {/* Your Balance */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-[24px] p-6 text-white flex items-center justify-between">
                <div>
                    <p className="text-primary-200 text-xs font-bold uppercase tracking-wider mb-1">Your Carbon Credits</p>
                    <p className="text-3xl font-bold font-outfit">{profile?.carbon_credits?.toFixed(1) || 0}</p>
                </div>
                <Award className="w-10 h-10 text-primary-200" />
            </div>

            {/* Listings */}
            {marketplace.length === 0 ? (
                <div className="bg-white rounded-[24px] border border-gray-100 p-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-700 mb-2">No listings available</h3>
                    <p className="text-gray-400">Check back later for new carbon credit listings.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketplace.map((project) => {
                        const qty = buyQty[project.id] || 1;
                        const total = qty * project.price_per_credit;
                        return (
                            <div key={project.id} className="bg-white rounded-[24px] border border-gray-100 p-6 hover:shadow-lg transition-shadow flex flex-col">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                                    <Leaf className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{project.organization_name}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{project.description}</p>
                                <div className="flex items-center justify-between mb-3 text-sm">
                                    <span className="text-gray-400">Available: <strong className="text-gray-700">{project.credits_available}</strong></span>
                                    <span className="text-primary-600 font-bold">₹{project.price_per_credit}/credit</span>
                                </div>

                                {/* Quantity selector */}
                                <div className="flex items-center gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setBuyQty({ ...buyQty, [project.id]: Math.max(1, qty - 1) })}
                                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center"
                                    >−</button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={project.credits_available}
                                        value={qty}
                                        onChange={(e) => setBuyQty({ ...buyQty, [project.id]: Math.max(1, Math.min(project.credits_available, parseInt(e.target.value) || 1)) })}
                                        className="w-14 text-center py-1 border border-gray-200 rounded-lg text-sm font-bold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setBuyQty({ ...buyQty, [project.id]: Math.min(project.credits_available, qty + 1) })}
                                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center"
                                    >+</button>
                                    <span className="text-xs text-gray-400 ml-auto">Total: <strong className="text-gray-700">₹{total.toFixed(2)}</strong></span>
                                </div>

                                <button
                                    onClick={() => handlePurchase(project.id, qty)}
                                    disabled={purchaseLoading === project.id}
                                    className="w-full bg-primary-600 text-white py-2.5 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
                                >
                                    {purchaseLoading === project.id ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>Buy {qty} Credit{qty > 1 ? 's' : ''} — ₹{total.toFixed(2)}</>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Transaction History */}
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary-600" />
                        Transaction History
                    </h3>
                </div>
                {purchaseHistory.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No transactions yet.</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {purchaseHistory.map((tx) => (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{tx.organization_name}</p>
                                        <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary-600 text-sm">+{tx.credits_bought} credits</p>
                                    <p className="text-xs text-gray-400">₹{tx.total_price?.toFixed(2)} @ ₹{tx.price_per_credit}/credit</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplaceTab;
