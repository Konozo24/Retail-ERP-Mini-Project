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
import { useGetDashboardStatistics } from "../api/dashboard.api";

const categoryColourMap = {
  Smartphone: '#4F46E5',
  Tablet: '#1F2937',
  Laptop: '#EAB308',
  Home: '#F97316',
  Others: '#8B5CF6',
};

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
    // --- DATA ---
    const { data: statistics, isLoading } = useGetDashboardStatistics();

    if (isLoading) return <div>Loading data...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Dashboard</h1>

            {/* --- Top Stats Row --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={"$" + statistics.totalRevenue.value}
                    subtext={statistics.totalRevenue.changePercentage + "% from last month"}
                    icon={DollarSign}
                />
                <StatCard
                    title="Sales"
                    value={"+" + statistics.sales.value}
                    subtext={statistics.sales.changePercentage + "% from last month"}
                    icon={ShoppingCart}
                />
                <StatCard
                    title="New Customers"
                    value={"+" + statistics.newCustomers.value}
                    subtext={statistics.newCustomers.changePercentage + "% from last month"}
                    icon={Users}
                />

                {/* REPLACED CARD: Low Stock Alerts */}
                <StatCard
                    title="Low Stock Items"
                    value={statistics.lowStockItems}
                    subtext={statistics.lowStockItems > 0 ? "Requires attention immediately" : "Stocks are enough"}
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
                            <BarChart data={statistics.overview}>
                                <XAxis
                                    dataKey="month"
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
                                    data={statistics.topCategories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={0}
                                    dataKey="total"
                                    nameKey="category"
                                >
                                    {statistics.topCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={categoryColourMap[entry.category] || "#FFFFFF"} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center gap-4 mt-4 flex-wrap">
                        {statistics.topCategories.map((item) => (
                            <div key={item.category} className="flex items-center text-sm text-gray-600">
                                <span
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: categoryColourMap[item.category] || "#FFFFFF" }}
                                />
                                {item.total}%
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;