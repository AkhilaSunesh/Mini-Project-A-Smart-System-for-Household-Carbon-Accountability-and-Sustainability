import React, { useEffect, useState } from 'react';
import { getAdminSubmissions, reviewSubmission, getProfile } from '../api';
import { ShieldCheck, CheckCircle, XCircle, Search, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminApproval = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pointsMap, setPointsMap] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Verify admin access
    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                const res = await getProfile();
                if (res.data.role !== 'admin') {
                    navigate('/dashboard');
                } else {
                    fetchSubmissions();
                }
            } catch (err) {
                navigate('/dashboard');
            }
        };
        verifyAdmin();
    }, [navigate]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const res = await getAdminSubmissions();
            setSubmissions(res.data);
            
            // Pre-fill points for unverified
            const pMap = {};
            res.data.forEach(sub => {
                if (sub.status === 'pending') pMap[sub.id] = sub.points || 10;
            });
            setPointsMap(pMap);
        } catch (err) {
            setError('Failed to fetch submissions.');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id, status) => {
        try {
            const data = { status };
            if (status === 'verified') {
                const pointsToAward = pointsMap[id] || 0;
                if (!pointsToAward) {
                    alert('Please enter points to award.');
                    return;
                }
                data.points = parseInt(pointsToAward, 10);
            }

            await reviewSubmission(id, data);
            
            // Re-fetch to update status
            fetchSubmissions();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to update submission');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary-100 p-3 rounded-xl text-primary-600">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-gray-900">Admin Approvals</h1>
                    <p className="text-gray-500 mt-1">Review and approve user eco-action submissions</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Action</th>
                                <th className="px-6 py-4 font-medium">Proof</th>
                                <th className="px-6 py-4 font-medium">Points</th>
                                <th className="px-6 py-4 font-medium">Current Status</th>
                                <th className="px-6 py-4 font-medium">Review</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(sub.submitted_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        @{sub.username}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{sub.title}</div>
                                        <div className="text-sm text-gray-500 capitalize">{sub.category}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {sub.proof_image ? (
                                            <a href={sub.proof_image} target="_blank" rel="noopener noreferrer">
                                                <img src={sub.proof_image} alt="proof" className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition cursor-pointer" />
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400">No Image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {sub.status === 'pending' ? (
                                            <input
                                                type="number"
                                                min="1"
                                                value={pointsMap[sub.id] || ''}
                                                onChange={(e) => setPointsMap({ ...pointsMap, [sub.id]: e.target.value })}
                                                className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                            />
                                        ) : (
                                            <span className="font-medium text-gray-900">{sub.points}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                            sub.status === 'verified' ? 'bg-green-100 text-green-700' :
                                            sub.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        {sub.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleReview(sub.id, 'verified')}
                                                    className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleReview(sub.id, 'rejected')}
                                                    className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        {sub.status !== 'pending' && (
                                            <span className="text-sm text-gray-400 italic">Reviewed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {submissions.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-lg font-medium text-gray-600">No submissions found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminApproval;
