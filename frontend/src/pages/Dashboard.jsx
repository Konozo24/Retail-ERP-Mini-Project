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
import { DollarSign, ShoppingCart, Users, AlertTriangle } from 'lucide-react';
import { useGetDashboardStatistics } from "../api/dashboard.api";

const Dashboard = () => {
    // --- DATA ---
    const { data: statistics, isLoading } = useGetDashboardStatistics();

    if (isLoading) return <div>Loading data...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <div className="text-sm text-muted-foreground mt-1">
                    Welcome back! Here's your business overview.
                </div>
            </div>

            {/* --- Top Stats Row --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card p-5 rounded-lg border border-green-500/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <h3 className="text-xl font-bold text-foreground">{"RM " + ((statistics.totalRevenue.value || 0)).toLocaleString("en-MY", { minimumFractionDigits: 2 })}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{statistics.totalRevenue.changePercentage}% from last month</p>
                    </div>
                </div>

                <div className="bg-card p-5 rounded-lg border border-blue-500/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <h3 className="text-xl font-bold text-foreground">{"+" + statistics.sales.value}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{statistics.sales.changePercentage}% from last month</p>
                    </div>
                </div>

                <div className="bg-card p-5 rounded-lg border border-orange-500/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">New Customers</p>
                        <h3 className="text-xl font-bold text-foreground">{"+" + statistics.newCustomers.value}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{statistics.newCustomers.changePercentage}% from last month</p>
                    </div>
                </div>

                <div className="bg-card p-5 rounded-lg border border-red-400/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Low Stock Items</p>
                        <h3 className="text-xl font-bold text-foreground">{statistics.lowStockItems}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{statistics.lowStockItems > 0 ? "Requires attention" : "Stocks are good"}</p>
                    </div>
                </div>
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
                                    tickFormatter={(value) => `${((value || 0)).toLocaleString("en-MY")}`}
                                    //label={{ value: 'Total [RM]', fontSize: 12, position: 'insideLeft', dx: -4, dy: 24, angle: -90 }}
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
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
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
                                    style={{ backgroundColor: item.color }}
                                />
                                {item.percentage}%
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;