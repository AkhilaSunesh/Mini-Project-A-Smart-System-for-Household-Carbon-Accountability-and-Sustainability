import React from 'react';
import { Upload, FileText, Check, Clock } from 'lucide-react';
import { useDashboard } from './DashboardContext';

const EcoActions = () => {
    const {
        submitMessage, handleSubmitEcoAction, submitForm, setSubmitForm,
        submitLoading, setSubmitFile, submitFile, submissions
    } = useDashboard();

    return (
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
};

export default EcoActions;
