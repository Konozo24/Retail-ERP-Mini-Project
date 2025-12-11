import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DollarSign, ShoppingCart, Users, AlertTriangle } from 'lucide-react'; // Import AlertTriangle

// --- Mock Data ---
const overviewData = [
  { name: 'Jan', total: 4000 },
  { name: 'Feb', total: 3000 },
  { name: 'Mar', total: 5000 },
  { name: 'Apr', total: 4500 },
  { name: 'May', total: 6000 },
  { name: 'Jun', total: 5500 },
  { name: 'Jul', total: 7000 },
  { name: 'Aug', total: 6500 },
  { name: 'Sep', total: 7500 },
  { name: 'Oct', total: 8000 },
  { name: 'Nov', total: 9000 },
  { name: 'Dec', total: 11000 },
];

const categoryData = [
  { name: 'Electronics', value: 45, color: '#4F46E5' }, 
  { name: 'Clothing', value: 15, color: '#1F2937' },    
  { name: 'Home', value: 10, color: '#EAB308' },        
  { name: 'Sports', value: 5, color: '#F97316' },       
  { name: 'Others', value: 25, color: '#8B5CF6' },      
];

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, subtext, icon: Icon, iconColor, bgColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${bgColor || 'bg-gray-50'}`}>
        <Icon className={`w-5 h-5 ${iconColor || 'text-gray-500'}`} />
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-2">
      {subtext}
    </p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Dashboard</h1>

      {/* --- Top Stats Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value="$1,179.93" 
          subtext="+20.1% from last month" 
          icon={DollarSign} 
        />
        <StatCard 
          title="Sales" 
          value="+6" 
          subtext="+180.1% from last month" 
          icon={ShoppingCart} 
        />
        <StatCard 
          title="New Customers" 
          value="+4" 
          subtext="+19% from last month" 
          icon={Users} 
        />
        
        {/* REPLACED CARD: Low Stock Alerts */}
        <StatCard 
          title="Low Stock Items" 
          value="12" 
          subtext="Requires attention immediately" 
          icon={AlertTriangle}
          iconColor="text-red-500" // Red icon for urgency
          bgColor="bg-red-50"      // Light red background
        />
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Overview Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  dataKey="total" 
                  radius={[4, 4, 0, 0]} 
                  className="fill-primary" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Categories</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center text-sm text-gray-600">
                <span 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                {item.value}%
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;