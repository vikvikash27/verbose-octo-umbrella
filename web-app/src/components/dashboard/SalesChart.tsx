import React from 'react';
import Card from '../ui/Card';

interface SalesDataPoint {
    name: string;
    sales: number;
}
  
interface SalesChartProps {
    data?: SalesDataPoint[];
}

const defaultSalesData: SalesDataPoint[] = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

// A simple bar chart component to visualize sales data.
// In a real application, this would be replaced with a more robust charting library.
const SalesChart: React.FC<SalesChartProps> = ({ data = defaultSalesData }) => {
  const maxSales = Math.max(...data.map(d => d.sales), 1); // Avoid division by zero

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales Overview</h3>
      <div className="flex justify-around items-end h-64 space-x-4 pt-4 border-t">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-brand-primary rounded-t-md hover:bg-indigo-700 transition-all duration-300"
              style={{ height: `${(item.sales / maxSales) * 100}%` }}
              title={`Sales: ₹${item.sales}`}
            ></div>
            <span className="text-xs font-medium text-slate-500 mt-2">{item.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SalesChart;
