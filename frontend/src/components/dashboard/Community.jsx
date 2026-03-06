import React from 'react';
import { Star } from 'lucide-react';
import { useDashboard } from './DashboardContext';

const Community = () => {
    const { leaderboard, profile, submissions, username } = useDashboard();

    return (
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
};

export default Community;
