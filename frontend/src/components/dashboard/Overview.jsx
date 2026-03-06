import React from 'react';
import {
    Upload, ArrowUpRight, ChevronRight, Leaf, Check, Clock, Award, Wind, MapPin
} from 'lucide-react';
import { useDashboard } from './DashboardContext';
import { StackedBarChart } from './Charts';

const Overview = () => {
    const {
        username, setActiveTab, summaryStats, chartPeriod, setChartPeriod,
        trendsData, trendCategories, submissions, profile, todaySuggestion,
        checklist, toggleCheck, defaultChecklist, setChecklist, CHECKLIST_KEY,
        aqiLoading, aqiInfo, aqiVal, aqi
    } = useDashboard();

    return (
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
                                <h3 className="text-2xl font-bold font-outfit text-gray-900">{chartPeriod} Emission Trends</h3>
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
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Kottayam Air Quality</span>
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
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">Kottayam, Kerala (Live)</p>
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

                                {aqi?.time?.iso && (
                                    <p className="text-[10px] text-gray-400 mt-3 text-right">
                                        Updated: {new Date(aqi.time.iso).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                    </p>
                                )}
                                {!aqi?.time?.iso && aqi?.time?.s && (
                                    <p className="text-[10px] text-gray-400 mt-3 text-right">
                                        Updated: {aqi.time.s}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
