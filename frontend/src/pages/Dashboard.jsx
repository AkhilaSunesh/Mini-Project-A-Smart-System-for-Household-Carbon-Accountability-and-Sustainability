import React, { useState } from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Leaf,
    TrendingUp,
    TrendingDown,
    Award,
    User,
    Mail,
    MapPin,
    Calendar,
    Camera,
    Bell,
    Wind,
    Zap,
    Car,
    Utensils,
    Home,
    ChevronRight,
    BarChart2,
    Globe,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    Check,
    Clock,
    Star,
    MessageSquare,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── Tiny reusable bar chart (CSS + SVG, no library needed) ─── */
const WeeklyBarChart = ({ data, label, color }) => {
    const max = Math.max(...data.map(d => d.value));
    return (
        <div>
            <div className="flex items-end gap-2 h-28">
                {data.map((d, i) => {
                    const pct = max > 0 ? (d.value / max) * 100 : 0;
                    return (
                        <div key={i} className="flex flex-col items-center flex-1 gap-1">
                            <span className="text-[10px] text-gray-400 font-medium">{d.value}</span>
                            <div className="w-full rounded-t-lg transition-all duration-700 relative group" style={{ height: `${Math.max(pct, 3)}%`, backgroundColor: color }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                                    {d.value} {label}
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400">{d.day}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ─── Donut Ring Chart ─── */
const DonutChart = ({ value, total, color, label }) => {
    const pct = total > 0 ? (value / total) * 100 : 0;
    const r = 42;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <div className="flex flex-col items-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle
                    cx="50" cy="50" r={r} fill="none"
                    stroke={color} strokeWidth="10"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                />
                <text x="50" y="54" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#111">{Math.round(pct)}%</text>
            </svg>
            <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
        </div>
    );
};

/* ─── Carbon Category bar ─── */
const CategoryBar = ({ icon: Icon, label, value, max, color }) => {
    const pct = (value / max) * 100;
    return (
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shrink-0`} style={{ background: color + '22' }}>
                <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm font-bold text-gray-900">{value} kg</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                </div>
            </div>
        </div>
    );
};

/* ─── TABS ─── */
const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');

    const handleLogout = () => navigate('/');

    const menuItems = [
        { name: 'Overview', icon: <LayoutDashboard size={20} /> },
        { name: 'Carbon', icon: <Leaf size={20} /> },
        { name: 'Profile', icon: <User size={20} /> },
        { name: 'My Orders', icon: <ShoppingBag size={20} /> },
        { name: 'Community', icon: <Users size={20} /> },
        { name: 'Settings', icon: <Settings size={20} /> },
    ];

    const summaryStats = [
        { title: 'Carbon Saved', value: '124 kg', change: '+12%', trend: 'up', icon: <Leaf className="text-green-600" />, bg: 'bg-green-50', changeColor: 'text-green-600' },
        { title: 'Trees Planted', value: '15', change: '+3 new', trend: 'up', icon: <TrendingUp className="text-blue-600" />, bg: 'bg-blue-50', changeColor: 'text-blue-600' },
        { title: 'Eco Points', value: '2,450', change: 'Silver Tier', trend: 'stable', icon: <Award className="text-amber-600" />, bg: 'bg-amber-50', changeColor: 'text-amber-600' },
    ];

    const weeklyEmissions = [
        { day: 'Mon', value: 8.2 },
        { day: 'Tue', value: 6.5 },
        { day: 'Wed', value: 9.8 },
        { day: 'Thu', value: 5.1 },
        { day: 'Fri', value: 7.3 },
        { day: 'Sat', value: 3.9 },
        { day: 'Sun', value: 4.2 },
    ];

    const weeklyProduction = [
        { day: 'Mon', value: 3.1 },
        { day: 'Tue', value: 4.2 },
        { day: 'Wed', value: 3.8 },
        { day: 'Thu', value: 5.5 },
        { day: 'Fri', value: 4.1 },
        { day: 'Sat', value: 6.2 },
        { day: 'Sun', value: 5.8 },
    ];

    const carbonCategories = [
        { icon: Car, label: 'Transport', value: 32, color: '#6366f1' },
        { icon: Home, label: 'Home Energy', value: 21, color: '#f59e0b' },
        { icon: Utensils, label: 'Food & Diet', value: 18, color: '#10b981' },
        { icon: ShoppingBag, label: 'Shopping', value: 14, color: '#ec4899' },
        { icon: Zap, label: 'Electronics', value: 9, color: '#3b82f6' },
    ];

    const totalCarbon = carbonCategories.reduce((s, c) => s + c.value, 0);

    const orders = [
        { id: '#GR-2401', product: 'Bamboo Utensil Set', date: 'Feb 20, 2026', status: 'Delivered', amount: '$24.00', ecoPoints: 120 },
        { id: '#GR-2356', product: 'Organic Cotton Tote', date: 'Feb 15, 2026', status: 'In Transit', amount: '$18.00', ecoPoints: 90 },
        { id: '#GR-2290', product: 'Eco Glass Bottle', date: 'Feb 10, 2026', status: 'Delivered', amount: '$32.00', ecoPoints: 160 },
        { id: '#GR-2201', product: 'Recycled Notebook', date: 'Feb 5, 2026', status: 'Delivered', amount: '$14.00', ecoPoints: 70 },
    ];

    const communityPosts = [
        { name: 'Sarah M.', avatar: 'https://i.pravatar.cc/150?u=s1', text: 'Just finished a zero-waste cooking challenge! 🌿 It was easier than I thought.', likes: 48, time: '2h ago', badge: 'Eco Chef' },
        { name: 'James K.', avatar: 'https://i.pravatar.cc/150?u=j2', text: 'My solar panels produced more energy than I used today! Net positive life is real.', likes: 92, time: '4h ago', badge: 'Solar Hero' },
        { name: 'Priya S.', avatar: 'https://i.pravatar.cc/150?u=p3', text: 'Switched to bamboo everything this month. My waste reduced by 60%! Feeling amazing.', likes: 73, time: '6h ago', badge: 'Tree Hugger' },
    ];

    /* ── OVERVIEW ── */
    const Overview = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-primary-900">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, Alex! Here's your eco-impact overview.</p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 flex items-center gap-2"
                >
                    <ShoppingBag size={18} /> New Order
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {summaryStats.map((stat) => (
                    <div key={stat.title} className="bg-white p-6 rounded-[24px] border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>{stat.icon}</div>
                            <span className={`${stat.bg} ${stat.changeColor} text-xs font-bold px-2 py-1 rounded-full flex items-center gap-0.5`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : null}
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-500 font-medium mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold font-outfit text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Weekly Carbon Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-[24px] border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold font-outfit text-primary-900">Weekly Emissions</h3>
                            <p className="text-sm text-gray-400">kg CO₂ emitted per day</p>
                        </div>
                        <div className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold">
                            <TrendingDown className="w-3.5 h-3.5" /> 8% from last week
                        </div>
                    </div>
                    <WeeklyBarChart data={weeklyEmissions} label="kg CO₂" color="#f87171" />
                    <p className="text-xs text-gray-400 mt-2 text-center">Total this week: <strong className="text-gray-700">45.0 kg</strong></p>
                </div>

                <div className="bg-white rounded-[24px] border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold font-outfit text-primary-900">Green Production</h3>
                            <p className="text-sm text-gray-400">kg CO₂ offset per day</p>
                        </div>
                        <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                            <TrendingUp className="w-3.5 h-3.5" /> 15% from last week
                        </div>
                    </div>
                    <WeeklyBarChart data={weeklyProduction} label="kg offset" color="#4ade80" />
                    <p className="text-xs text-gray-400 mt-2 text-center">Total this week: <strong className="text-gray-700">32.7 kg</strong></p>
                </div>
            </div>

            {/* Activity + Goal */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold font-outfit text-primary-900">Recent Activity</h3>
                        <button onClick={() => setActiveTab('My Orders')} className="text-primary-600 text-sm font-bold hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                            <div key={order.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="w-11 h-11 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 shrink-0">
                                    <ShoppingBag size={18} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm">{order.product}</h4>
                                    <p className="text-xs text-gray-400">{order.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-primary-600">{order.amount}</span>
                                    <p className="text-[10px] text-green-500 font-medium">+{order.ecoPoints} pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-primary-900 rounded-[32px] p-7 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-primary-200">
                            <Award size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Weekly Goal</span>
                        </div>
                        <h3 className="text-xl font-bold font-outfit mb-3">Plant 5 Trees</h3>
                        <p className="text-primary-200 text-sm mb-5">You're 60% there! Purchase one more sustainable kit.</p>
                    </div>
                    <div>
                        <div className="w-full bg-white/20 h-2.5 rounded-full mb-2">
                            <div className="w-[60%] h-full bg-yellow-400 rounded-full"></div>
                        </div>
                        <div className="flex justify-between text-xs text-primary-300">
                            <span>3 planted</span><span>5 goal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    /* ── CARBON TAB ── */
    const CarbonTracker = () => (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold font-outfit text-primary-900">Carbon Tracker</h1>
                <p className="text-gray-500">Monitor your weekly carbon emissions and green production.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'This Week - Emitted', value: '45.0 kg', sub: 'CO₂', color: 'text-red-500', bg: 'bg-red-50', icon: Wind },
                    { label: 'This Week - Offset', value: '32.7 kg', sub: 'CO₂', color: 'text-green-600', bg: 'bg-green-50', icon: Leaf },
                    { label: 'Net Balance', value: '-12.3 kg', sub: 'Net CO₂', color: 'text-blue-600', bg: 'bg-blue-50', icon: BarChart2 },
                    { label: 'Carbon Score', value: '78/100', sub: 'Excellent', color: 'text-amber-600', bg: 'bg-amber-50', icon: Award },
                ].map((card, i) => (
                    <div key={i} className={`${card.bg} rounded-[20px] p-5`}>
                        <card.icon className={`w-6 h-6 ${card.color} mb-3`} />
                        <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                        <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Weekly Charts - full width */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6">
                <h3 className="text-lg font-bold font-outfit text-primary-900 mb-1">Emission vs. Offset Comparison</h3>
                <p className="text-sm text-gray-400 mb-4">This week's daily carbon footprint (kg CO₂)</p>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                            Carbon Emitted
                        </p>
                        <WeeklyBarChart data={weeklyEmissions} label="kg CO₂" color="#f87171" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-green-500 mb-3 flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
                            Carbon Offset
                        </p>
                        <WeeklyBarChart data={weeklyProduction} label="kg offset" color="#4ade80" />
                    </div>
                </div>
            </div>

            {/* By Category + Donut */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-[24px] border border-gray-100 p-6">
                    <h3 className="text-lg font-bold font-outfit text-primary-900 mb-5">Emissions by Category</h3>
                    <div className="space-y-5">
                        {carbonCategories.map((cat, i) => (
                            <CategoryBar key={i} {...cat} max={totalCarbon} />
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex flex-col items-center">
                    <h3 className="text-lg font-bold font-outfit text-primary-900 mb-4">Breakdown</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {carbonCategories.map((cat, i) => (
                            <DonutChart key={i} value={cat.value} total={totalCarbon} color={cat.color} label={cat.label} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Global vs User */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-[24px] p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-primary-200" />
                    <h3 className="text-lg font-bold font-outfit">Your Impact vs. Global Average</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { label: 'Your Weekly Footprint', value: '45 kg', bar: 45, max: 100, color: '#4ade80' },
                        { label: 'Global Average', value: '85 kg', bar: 85, max: 100, color: '#f87171' },
                        { label: 'Ecological Members Avg.', value: '38 kg', bar: 38, max: 100, color: '#60a5fa' },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between mb-2">
                                <span className="text-primary-200 text-sm">{item.label}</span>
                                <span className="font-bold text-white">{item.value}</span>
                            </div>
                            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.bar}%`, backgroundColor: item.color }} />
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-primary-200 text-sm">🎉 You're emitting <strong className="text-white">47% less</strong> than the global average. Keep it up!</p>
            </div>
        </div>
    );

    /* ── PROFILE ── */
    const Profile = () => (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-primary-900">My Profile</h1>
                    <p className="text-gray-500">Manage your personal information and impact settings.</p>
                </div>
                <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Settings size={18} /> Edit Profile
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-5">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="w-full h-28 absolute top-0 left-0 bg-gradient-to-br from-primary-400 to-primary-600"></div>
                        <div className="relative mt-10 mb-4 group cursor-pointer">
                            <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden relative">
                                <img src="https://i.pravatar.cc/300?u=user-me" alt="Profile" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" /></div>
                            </div>
                            <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md text-primary-600"><Award size={14} /></div>
                        </div>
                        <h2 className="text-xl font-bold text-primary-900 font-outfit">Alex Green</h2>
                        <p className="text-primary-600 font-medium text-sm mb-1">Eco Warrior • Level 5</p>
                        <p className="text-gray-400 text-xs mb-5">San Francisco, CA</p>
                        <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                            <div><p className="text-xl font-bold text-gray-900">124</p><p className="text-[10px] text-gray-400 uppercase tracking-wide">Actions</p></div>
                            <div className="border-l border-gray-100"><p className="text-xl font-bold text-gray-900">1.2k</p><p className="text-[10px] text-gray-400 uppercase tracking-wide">Following</p></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[24px] p-5 border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm"><Award className="text-amber-500" size={16} />Badges</h3>
                        <div className="flex gap-2 flex-wrap">
                            {['Early Adopter', 'Tree Hugger', 'Plastic Free', 'Solar Champion'].map(b => (
                                <span key={b} className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">{b}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-primary-900 mb-6">Personal Information</h3>
                        <div className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                {[
                                    { label: 'Full Name', icon: User, value: 'Alex Green' },
                                    { label: 'Email Address', icon: Mail, value: 'alex@greenify.eco' },
                                    { label: 'Location', icon: MapPin, value: 'San Francisco, CA' },
                                    { label: 'Join Date', icon: Calendar, value: 'March 15, 2024' },
                                ].map(({ label, icon: Icon, value }) => (
                                    <div key={label}>
                                        <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wide">{label}</label>
                                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl text-gray-900 text-sm">
                                            <Icon size={16} className="text-gray-400" />{value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wide">Bio</label>
                                <div className="p-4 bg-gray-50 rounded-xl text-gray-900 text-sm leading-relaxed">
                                    Passionate about sustainability and reducing plastic waste. I love hiking, gardening, and helping my local community adopt greener habits. 🌍
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-primary-50 rounded-[24px] p-6 border border-primary-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-primary-900 mb-1">Share your profile</h3>
                            <p className="text-primary-700 text-sm">Let others see your impact and badges.</p>
                        </div>
                        <button className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary-700 transition-colors">Copy Link</button>
                    </div>
                </div>
            </div>
        </div>
    );

    /* ── ORDERS ── */
    const MyOrders = () => (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold font-outfit text-primary-900">My Orders</h1>
                <p className="text-gray-500">Track your eco-friendly purchases and their impact.</p>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Order History</h3>
                    <button onClick={() => navigate('/')} className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary-700 transition-colors flex items-center gap-2">
                        <ShoppingBag size={14} /> Shop Now
                    </button>
                </div>
                <div className="divide-y divide-gray-50">
                    {orders.map((order) => (
                        <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition-colors">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 shrink-0">
                                <Package size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-900">{order.product}</h4>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {order.status === 'Delivered' ? <Check className="inline w-3 h-3 mr-0.5" /> : <Clock className="inline w-3 h-3 mr-0.5" />}
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{order.id} · {order.date}</p>
                            </div>
                            <div className="flex items-center gap-6 text-right">
                                <div>
                                    <p className="font-bold text-gray-900">{order.amount}</p>
                                    <p className="text-xs text-green-500 font-medium">+{order.ecoPoints} eco pts</p>
                                </div>
                                <button className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center gap-1">
                                    Details <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    /* ── COMMUNITY ── */
    const Community = () => (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold font-outfit text-primary-900">Community Hub</h1>
                <p className="text-gray-500">Connect with 250k+ eco-warriors around the world.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {[{ v: '250k+', l: 'Members' }, { v: '15k', l: 'Trees Planted' }, { v: '820 ton', l: 'CO₂ Saved' }].map((s, i) => (
                    <div key={i} className="bg-primary-50 rounded-[20px] p-5 text-center">
                        <p className="text-3xl font-bold text-primary-700 font-outfit">{s.v}</p>
                        <p className="text-sm text-primary-500 font-medium">{s.l}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                {communityPosts.map((post, i) => (
                    <div key={i} className="bg-white rounded-[20px] border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                            <img src={post.avatar} alt={post.name} className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-gray-900 text-sm">{post.name}</h4>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-full">{post.badge}</span>
                                    <span className="text-xs text-gray-400 ml-auto">{post.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{post.text}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">
                                        ❤️ {post.likes}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 transition-colors font-medium">
                                        <MessageSquare className="w-3.5 h-3.5" /> Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    /* ── SETTINGS ── */
    const SettingsPanel = () => (
        <div className="max-w-2xl space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold font-outfit text-primary-900">Settings</h1>
                <p className="text-gray-500">Manage your account preferences and notifications.</p>
            </div>

            {[
                { section: 'Account', items: ['Change Password', 'Two-Factor Authentication', 'Connected Accounts'] },
                { section: 'Notifications', items: ['Email Notifications', 'Push Notifications', 'Weekly Carbon Report'] },
                { section: 'Privacy', items: ['Profile Visibility', 'Data Sharing Preferences', 'Download My Data'] },
            ].map(({ section, items }) => (
                <div key={section} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">{section}</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {items.map(item => (
                            <button key={item} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left">
                                <span className="text-sm text-gray-700 font-medium">{item}</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="bg-red-50 rounded-[20px] p-5 border border-red-100">
                <h3 className="font-bold text-red-700 mb-1">Danger Zone</h3>
                <p className="text-sm text-red-500 mb-3">Permanent account actions that cannot be undone.</p>
                <button className="text-sm font-bold text-red-600 hover:text-red-700 underline">Delete Account</button>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview': return <Overview />;
            case 'Carbon': return <CarbonTracker />;
            case 'Profile': return <Profile />;
            case 'My Orders': return <MyOrders />;
            case 'Community': return <Community />;
            case 'Settings': return <SettingsPanel />;
            default: return <Overview />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-primary-600 p-1.5 rounded-lg"><Leaf className="text-white w-6 h-6" /></div>
                    <span className="text-2xl font-bold font-outfit text-primary-900">Ecological</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-left ${activeTab === item.name ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            {item.icon}
                            {item.name}
                            {activeTab === item.name && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setActiveTab('Profile')}>
                        <img src="https://i.pravatar.cc/150?u=user-me" alt="User" className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">Alex Green</p>
                            <p className="text-xs text-gray-500 truncate">alex@greenify.eco</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium">
                        <LogOut size={18} /> Log Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                        <div className="bg-primary-600 p-1.5 rounded-lg"><Leaf className="text-white w-5 h-5" /></div>
                        <span className="text-xl font-bold font-outfit text-primary-900">Ecological</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <img src="https://i.pravatar.cc/150?u=user-me" alt="User" className="w-8 h-8 rounded-full border border-gray-200 object-cover" onClick={() => setActiveTab('Profile')} />
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto pb-24 md:pb-10">
                    {renderContent()}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === item.name ? 'text-primary-600' : 'text-gray-400'}`}
                    >
                        {item.icon}
                        <span className="text-[9px] font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Dashboard;
