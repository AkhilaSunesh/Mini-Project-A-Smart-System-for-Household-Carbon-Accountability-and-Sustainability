import React from 'react';
import { User, Mail, Leaf, Wind } from 'lucide-react';
import { useDashboard } from './DashboardContext';

const Profile = () => {
    const { profile, username, submissions } = useDashboard();

    return (
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
};

export default Profile;
