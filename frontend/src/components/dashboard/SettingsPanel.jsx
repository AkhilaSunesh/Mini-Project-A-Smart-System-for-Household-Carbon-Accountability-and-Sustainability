import React from 'react';
import { User, Lock } from 'lucide-react';
import { useDashboard } from './DashboardContext';

const SettingsPanel = () => {
    const {
        settingsMessage, profile, handleUpdateProfile, settingsEmail, setSettingsEmail,
        settingsPhone, setSettingsPhone, settingsLoading, handleChangePassword,
        settingsOldPass, setSettingsOldPass, settingsNewPass, setSettingsNewPass,
        settingsConfirmPass, setSettingsConfirmPass, handleDeleteAccount,
        settingsDeletePass, setSettingsDeletePass
    } = useDashboard();

    return (
        <div className="max-w-2xl space-y-8 animate-fade-in">
            <div className="text-left">
                <h1 className="text-3xl font-bold font-outfit text-primary-900">Settings</h1>
                <p className="text-gray-500">Manage your account preferences and security.</p>
            </div>

            {settingsMessage && (
                <div className={`p-4 rounded-xl text-sm font-medium ${settingsMessage.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {settingsMessage}
                </div>
            )}

            {/* Profile Settings */}
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <User size={18} className="text-primary-600" /> Account Settings
                    </h3>
                </div>
                <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                    <div className="text-left">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                        <input
                            type="email"
                            value={settingsEmail}
                            onChange={(e) => setSettingsEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-200 outline-none"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className="text-left">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone Number (for notifications)</label>
                        <input
                            type="tel"
                            value={settingsPhone}
                            onChange={(e) => setSettingsPhone(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-200 outline-none"
                            placeholder="+91 00000 00000"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={settingsLoading || (settingsEmail === profile?.email && settingsPhone === profile?.phone_number)}
                            className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 transition-all text-sm shadow-md shadow-primary-100"
                        >
                            {settingsLoading ? 'Saving...' : 'Update Information'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Settings */}
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Lock size={18} className="text-primary-600" /> Change Password
                    </h3>
                </div>
                <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                    <div className="text-left">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Current Password</label>
                        <input
                            type="password"
                            value={settingsOldPass}
                            onChange={(e) => setSettingsOldPass(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-200 outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="text-left">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">New Password</label>
                        <input
                            type="password"
                            value={settingsNewPass}
                            onChange={(e) => setSettingsNewPass(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-200 outline-none"
                            placeholder="Min 8 characters"
                        />
                    </div>
                    <div className="text-left">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={settingsConfirmPass}
                            onChange={(e) => setSettingsConfirmPass(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-200 outline-none"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={settingsLoading || !settingsOldPass || !settingsNewPass || !settingsConfirmPass}
                            className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 transition-all text-sm shadow-md shadow-primary-100"
                        >
                            {settingsLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/30 rounded-[24px] border border-red-100 overflow-hidden shadow-sm mt-12">
                <div className="px-6 py-4 border-b border-red-100 bg-red-50/50">
                    <h3 className="font-bold text-red-600 flex items-center gap-2"> Danger Zone</h3>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-red-600/80 leading-relaxed text-left">
                        Once you delete your account, there is no going back. All your carbon reports, eco-actions, and credits will be permanently removed.
                    </p>
                    <form onSubmit={handleDeleteAccount} className="space-y-4">
                        <div className="text-left">
                            <label className="block text-xs font-bold text-red-400 uppercase mb-2">Confirm Password to Delete</label>
                            <input
                                type="password"
                                value={settingsDeletePass}
                                onChange={(e) => setSettingsDeletePass(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-red-100 rounded-xl text-sm focus:ring-2 focus:ring-red-200 outline-none placeholder:text-red-200 text-red-900"
                                placeholder="Enter your password to confirm"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={settingsLoading || !settingsDeletePass}
                                className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition-all text-sm shadow-md shadow-red-100"
                            >
                                {settingsLoading ? 'Deleting...' : 'Permanently Delete Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
