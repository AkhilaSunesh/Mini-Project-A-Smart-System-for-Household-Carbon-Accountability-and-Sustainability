import React, { useState, useEffect } from 'react';
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
    Package,
    Check,
    Clock,
    Star,
    MessageSquare,
    Upload,
    FileText,
    Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '../components/LogoIcon';
import { getProfile, getLeaderboard, getMarketplaceProjects, purchaseCredits, getPurchaseHistory, getMySubmissions, submitEcoAction, getCarbonHistory, submitCarbonReport, getCarbonStats } from '../api';

/* ─── Stacked Bar Chart (CSS + SVG) ─── */
const StackedBarChart = ({ data, categories, height = 180 }) => {
    // Find max total to scale the chart
    const maxTotal = Math.max(...data.map(d => d.total), 30); // Use 30 as a minimum ceiling for better scale
    const ceiling = Math.ceil(maxTotal / 15) * 15; // Round to nearest 15 for grid lines

    const yAxisLabels = [0, ceiling * 0.25, ceiling * 0.5, ceiling * 0.75, ceiling].reverse();

    return (
        <div className="w-full">
            <div className="flex gap-4">
                {/* Y-Axis */}
                <div className="flex flex-col justify-between text-[10px] text-gray-400 font-bold pb-6 pt-2" style={{ height: `${height}px` }}>
                    {yAxisLabels.map(val => <span key={val}>{Math.round(val)}kg</span>)}
                </div>

                {/* Bars Container */}
                <div className="flex-1 relative overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="h-full relative" style={{ minWidth: data.length > 7 ? `${data.length * 60}px` : '100%' }}>
                        {/* Horizontal Grid Lines */}
                        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between py-2 pointer-events-none">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-full border-t border-gray-100 border-dashed"></div>
                            ))}
                        </div>

                        {/* Bars */}
                        <div className="relative flex items-end justify-between gap-4 h-full px-2" style={{ height: `${height}px` }}>
                            {data.map((day, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group relative z-10">
                                    <div className="w-full max-w-[40px] flex flex-col-reverse rounded-lg overflow-hidden transition-all duration-500 hover:brightness-95" style={{ height: `${(day.total / ceiling) * 100}%` }}>
                                        {categories.map((cat, i) => {
                                            const h = (day[cat.key] / Math.max(day.total, 0.0001)) * 100;
                                            return h > 0 ? (
                                                <div
                                                    key={i}
                                                    style={{ height: `${h}%`, backgroundColor: cat.color }}
                                                    className="w-full"
                                                    title={`${cat.label}: ${day[cat.key].toFixed(1)}kg`}
                                                />
                                            ) : null;
                                        })}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold mt-3 whitespace-nowrap">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center flex-wrap gap-6 mt-6">
                {categories.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{cat.label}</span>
                    </div>
                ))}
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

    // Real data state
    const [profile, setProfile] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [marketplace, setMarketplace] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [carbonHistory, setCarbonHistory] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartPeriod, setChartPeriod] = useState('Daily');
    const [statsData, setStatsData] = useState([]);
    const [statsLoading, setStatsLoading] = useState(false);

    // Submit eco-action form state
    const [submitForm, setSubmitForm] = useState({ title: '', category: 'Transport', description: '' });
    const [submitFile, setSubmitFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // Carbon Report Form State
    const [carbonForm, setCarbonForm] = useState({
        date: new Date().toLocaleDateString('en-CA'), // Returns YYYY-MM-DD in local time
        transport_distance: 0,
        transport_vehicle_type: 'car_petrol_small',
        electricity_units: 0,
        lpg_used: 0,
        water_used: 0,
        water_source: 'municipal',
        waste_weight: 0,
        waste_type_method: 'organic_landfill'
    });
    const [carbonLoading, setCarbonLoading] = useState(false);
    const [carbonMessage, setCarbonMessage] = useState('');
    const [editingId, setEditingId] = useState(null);

    const resetCarbonForm = () => {
        setCarbonForm({
            date: new Date().toLocaleDateString('en-CA'),
            transport_distance: 0,
            transport_vehicle_type: 'car_petrol_small',
            electricity_units: 0,
            lpg_used: 0,
            water_used: 0,
            water_source: 'municipal',
            waste_weight: 0,
            waste_type_method: 'organic_landfill'
        });
        setEditingId(null);
    };

    // Purchase state
    const [purchaseLoading, setPurchaseLoading] = useState(null);
    const [purchaseMessage, setPurchaseMessage] = useState('');
    const [buyQty, setBuyQty] = useState({});

    // --- AQI state (lifted to Dashboard level for hooks stability) ---
    const [aqi, setAqi] = useState(null);
    const [aqiLoading, setAqiLoading] = useState(true);

    // --- Checklist state (persisted in localStorage) ---
    const CHECKLIST_KEY = 'eco_checklist';
    const defaultChecklist = [
        { id: 1, text: 'Meat Free Monday', done: false },
        { id: 2, text: 'Unplug Standby Devices', done: false },
        { id: 3, text: 'Take Public Transport', done: false },
        { id: 4, text: 'Use Reusable Bag', done: false },
        { id: 5, text: 'Reduce Shower Time', done: false },
    ];
    const loadChecklist = () => {
        try {
            const saved = localStorage.getItem(CHECKLIST_KEY);
            return saved ? JSON.parse(saved) : defaultChecklist;
        } catch { return defaultChecklist; }
    };
    const [checklist, setChecklist] = useState(loadChecklist);
    const toggleCheck = (id) => {
        const updated = checklist.map(item => item.id === id ? { ...item, done: !item.done } : item);
        setChecklist(updated);
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
    };

    const username = localStorage.getItem('username') || 'User';

    useEffect(() => {
        // Auth guard
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchAllData();
    }, []);

    // --- Fetch AQI for Kottayam (always called, not conditional) ---
    useEffect(() => {
        const fetchAqi = async () => {
            setAqiLoading(true);
            try {
                const res = await fetch('https://api.waqi.info/feed/geo:9.5916;76.5222/?token=demo');
                const json = await res.json();
                if (json.status === 'ok') {
                    setAqi(json.data);
                }
            } catch {
                // silently fail
            } finally {
                setAqiLoading(false);
            }
        };
        fetchAqi();
    }, []);

    const fetchAllData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [profileRes, leaderboardRes, marketplaceRes, submissionsRes, carbonRes, purchaseRes] = await Promise.allSettled([
                getProfile(),
                getLeaderboard(),
                getMarketplaceProjects(),
                getMySubmissions(),
                getCarbonHistory(),
                getPurchaseHistory(),
            ]);
            if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
            if (leaderboardRes.status === 'fulfilled') setLeaderboard(leaderboardRes.value.data);
            if (marketplaceRes.status === 'fulfilled') setMarketplace(marketplaceRes.value.data);
            if (submissionsRes.status === 'fulfilled') setSubmissions(submissionsRes.value.data);
            if (carbonRes.status === 'fulfilled') setCarbonHistory(carbonRes.value.data);
            if (purchaseRes.status === 'fulfilled') setPurchaseHistory(purchaseRes.value.data);

            // Also fetch stats for the current period
            fetchStats(chartPeriod);
        } catch {
            // individual errors handled by interceptor (401 → redirect)
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchStats = async (period) => {
        setStatsLoading(true);
        try {
            const res = await getCarbonStats(period);
            setStatsData(res.data);
        } catch {
            // silent fail
        } finally {
            setStatsLoading(false);
        }
    };

    // Refetch stats when period changes
    useEffect(() => {
        if (!loading) fetchStats(chartPeriod);
    }, [chartPeriod]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        navigate('/');
    };

    const handleSubmitEcoAction = async (e) => {
        e.preventDefault();
        if (!submitForm.title || !submitForm.description || !submitFile) {
            setSubmitMessage('Please fill all fields and upload a proof image.');
            return;
        }
        setSubmitLoading(true);
        setSubmitMessage('');
        try {
            const fd = new FormData();
            fd.append('title', submitForm.title);
            fd.append('category', submitForm.category);
            fd.append('description', submitForm.description);
            fd.append('proof_image', submitFile);
            await submitEcoAction(fd);
            setSubmitMessage('✅ Eco-action submitted successfully!');
            setSubmitForm({ title: '', category: 'Transport', description: '' });
            setSubmitFile(null);
            // Refresh data silently
            fetchAllData(true);
            setTimeout(() => setSubmitMessage(''), 5000);
        } catch {
            setSubmitMessage('❌ Failed to submit. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handlePurchase = async (projectId, qty) => {
        setPurchaseLoading(projectId);
        setPurchaseMessage('');
        try {
            const res = await purchaseCredits(projectId, qty || 1);
            setPurchaseMessage(`✅ ${res.data.message} — ${res.data.credits_added} credits for ₹${res.data.total_price?.toFixed(2)}`);
            // Refresh data silently
            fetchAllData(true);
            setTimeout(() => setPurchaseMessage(''), 5000);
        } catch (err) {
            setPurchaseMessage(`❌ ${err.response?.data?.error || 'Purchase failed'}`);
        } finally {
            setPurchaseLoading(null);
        }
    };

    const handleCarbonSubmit = async (e) => {
        e.preventDefault();

        // Check if date already exists (only for new entries)
        if (!editingId) {
            const dateExists = carbonHistory.some(h => h.date === carbonForm.date);
            if (dateExists) {
                setCarbonMessage('❌ A report for this date already exists. Please edit the existing entry.');
                return;
            }
        }

        setCarbonLoading(true);
        setCarbonMessage('');
        try {
            if (editingId) {
                await updateCarbonReport(editingId, carbonForm);
                setCarbonMessage('✅ Carbon report updated successfully!');
            } else {
                await submitCarbonReport(carbonForm);
                setCarbonMessage('✅ Carbon report submitted successfully!');
            }
            // Reset form
            resetCarbonForm();
            // Refresh data silently
            fetchAllData(true);
            setTimeout(() => setCarbonMessage(''), 5000);
        } catch (err) {
            setCarbonMessage(`❌ ${err.response?.data?.error || 'Failed to submit carbon report.'}`);
        } finally {
            setCarbonLoading(false);
        }
    };

    const handleEditLog = (h) => {
        setCarbonForm({
            date: h.date,
            transport_distance: h.transport_distance,
            transport_vehicle_type: h.transport_vehicle_type,
            electricity_units: h.electricity_units,
            lpg_used: h.lpg_used,
            water_used: h.water_used,
            water_source: h.water_source,
            waste_weight: h.waste_weight,
            waste_type_method: h.waste_type_method
        });
        setEditingId(h.id);
        // Scroll to form
        const formEl = document.getElementById('carbon-form');
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteLog = async (id) => {
        if (!window.confirm('🗑️ Are you sure you want to delete this log? This action cannot be undone.')) return;
        try {
            await deleteCarbonReport(id);
            setCarbonMessage('✅ Log deleted successfully.');
            // Refresh all data to sync charts and totals
            await fetchAllData(true);
            setTimeout(() => setCarbonMessage(''), 5000);
        } catch (err) {
            console.error('Delete failed:', err);
            setCarbonMessage(`❌ Failed to delete log: ${err.response?.data?.error || 'Server error'}`);
        }
    };

    const menuItems = [
        { name: 'Overview', icon: <LayoutDashboard size={20} /> },
        { name: 'Carbon', icon: <Leaf size={20} /> },
        { name: 'Profile', icon: <User size={20} /> },
        { name: 'Eco Actions', icon: <FileText size={20} /> },
        { name: 'Marketplace', icon: <ShoppingBag size={20} /> },
        { name: 'Community', icon: <Users size={20} /> },
        { name: 'Settings', icon: <Settings size={20} /> },
    ];

    // Calculate dynamic categories from history
    const getCategoryTotal = (history) => {
        const totals = { transport: 0, energy: 0, water: 0, waste: 0 };
        history.forEach(h => {
            totals.transport += h.transport_co2 || 0;
            totals.energy += h.energy_co2 || 0;
            totals.water += h.water_co2 || 0;
            totals.waste += h.waste_co2 || 0;
        });
        return totals;
    };

    const catTotals = getCategoryTotal(carbonHistory);
    const carbonCategories = [
        { icon: Car, label: 'Transport', value: Math.round(catTotals.transport), color: '#6366f1' },
        { icon: Zap, label: 'Energy (Elec/LPG)', value: Math.round(catTotals.energy), color: '#f59e0b' },
        { icon: Wind, label: 'Water Usage', value: Math.round(catTotals.water), color: '#3b82f6' },
        { icon: Package, label: 'Waste', value: Math.round(catTotals.waste), color: '#10b981' },
    ];
    const totalCarbon = carbonCategories.reduce((s, c) => s + c.value, 0);

    // Dynamic Trends Logic
    const trendsData = statsData;
    const trendCategories = [
        { key: 'transport', label: 'Transport', color: '#6366f1' },
        { key: 'energy', label: 'Energy', color: '#eab308' },
        { key: 'waste', label: 'Goods', color: '#10b981' }
    ];


    const summaryStats = [
        {
            title: 'Carbon Credits',
            value: profile ? `${profile.carbon_credits.toFixed(1)}` : '...',
            change: profile?.carbon_credits > 0 ? 'Active' : 'None yet',
            trend: 'up',
            icon: <Leaf className="text-green-600" />,
            bg: 'bg-green-50',
            changeColor: 'text-green-600',
        },
        {
            title: 'Total Emission',
            value: profile ? `${profile.total_emission.toFixed(1)} kg` : '...',
            change: 'Tracked',
            trend: 'stable',
            icon: <TrendingUp className="text-blue-600" />,
            bg: 'bg-blue-50',
            changeColor: 'text-blue-600',
        },
        {
            title: 'Eco Actions',
            value: `${submissions.length}`,
            change: submissions.filter(s => s.status === 'verified').length + ' verified',
            trend: 'up',
            icon: <Award className="text-amber-600" />,
            bg: 'bg-amber-50',
            changeColor: 'text-amber-600',
        },
    ];

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // --- AQI helper (pure function, no hooks) ---
    const getAqiInfo = (val) => {
        if (val <= 50) return { label: 'Good', color: '#10b981', bg: 'bg-green-50', text: 'text-green-700', desc: 'Air quality is satisfactory. Perfect for outdoor activities.' };
        if (val <= 100) return { label: 'Moderate', color: '#f59e0b', bg: 'bg-yellow-50', text: 'text-yellow-700', desc: 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.' };
        if (val <= 150) return { label: 'Unhealthy for Sensitive', color: '#f97316', bg: 'bg-orange-50', text: 'text-orange-700', desc: 'Sensitive groups may experience health effects. Consider reducing outdoor activities.' };
        if (val <= 200) return { label: 'Unhealthy', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-700', desc: 'Everyone may experience health effects. Reduce prolonged outdoor exertion.' };
        return { label: 'Hazardous', color: '#7c3aed', bg: 'bg-purple-50', text: 'text-purple-700', desc: 'Health alert. Everyone should avoid outdoor activity.' };
    };

    const aqiVal = aqi?.aqi || 0;
    const aqiInfo = getAqiInfo(aqiVal);

    // --- Suggestion data ---
    const suggestions = [
        { title: 'Switch to LED Bulbs', desc: 'Replacing your 5 most used bulbs could save 120kg CO₂/year', impact: 'High', difficulty: 'Low', cost: 'Low', icon: '💡' },
        { title: 'Cycle Short Trips', desc: 'Biking instead of driving for <3km trips saves ~0.9kg CO₂ per ride', impact: 'Medium', difficulty: 'Medium', cost: 'None', icon: '🚲' },
        { title: 'Compost Food Waste', desc: 'Composting kitchen scraps can reduce your waste emissions by 50%', impact: 'High', difficulty: 'Low', cost: 'Low', icon: '♻️' },
    ];
    const todaySuggestion = suggestions[new Date().getDay() % suggestions.length];

    /* ── OVERVIEW ── */
    const Overview = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-primary-900">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {username}! Here's your eco-impact overview.</p>
                </div>
                <button
                    onClick={() => setActiveTab('Eco Actions')}
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 flex items-center gap-2"
                >
                    <Upload size={18} /> Submit Eco Action
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

            {/* Two-column: Main content + Right sidebar */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* LEFT — main content (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Emission Trends Stacked Chart */}
                    <div className="bg-white rounded-[32px] border border-gray-100 p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h3 className="text-2xl font-bold font-outfit text-gray-900">Emission Trends</h3>
                                <p className="text-sm text-gray-400 font-medium tracking-wide">Breakdown by category (kg CO₂)</p>
                            </div>
                            <div className="bg-gray-100 p-1 rounded-xl flex">
                                {['Daily', 'Weekly', 'Monthly'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setChartPeriod(p)}
                                        className={`px-4 py-1.5 text-xs font-bold transition-all duration-200 ${chartPeriod === p ? 'text-gray-900 bg-white rounded-lg shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <StackedBarChart data={trendsData} categories={trendCategories} height={220} />
                    </div>

                    {/* Recent Submissions + Credits */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-white rounded-[32px] border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold font-outfit text-primary-900">Recent Eco Actions</h3>
                                <button onClick={() => setActiveTab('Eco Actions')} className="text-primary-600 text-sm font-bold hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            {submissions.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">No eco actions submitted yet. Start making an impact!</p>
                            ) : (
                                <div className="space-y-4">
                                    {submissions.slice(0, 3).map((sub) => (
                                        <div key={sub.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                                            <div className="w-11 h-11 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 shrink-0">
                                                <Leaf size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 text-sm">{sub.title}</h4>
                                                <p className="text-xs text-gray-400">{sub.category} · {new Date(sub.submitted_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sub.status === 'verified' ? 'bg-green-50 text-green-600' : sub.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'}`}>
                                                    {sub.status === 'verified' ? <Check className="inline w-3 h-3 mr-0.5" /> : <Clock className="inline w-3 h-3 mr-0.5" />}
                                                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                                </span>
                                                {sub.points > 0 && <p className="text-[10px] text-green-500 font-medium mt-1">+{sub.points} pts</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-primary-900 rounded-[32px] p-7 text-white relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-primary-200">
                                    <Award size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Your Credits</span>
                                </div>
                                <h3 className="text-xl font-bold font-outfit mb-3">{profile?.carbon_credits?.toFixed(1) || 0} Credits</h3>
                                <p className="text-primary-200 text-sm mb-5">Earn more by submitting verified eco-actions!</p>
                            </div>
                            <div>
                                <div className="w-full bg-white/20 h-2.5 rounded-full mb-2">
                                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${Math.min((profile?.carbon_credits || 0) * 10, 100)}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-primary-300">
                                    <span>{profile?.carbon_credits?.toFixed(1) || 0} earned</span><span>10 goal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Sidebar widgets (1/3) */}
                <div className="space-y-6">

                    {/* 1. Top Recommendation */}
                    <div className="bg-white rounded-[24px] border border-gray-100 p-5 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">{todaySuggestion.icon}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Top Recommendation</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1 font-outfit">{todaySuggestion.title}</h4>
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{todaySuggestion.desc}</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2.5 py-1 rounded-full">Impact: {todaySuggestion.impact}</span>
                            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full">Difficulty: {todaySuggestion.difficulty}</span>
                            <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-full">Cost: {todaySuggestion.cost}</span>
                        </div>
                    </div>

                    {/* 2. Quick Actions Checklist */}
                    <div className="bg-white rounded-[24px] border border-gray-100 p-5 hover:shadow-lg transition-shadow">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary-600" />
                            Quick Actions
                        </h4>
                        <div className="space-y-3">
                            {checklist.map(item => (
                                <label
                                    key={item.id}
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={(e) => { e.preventDefault(); toggleCheck(item.id); }}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${item.done ? 'bg-primary-600 border-primary-600' : 'border-gray-300 group-hover:border-primary-400'}`}>
                                        {item.done && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={`text-sm font-medium transition-all ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.text}</span>
                                </label>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center text-xs text-gray-400">
                                <span>{checklist.filter(c => c.done).length}/{checklist.length} completed</span>
                                <button
                                    onClick={() => { setChecklist(defaultChecklist); localStorage.setItem(CHECKLIST_KEY, JSON.stringify(defaultChecklist)); }}
                                    className="text-primary-500 font-bold hover:underline"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${(checklist.filter(c => c.done).length / checklist.length) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Live AQI Tracker — Kottayam */}
                    <div className={`rounded-[24px] border border-gray-100 p-5 hover:shadow-lg transition-shadow ${aqiInfo.bg}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Wind className={`w-4 h-4 ${aqiInfo.text}`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Local Air Quality</span>
                            </div>
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        </div>

                        {aqiLoading ? (
                            <div className="flex items-center gap-2 py-4">
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
                                <span className="text-sm text-gray-400">Fetching AQI...</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-end justify-between mb-2">
                                    <div>
                                        <h4 className={`text-2xl font-bold font-outfit ${aqiInfo.text}`}>{aqiInfo.label}</h4>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">Kottayam, Kerala</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-bold font-outfit" style={{ color: aqiInfo.color }}>{aqiVal}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">AQI</p>
                                    </div>
                                </div>
                                <p className={`text-xs ${aqiInfo.text} leading-relaxed mb-3`}>{aqiInfo.desc}</p>

                                {/* AQI scale bar */}
                                <div className="relative mt-1">
                                    <div className="w-full h-2 rounded-full overflow-hidden flex">
                                        <div className="flex-1 bg-green-400"></div>
                                        <div className="flex-1 bg-yellow-400"></div>
                                        <div className="flex-1 bg-orange-400"></div>
                                        <div className="flex-1 bg-red-400"></div>
                                        <div className="flex-1 bg-purple-500"></div>
                                    </div>
                                    {/* marker */}
                                    <div
                                        className="absolute top-[-3px] w-3 h-3 rounded-full border-2 border-white shadow-md"
                                        style={{
                                            left: `${Math.min((aqiVal / 300) * 100, 98)}%`,
                                            backgroundColor: aqiInfo.color,
                                            transition: 'left 1s ease',
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                                    <span>0</span>
                                    <span>50</span>
                                    <span>100</span>
                                    <span>150</span>
                                    <span>200</span>
                                    <span>300+</span>
                                </div>

                                {aqi?.time?.s && (
                                    <p className="text-[10px] text-gray-400 mt-3 text-right">
                                        Updated: {new Date(aqi.time.s).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );

    /* ── CARBON TAB ── */
    const CarbonTracker = () => {
        // Calculate recent history for chart (last 7 entries)
        const recentHistory = [...carbonHistory].reverse().slice(-7).map(h => ({
            day: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' }),
            value: h.total_co2
        }));

        // Fill with zeros if less than 7 days
        while (recentHistory.length < 7) {
            recentHistory.unshift({ day: '-', value: 0 });
        }

        const thisWeekEmission = carbonHistory.slice(0, 7).reduce((s, h) => s + h.total_co2, 0);
        const thisWeekOffset = submissions
            .filter(s => s.status === 'verified' && new Date(s.reviewed_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            .reduce((s, sub) => s + (sub.points * 0.5), 0); // Assuming 1 point = 0.5kg CO2 offset for visualization

        return (
            <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-outfit text-primary-900">Carbon Tracker</h1>
                        <p className="text-gray-500">Monitor your weekly carbon emissions and submit daily reports.</p>
                    </div>
                </div>

                {/* Submit Carbon Report Form */}
                <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm" id="carbon-form">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Wind size={18} className="text-primary-600" /> {editingId ? 'Edit Activity' : 'Log Daily Activity'}
                        </h3>
                        {editingId && (
                            <button onClick={resetCarbonForm} className="text-xs font-bold text-gray-400 hover:text-primary-600">Cancel Edit</button>
                        )}
                    </div>
                    {carbonMessage && (
                        <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${carbonMessage.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                            {carbonMessage}
                        </div>
                    )}
                    <form onSubmit={handleCarbonSubmit} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/3">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Report Date</label>
                                <input
                                    type="date"
                                    value={carbonForm.date}
                                    onChange={e => setCarbonForm({ ...carbonForm, date: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Transport */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase">Transportation</label>
                                <select
                                    value={carbonForm.transport_vehicle_type}
                                    onChange={e => setCarbonForm({ ...carbonForm, transport_vehicle_type: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                >
                                    <option value="car_petrol_large">Car (Petrol &gt;1200cc)</option>
                                    <option value="car_petrol_small">Car (Petrol &lt;1200cc)</option>
                                    <option value="bike_motorcycle">Motorcycle</option>
                                    <option value="bike_scooter">Scooter</option>
                                    <option value="bus_public">Public Bus</option>
                                    <option value="train_rail">Train/Rail</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Distance (km)"
                                    value={carbonForm.transport_distance || ''}
                                    onChange={e => setCarbonForm({ ...carbonForm, transport_distance: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                />
                            </div>

                            {/* Energy */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase">Home Energy</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Electricity (kWh)"
                                        value={carbonForm.electricity_units || ''}
                                        onChange={e => setCarbonForm({ ...carbonForm, electricity_units: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                    />
                                    <span className="absolute right-3 top-2 text-[10px] text-gray-400 font-bold">kWh</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="LPG (kg)"
                                        value={carbonForm.lpg_used || ''}
                                        onChange={e => setCarbonForm({ ...carbonForm, lpg_used: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                    />
                                    <span className="absolute right-3 top-2 text-[10px] text-gray-400 font-bold">kg</span>
                                </div>
                            </div>

                            {/* Water */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase">Water Usage</label>
                                <select
                                    value={carbonForm.water_source}
                                    onChange={e => setCarbonForm({ ...carbonForm, water_source: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                >
                                    <option value="municipal">Municipal Supply</option>
                                    <option value="borewell">Borewell Pump</option>
                                </select>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Water (Liters)"
                                        value={carbonForm.water_used || ''}
                                        onChange={e => setCarbonForm({ ...carbonForm, water_used: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                    />
                                    <span className="absolute right-3 top-2 text-[10px] text-gray-400 font-bold">L</span>
                                </div>
                            </div>

                            {/* Waste */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase">Waste</label>
                                <select
                                    value={carbonForm.waste_type_method}
                                    onChange={e => setCarbonForm({ ...carbonForm, waste_type_method: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                >
                                    <option value="organic_landfill">Organic (Landfill)</option>
                                    <option value="organic_composted">Organic (Composted)</option>
                                    <option value="paper">Paper Waste</option>
                                </select>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Weight (kg)"
                                        value={carbonForm.waste_weight || ''}
                                        onChange={e => setCarbonForm({ ...carbonForm, waste_weight: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                    />
                                    <span className="absolute right-3 top-2 text-[10px] text-gray-400 font-bold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetCarbonForm}
                                    className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={carbonLoading}
                                className="bg-primary-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-70 transition-colors shadow-lg shadow-primary-200"
                            >
                                {carbonLoading ? 'Saving...' : editingId ? 'Update Report' : 'Save Daily Report'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'This Week - Emitted', value: `${thisWeekEmission.toFixed(1)} kg`, sub: 'CO₂', color: 'text-red-500', bg: 'bg-red-50', icon: Wind },
                        { label: 'This Week - Offset', value: `${thisWeekOffset.toFixed(1)} kg`, sub: 'CO₂', color: 'text-green-600', bg: 'bg-green-50', icon: Leaf },
                        { label: 'Net Balance', value: `${(thisWeekEmission - thisWeekOffset).toFixed(1)} kg`, sub: 'Net CO₂', color: 'text-blue-600', bg: 'bg-blue-50', icon: BarChart2 },
                        { label: 'Carbon Credits', value: profile ? profile.carbon_credits.toFixed(1) : '0', sub: 'Earned', color: 'text-amber-600', bg: 'bg-amber-50', icon: Award },
                    ].map((card, i) => (
                        <div key={i} className={`${card.bg} rounded-[20px] p-5`}>
                            <card.icon className={`w-6 h-6 ${card.color} mb-3`} />
                            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Weekly Trends Stacked Chart (Full Width) */}
                <div className="bg-white rounded-[24px] border border-gray-100 p-6">
                    <h3 className="text-lg font-bold font-outfit text-primary-900 mb-1">Weekly Emission Trends</h3>
                    <p className="text-sm text-gray-400 mb-6">Detailed categorical breakdown (kg CO₂)</p>
                    <div className="max-w-4xl">
                        <StackedBarChart data={trendsData} categories={trendCategories} height={200} />
                    </div>
                </div>

                {/* Recent History List */}
                <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">Recent Logs</h3>
                    </div>
                    {carbonHistory.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No carbon logs yet.</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {carbonHistory.slice(0, 10).map((h) => (
                                <div key={h.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-900">{new Date(h.date).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-400">
                                            {h.transport_distance}km via {h.transport_vehicle_type?.replace(/_/g, ' ')} | {h.electricity_units}kWh Electricity
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold text-red-500">+{h.total_co2.toFixed(2)} kg</p>
                                            <p className="text-[10px] text-gray-400">CO₂ emitted</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEditLog(h)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit Log">
                                                <FileText size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteLog(h.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Log">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    /* ── PROFILE ── */
    const Profile = () => (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-primary-900">My Profile</h1>
                    <p className="text-gray-500">Your account information and eco-impact.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-5">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="w-full h-28 absolute top-0 left-0 bg-gradient-to-br from-primary-400 to-primary-600"></div>
                        <div className="relative mt-10 mb-4">
                            <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden relative bg-primary-200 flex items-center justify-center">
                                <User className="w-14 h-14 text-primary-600" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-primary-900 font-outfit">{profile?.username || username}</h2>
                        <p className="text-primary-600 font-medium text-sm mb-1">{profile?.role === 'admin' ? 'Admin' : 'Eco Warrior'}</p>
                        <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 mt-4">
                            <div><p className="text-xl font-bold text-gray-900">{profile?.carbon_credits?.toFixed(1) || 0}</p><p className="text-[10px] text-gray-400 uppercase tracking-wide">Credits</p></div>
                            <div className="border-l border-gray-100"><p className="text-xl font-bold text-gray-900">{submissions.length}</p><p className="text-[10px] text-gray-400 uppercase tracking-wide">Actions</p></div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-primary-900 mb-6">Personal Information</h3>
                        <div className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                {[
                                    { label: 'Username', icon: User, value: profile?.username || username },
                                    { label: 'Email Address', icon: Mail, value: profile?.email || 'N/A' },
                                    { label: 'Carbon Credits', icon: Leaf, value: `${profile?.carbon_credits?.toFixed(1) || 0} credits` },
                                    { label: 'Total Emission', icon: Wind, value: `${profile?.total_emission?.toFixed(1) || 0} kg CO₂` },
                                ].map(({ label, icon: Icon, value }) => (
                                    <div key={label}>
                                        <label className="text-xs font-medium text-gray-400 mb-1.5 block uppercase tracking-wide">{label}</label>
                                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl text-gray-900 text-sm">
                                            <Icon size={16} className="text-gray-400" />{value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    /* ── ECO ACTIONS ── */
    const EcoActions = () => (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold font-outfit text-primary-900">Eco Actions</h1>
                <p className="text-gray-500">Submit eco-friendly actions and track your contributions.</p>
            </div>

            {/* Submit Form */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Upload size={18} className="text-primary-600" /> Submit New Eco Action</h3>
                {submitMessage && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${submitMessage.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                        {submitMessage}
                    </div>
                )}
                <form onSubmit={handleSubmitEcoAction} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={submitForm.title}
                                onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                placeholder="e.g. Planted 5 trees"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={submitForm.category}
                                onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                            >
                                {['Transport', 'Home Energy', 'Food & Diet', 'Recycling', 'Planting', 'Other'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={submitForm.description}
                            onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                            rows={3}
                            placeholder="Describe what you did..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proof Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setSubmitFile(e.target.files[0]);
                                }
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
                        />
                        {submitFile && (
                            <div className="mt-2 flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                <Check className="w-4 h-4 shrink-0" />
                                <span className="truncate font-medium">{submitFile.name}</span>
                                <span className="text-xs text-green-500 shrink-0">({(submitFile.size / 1024).toFixed(0)} KB)</span>
                                <button
                                    type="button"
                                    onClick={() => setSubmitFile(null)}
                                    className="ml-auto text-red-400 hover:text-red-600 text-xs font-bold shrink-0"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={submitLoading}
                        className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-70 transition-colors flex items-center gap-2 shadow-lg shadow-primary-200"
                    >
                        {submitLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Upload size={16} /> Submit
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Submissions List */}
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">My Submissions</h3>
                </div>
                {submissions.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No submissions yet.</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {submissions.map((sub) => (
                            <div key={sub.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-900">{sub.title}</h4>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sub.status === 'verified' ? 'bg-green-50 text-green-600' : sub.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'}`}>
                                            {sub.status === 'verified' ? <Check className="inline w-3 h-3 mr-0.5" /> : <Clock className="inline w-3 h-3 mr-0.5" />}
                                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">{sub.category} · {new Date(sub.submitted_at).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-500 mt-1">{sub.description}</p>
                                </div>
                                <div className="text-right">
                                    {sub.points > 0 && <p className="font-bold text-primary-600">+{sub.points} pts</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );


    /* ── MARKETPLACE ── */
    const MarketplaceTab = () => (
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

    /* ── COMMUNITY (Leaderboard) ── */
    const Community = () => (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold font-outfit text-primary-900">Community Leaderboard</h1>
                <p className="text-gray-500">See how you rank among eco-warriors.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {[
                    { v: leaderboard.length, l: 'Total Members' },
                    { v: profile?.carbon_credits?.toFixed(1) || 0, l: 'Your Credits' },
                    { v: submissions.filter(s => s.status === 'verified').length, l: 'Your Verified Actions' },
                ].map((s, i) => (
                    <div key={i} className="bg-primary-50 rounded-[20px] p-5 text-center">
                        <p className="text-3xl font-bold text-primary-700 font-outfit">{s.v}</p>
                        <p className="text-sm text-primary-500 font-medium">{s.l}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Rankings by Carbon Credits</h3>
                </div>
                {leaderboard.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No data yet.</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {leaderboard.map((entry, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${i < 3 ? 'bg-amber-50 text-amber-600 border-2 border-amber-200' : 'bg-gray-100 text-gray-600'}`}>
                                    {entry.rank || i + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold text-sm ${entry.username === username ? 'text-primary-600' : 'text-gray-900'}`}>
                                        {entry.username}
                                        {entry.username === username && <span className="ml-2 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">You</span>}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{entry.carbon_credits?.toFixed(1) || 0}</p>
                                    <p className="text-[10px] text-gray-400">credits</p>
                                </div>
                                {i < 3 && <Star className="w-4 h-4 text-amber-400" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    /* ── SETTINGS ── */
    const SettingsPanel = () => (
        <div className="max-w-2xl space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold font-outfit text-primary-900">Settings</h1>
                <p className="text-gray-500">Manage your account preferences.</p>
            </div>

            {[
                { section: 'Account', items: ['Change Password', 'Connected Accounts'] },
                { section: 'Notifications', items: ['Email Notifications', 'Weekly Carbon Report'] },
                { section: 'Privacy', items: ['Profile Visibility', 'Download My Data'] },
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
            case 'Overview': return Overview();
            case 'Carbon': return CarbonTracker();
            case 'Profile': return Profile();
            case 'Eco Actions': return EcoActions();
            case 'Marketplace': return MarketplaceTab();
            case 'Community': return Community();
            case 'Settings': return SettingsPanel();
            default: return Overview();
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-primary-600 p-1.5 rounded-lg"><LogoIcon className="w-6 h-6 text-white" /></div>
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
                        <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{profile?.username || username}</p>
                            <p className="text-xs text-gray-500 truncate">{profile?.email || ''}</p>
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
                        <div className="bg-primary-600 p-1.5 rounded-lg"><LogoIcon className="w-5 h-5 text-white" /></div>
                        <span className="text-xl font-bold font-outfit text-primary-900">Ecological</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center" onClick={() => setActiveTab('Profile')}>
                            <User className="w-4 h-4 text-primary-600" />
                        </div>
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
