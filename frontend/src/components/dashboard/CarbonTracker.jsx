import React from 'react';
import { Wind, Leaf, BarChart2, Edit, Trash2, Award } from 'lucide-react';
import { useDashboard } from './DashboardContext';
import { StackedBarChart } from './Charts';

const CarbonTracker = () => {
    const {
        carbonHistory, submissions, profile, editingId, resetCarbonForm,
        carbonMessage, handleCarbonSubmit, carbonForm, setCarbonForm,
        carbonLoading, thisWeekEmission, thisWeekOffset, trendsData,
        trendCategories, chartPeriod, handleEditLog, handleDeleteLog
    } = useDashboard();

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
                <h3 className="text-lg font-bold font-outfit text-primary-900 mb-1">{chartPeriod} Emission Trends</h3>
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
                                        <button onClick={() => handleEditLog(h)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit Activity">
                                            <Edit size={16} />
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

export default CarbonTracker;
