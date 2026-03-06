import React from 'react';
import { LayoutDashboard, Leaf, User, FileText, ShoppingBag, Users, Settings } from 'lucide-react';

export const getAqiInfo = (val) => {
    if (val <= 50) return { label: 'Good', color: '#10b981', bg: 'bg-green-50', text: 'text-green-700', desc: 'Air quality is satisfactory. Perfect for outdoor activities.' };
    if (val <= 100) return { label: 'Moderate', color: '#f59e0b', bg: 'bg-yellow-50', text: 'text-yellow-700', desc: 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.' };
    if (val <= 150) return { label: 'Unhealthy for Sensitive', color: '#f97316', bg: 'bg-orange-50', text: 'text-orange-700', desc: 'Sensitive groups may experience health effects. Consider reducing outdoor activities.' };
    if (val <= 200) return { label: 'Unhealthy', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-700', desc: 'Everyone may experience health effects. Reduce prolonged outdoor exertion.' };
    return { label: 'Hazardous', color: '#7c3aed', bg: 'bg-purple-50', text: 'text-purple-700', desc: 'Health alert. Everyone should avoid outdoor activity.' };
};

export const suggestions = [
    { title: 'Switch to LED Bulbs', desc: 'Replacing your 5 most used bulbs could save 120kg CO₂/year', impact: 'High', difficulty: 'Low', cost: 'Low', icon: '💡' },
    { title: 'Cycle Short Trips', desc: 'Biking instead of driving for <3km trips saves ~0.9kg CO₂ per ride', impact: 'Medium', difficulty: 'Medium', cost: 'None', icon: '🚲' },
    { title: 'Compost Food Waste', desc: 'Composting kitchen scraps can reduce your waste emissions by 50%', impact: 'High', difficulty: 'Low', cost: 'Low', icon: '♻️' },
];

export const getMenuItems = (activeTab) => [
    { name: 'Overview', icon: <LayoutDashboard size={20} /> },
    { name: 'Carbon', icon: <Leaf size={20} /> },
    { name: 'Profile', icon: <User size={20} /> },
    { name: 'Eco Actions', icon: <FileText size={20} /> },
    { name: 'Marketplace', icon: <ShoppingBag size={20} /> },
    { name: 'Community', icon: <Users size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
];

export const trendCategories = [
    { key: 'transport', label: 'Transport', color: '#636b8f' },
    { key: 'energy', label: 'Energy', color: '#d9b88c' },
    { key: 'waste', label: 'Goods', color: '#48a47e' }
];

export const defaultChecklist = [
    { id: 1, text: 'Meat Free Monday', done: false },
    { id: 2, text: 'Unplug Standby Devices', done: false },
    { id: 3, text: 'Take Public Transport', done: false },
    { id: 4, text: 'Use Reusable Bag', done: false },
    { id: 5, text: 'Reduce Shower Time', done: false },
];
