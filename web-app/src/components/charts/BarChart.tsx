import React from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
  barColor?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, barColor = 'bg-brand-primary' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        No data available for this period.
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

  return (
    <div className="flex justify-around items-end h-64 space-x-2 pt-4 border-t">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 h-full justify-end">
          <div
            className={`w-full ${barColor} rounded-t-md hover:opacity-80 transition-opacity duration-200`}
            style={{ height: `${(item.value / maxValue) * 100}%` }}
            title={`₹${item.value.toFixed(2)} on ${item.label}`}
          ></div>
          <span className="text-xs font-medium text-slate-500 mt-2 truncate">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
