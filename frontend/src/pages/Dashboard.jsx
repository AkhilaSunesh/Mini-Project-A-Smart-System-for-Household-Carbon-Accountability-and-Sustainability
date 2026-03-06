import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, User, Bell, ChevronRight, LayoutDashboard, ShoppingBag, Users, Settings, Leaf, FileText, ArrowUpRight, TrendingUp, Award
} from 'lucide-react';
import LogoIcon from '../components/LogoIcon';
import {
    getProfile, updateProfile, changePassword, deleteAccount,
    getLeaderboard, getMarketplaceProjects, createRazorpayOrder, verifyRazorpayPayment, getPurchaseHistory,
    getMySubmissions, submitEcoAction,
    getCarbonHistory, submitCarbonReport, getCarbonStats, updateCarbonReport, deleteCarbonReport
} from '../api';

/* Context & Data */
import { DashboardProvider } from '../components/dashboard/DashboardContext';
import { getAqiInfo, suggestions, getMenuItems, trendCategories, defaultChecklist } from '../components/dashboard/DashboardData';

/* Tabs */
import Overview from '../components/dashboard/Overview';
import CarbonTracker from '../components/dashboard/CarbonTracker';
import Profile from '../components/dashboard/Profile';
import EcoActions from '../components/dashboard/EcoActions';
import MarketplaceTab from '../components/dashboard/MarketplaceTab';
import Community from '../components/dashboard/Community';
import SettingsPanel from '../components/dashboard/SettingsPanel';

const CHECKLIST_KEY = 'eco_checklist';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');

    /* Real data state */
    const [profile, setProfile] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [marketplace, setMarketplace] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [carbonHistory, setCarbonHistory] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartPeriod, setChartPeriod] = useState('Weekly');
    const [statsData, setStatsData] = useState([]);
    const [statsLoading, setStatsLoading] = useState(false);

    /* Form States */
    const [submitForm, setSubmitForm] = useState({ title: '', category: 'Transport', description: '' });
    const [submitFile, setSubmitFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const [carbonForm, setCarbonForm] = useState({
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
    const [carbonLoading, setCarbonLoading] = useState(false);
    const [carbonMessage, setCarbonMessage] = useState('');
    const [editingId, setEditingId] = useState(null);

    const [buyQty, setBuyQty] = useState({});
    const [purchaseLoading, setPurchaseLoading] = useState(null);
    const [purchaseMessage, setPurchaseMessage] = useState('');

    const [settingsEmail, setSettingsEmail] = useState('');
    const [settingsPhone, setSettingsPhone] = useState('');
    const [settingsOldPass, setSettingsOldPass] = useState('');
    const [settingsNewPass, setSettingsNewPass] = useState('');
    const [settingsConfirmPass, setSettingsConfirmPass] = useState('');
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [settingsMessage, setSettingsMessage] = useState('');
    const [settingsDeletePass, setSettingsDeletePass] = useState('');

    const [aqi, setAqi] = useState(null);
    const [aqiLoading, setAqiLoading] = useState(true);

    const loadChecklist = useCallback(() => {
        try {
            const saved = localStorage.getItem(CHECKLIST_KEY);
            return saved ? JSON.parse(saved) : defaultChecklist;
        } catch { return defaultChecklist; }
    }, []);

    const [checklist, setChecklist] = useState(loadChecklist);

    const toggleCheck = useCallback((id) => {
        setChecklist(prev => {
            const updated = prev.map(item => item.id === id ? { ...item, done: !item.done } : item);
            localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const username = useMemo(() => localStorage.getItem('username') || 'User', []);

    /* Fetch Logics */
    const fetchStats = useCallback(async (period) => {
        setStatsLoading(true);
        try {
            const res = await getCarbonStats(period);
            setStatsData(res.data);
        } catch { /* silent fail */ }
        finally { setStatsLoading(false); }
    }, []);

    const fetchAllData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const [profileRes, leaderboardRes, marketplaceRes, submissionsRes, carbonRes, purchaseRes] = await Promise.allSettled([
                getProfile(), getLeaderboard(), getMarketplaceProjects(), getMySubmissions(), getCarbonHistory(), getPurchaseHistory()
            ]);
            if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
            if (leaderboardRes.status === 'fulfilled') setLeaderboard(leaderboardRes.value.data);
            if (marketplaceRes.status === 'fulfilled') setMarketplace(marketplaceRes.value.data);
            if (submissionsRes.status === 'fulfilled') setSubmissions(submissionsRes.value.data);
            if (carbonRes.status === 'fulfilled') setCarbonHistory(carbonRes.value.data);
            if (purchaseRes.status === 'fulfilled') setPurchaseHistory(purchaseRes.value.data);
            fetchStats(chartPeriod);
        } catch { /* Handled by axios interceptor */ }
        finally { if (!silent) setLoading(false); }
    }, [chartPeriod, fetchStats]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) { navigate('/login'); return; }
        fetchAllData();
    }, [fetchAllData, navigate]);

    useEffect(() => {
        const fetchAqi = async () => {
            setAqiLoading(true);
            try {
                const res = await fetch('https://api.waqi.info/feed/geo:9.5916;76.5222/?token=demo');
                const json = await res.json();
                if (json.status === 'ok') setAqi(json.data);
            } catch { /* silent fail */ }
            finally { setAqiLoading(false); }
        };
        fetchAqi();
    }, []);

    useEffect(() => {
        if (profile) {
            setSettingsEmail(profile.email || '');
            setSettingsPhone(profile.phone_number || '');
        }
    }, [profile]);

    /* Handlers */
    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate('/');
    }, [navigate]);

    const handleSubmitEcoAction = useCallback(async (e) => {
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
            fetchAllData(true);
            setTimeout(() => setSubmitMessage(''), 5000);
        } catch (err) {
            console.error(err);
            setSubmitMessage('❌ Failed to submit eco-action.');
        } finally { setSubmitLoading(false); }
    }, [submitForm, submitFile, fetchAllData]);

    const handlePurchase = useCallback(async (projectId, qty) => {
        setPurchaseLoading(projectId);
        setPurchaseMessage('');
        try {
            const orderRes = await createRazorpayOrder(projectId, qty || 1);
            const { razorpay_order_id, razorpay_key_id, amount, currency, organization } = orderRes.data;
            const options = {
                key: razorpay_key_id,
                amount: amount * 100,
                currency: currency,
                name: "EcoLogical Marketplace",
                description: `Purchase ${qty} credits from ${organization}`,
                order_id: razorpay_order_id,
                handler: async (response) => {
                    try {
                        setPurchaseLoading(projectId);
                        await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        setPurchaseMessage(`✅ Payment verified! ${qty} carbon credits added.`);
                        fetchAllData(true);
                        setTimeout(() => setPurchaseMessage(''), 8000);
                    } catch (err) {
                        setPurchaseMessage(`❌ Verification failed.`);
                    } finally { setPurchaseLoading(null); }
                },
                prefill: { name: profile?.username || "", email: profile?.email || "", contact: profile?.phone_number || "" },
                theme: { color: "#059669" },
                modal: { ondismiss: () => setPurchaseLoading(null) }
            };
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', () => { setPurchaseMessage('❌ Payment failed.'); setPurchaseLoading(null); });
            rzp.open();
        } catch (err) {
            setPurchaseMessage('❌ Order creation failed.');
            setPurchaseLoading(null);
        }
    }, [profile, fetchAllData]);

    const resetCarbonForm = useCallback(() => {
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
    }, []);

    const handleCarbonSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!editingId && carbonHistory.some(h => h.date === carbonForm.date)) {
            setCarbonMessage('❌ Report for this date already exists.');
            return;
        }
        setCarbonLoading(true);
        try {
            if (editingId) await updateCarbonReport(editingId, carbonForm);
            else await submitCarbonReport(carbonForm);
            setCarbonMessage('✅ Success!');
            resetCarbonForm();
            fetchAllData(true);
            setTimeout(() => setCarbonMessage(''), 5000);
        } catch { setCarbonMessage('❌ Failed.'); }
        finally { setCarbonLoading(false); }
    }, [editingId, carbonHistory, carbonForm, resetCarbonForm, fetchAllData]);

    const handleEditLog = useCallback((h) => {
        setCarbonForm({ ...h });
        setEditingId(h.id);
        document.getElementById('carbon-form')?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleDeleteLog = useCallback(async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deleteCarbonReport(id);
            fetchAllData(true);
        } catch { /* fail */ }
    }, [fetchAllData]);

    const handleUpdateProfile = useCallback(async (e) => {
        e.preventDefault();
        setSettingsLoading(true);
        try {
            await updateProfile({ email: settingsEmail, phone_number: settingsPhone });
            setSettingsMessage('✅ Updated!');
            fetchAllData(true);
        } catch { setSettingsMessage('❌ Failed.'); }
        finally { setSettingsLoading(false); }
    }, [settingsEmail, settingsPhone, fetchAllData]);

    const handleChangePassword = useCallback(async (e) => {
        e.preventDefault();
        if (settingsNewPass !== settingsConfirmPass) { setSettingsMessage('❌ Mismatch.'); return; }
        setSettingsLoading(true);
        try {
            await changePassword(settingsOldPass, settingsNewPass);
            setSettingsMessage('✅ Changed!');
            setSettingsOldPass(''); setSettingsNewPass(''); setSettingsConfirmPass('');
        } catch { setSettingsMessage('❌ Failed.'); }
        finally { setSettingsLoading(false); }
    }, [settingsOldPass, settingsNewPass, settingsConfirmPass]);

    const handleDeleteAccount = useCallback(async (e) => {
        e.preventDefault();
        if (!settingsDeletePass) return;
        if (!window.confirm('⚠️ PERMANENT DELETE?')) return;
        setSettingsLoading(true);
        try {
            await deleteAccount(settingsDeletePass);
            handleLogout();
        } catch { setSettingsMessage('❌ Failed.'); }
        finally { setSettingsLoading(false); }
    }, [settingsDeletePass, handleLogout]);

    /* UI Data Memoization */
    const aqiVal = useMemo(() => aqi?.aqi || 0, [aqi]);
    const aqiInfo = useMemo(() => getAqiInfo(aqiVal), [aqiVal]);
    const todaySuggestion = useMemo(() => suggestions[new Date().getDay() % suggestions.length], []);

    const summaryStats = useMemo(() => [
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
    ], [profile, submissions]);

    const thisWeekEmission = useMemo(() => carbonHistory.slice(0, 7).reduce((s, h) => s + h.total_co2, 0), [carbonHistory]);
    const thisWeekOffset = useMemo(() => submissions
        .filter(s => s.status === 'verified' && new Date(s.reviewed_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .reduce((s, sub) => s + (sub.points * 0.5), 0), [submissions]);

    const contextValue = {
        activeTab, setActiveTab, username, summaryStats, chartPeriod, setChartPeriod,
        trendsData: statsData, trendCategories, submissions, profile, todaySuggestion,
        checklist, toggleCheck, defaultChecklist, setChecklist, CHECKLIST_KEY,
        aqiLoading, aqiInfo, aqiVal, aqi, carbonHistory, editingId, resetCarbonForm,
        carbonMessage, handleCarbonSubmit, carbonForm, setCarbonForm, carbonLoading,
        thisWeekEmission, thisWeekOffset, handleEditLog, handleDeleteLog, submitMessage,
        handleSubmitEcoAction, submitForm, setSubmitForm, submitLoading, setSubmitFile, submitFile,
        purchaseMessage, marketplace, buyQty, setBuyQty, handlePurchase, purchaseLoading, purchaseHistory,
        leaderboard, settingsMessage, handleUpdateProfile, settingsEmail, setSettingsEmail,
        settingsPhone, setSettingsPhone, settingsLoading, handleChangePassword,
        settingsOldPass, setSettingsOldPass, settingsNewPass, setSettingsNewPass,
        settingsConfirmPass, setSettingsConfirmPass, handleDeleteAccount,
        settingsDeletePass, setSettingsDeletePass
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview': return <Overview />;
            case 'Carbon': return <CarbonTracker />;
            case 'Profile': return <Profile />;
            case 'Eco Actions': return <EcoActions />;
            case 'Marketplace': return <MarketplaceTab />;
            case 'Community': return <Community />;
            case 'Settings': return <SettingsPanel />;
            default: return <Overview />;
        }
    };

    const menuItems = useMemo(() => getMenuItems(), []);

    if (loading && !profile) {
        return (
            <div className="flex h-screen bg-gray-50 items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardProvider value={contextValue}>
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

                    <div className="p-6 lg:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-[600px]">
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-full">
                                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                            </div>
                        }>
                            {renderContent()}
                        </Suspense>
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
        </DashboardProvider>
    );
};

export default Dashboard;
