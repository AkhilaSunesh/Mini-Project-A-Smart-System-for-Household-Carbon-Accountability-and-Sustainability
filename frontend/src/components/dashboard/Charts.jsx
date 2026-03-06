import React from 'react';

/* ─── Stacked Bar Chart (CSS + SVG) ─── */
export const StackedBarChart = ({ data, categories, height = 180 }) => {
    // Find max total to scale the chart
    const maxTotal = Math.max(...data.map(d => d.total), 60); // Use 60 as a minimum ceiling to match image
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
                                <div key={idx} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                                    <div className="w-full max-w-[40px] flex flex-col-reverse rounded-lg overflow-hidden transition-all duration-500 hover:brightness-95 bg-gray-50/50" style={{ height: `${Math.max((day.total / ceiling) * 100, 2)}%` }}>
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
            <div className="flex justify-center flex-wrap gap-10 mt-6">
                {categories.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-xs font-bold text-gray-500">{cat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── Donut Ring Chart ─── */
export const DonutChart = ({ value, total, color, label }) => {
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

export const CategoryBar = ({ icon: Icon, label, value, max, color }) => {
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
