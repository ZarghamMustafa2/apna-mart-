import React from 'react';

export const AnalyticsOverview: React.FC = () => {
  const chartData = [
    { day: 'Mon', revenue: 45000, sales: 12 },
    { day: 'Tue', revenue: 68000, sales: 18 },
    { day: 'Wed', revenue: 92000, sales: 24 },
    { day: 'Thu', revenue: 54000, sales: 15 },
    { day: 'Fri', revenue: 110000, sales: 29 },
    { day: 'Sat', revenue: 145000, sales: 38 },
    { day: 'Sun', revenue: 128000, sales: 32 },
  ];

  const maxRev = Math.max(...chartData.map((d) => d.revenue));

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Performance</span>
          <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">Revenue & Sales Distribution</h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-brand-600">
            <span className="w-3 h-3 rounded-full bg-brand-600" />
            Revenue (Rs.)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            Orders Count
          </span>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-56 flex items-end justify-between gap-2 pt-6">
        {chartData.map((data, idx) => {
          const heightPercent = Math.round((data.revenue / maxRev) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Rs. {(data.revenue / 1000).toFixed(0)}k
              </div>

              <div className="w-full bg-gray-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full relative">
                <div
                  className="w-full bg-gradient-to-t from-brand-700 to-brand-500 rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              <span className="text-xs font-bold text-gray-600">{data.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
