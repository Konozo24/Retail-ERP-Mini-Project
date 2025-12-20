import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Use Link for navigation
import {
    LayoutGrid,
    Box,
    PlusSquare,
    TrendingDown,
    List,
    ScanBarcode,
    Layers,
    ClipboardList,
    ShoppingCart,
    Users,
    UserCog,
    ChevronDown,
    ShoppingBag,
} from "lucide-react";

// Menu Configuration
const menuItems = [
    {
        section: "Main",
        items: [
            { name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
        ],
    },
    {
        section: "Inventory",
        items: [
            { name: "Products", icon: Box, path: "/products" },
            { name: "Create Product", icon: PlusSquare, path: "/create-product" },
            { name: "Low Stocks", icon: TrendingDown, path: "/low-stocks" },
            { name: "Category", icon: List, path: "/category" },
            { name: "Print Barcode", icon: ScanBarcode, path: "/print-barcode" },
        ],
    },
    {
        section: "Stock",
        items: [
            { name: "Manage Stock", icon: Layers, path: "/manage-stock" },
            { name: "Purchase Order", icon: ClipboardList, path: "/purchase-order" },
        ],
    },
    {
        section: "Sales",
        items: [
            { name: "Sales", icon: ShoppingCart, path: "/sales" },
        ],
    },
    {
        section: "Peoples",
        items: [
            { name: "Customers", icon: Users, path: "/customers" },
            { name: "Suppliers", icon: UserCog, path: "/suppliers" },
        ],
    },
];

const Sidebar = ({ isCollapsed }) => {
    const location = useLocation(); // To track current URL

    return (
        <aside className={`h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ${isCollapsed ? "w-[70px]" : "w-64"}`}>

            {/* Logo Section */}
            <div className={`h-16 flex items-center border-b border-sidebar-border/50 mb-4 ${isCollapsed ? "justify-center px-0" : "px-6"}`}>
                <Link to={"/dashboard"} className="flex items-center gap-2 font-bold text-xl overflow-hidden whitespace-nowrap">
                    <ShoppingBag className="w-8 h-8 text-primary shrink-0" />
                    {/* Hide text when collapsed */}
                    <span className={`text-sidebar-foreground transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"}`}>
                        Retail<span className="text-accent">Flow</span>
                    </span>
                </Link>
            </div>

            {/* Scrollable Menu Area */}
            <div className="flex-1 overflow-y-auto py-2 custom-scrollbar overflow-x-hidden">
                {menuItems.map((section, index) => (
                    <div key={index} className="mb-6">

                        {/* Section Header - Hide when collapsed */}
                        {!isCollapsed && (
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-6 truncate">
                                {section.section}
                            </h3>
                        )}

                        {/* Section Items */}
                        <div className="space-y-1 px-3">
                            {section.items.map((item) => {
                                // Check if this item is currently active based on URL or state
                                const isActive = location.pathname === item.path;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        to={item.path}
                                        key={item.name}
                                        onClick={() => setActiveItem(item.name)}
                                        className={`
                      flex items-center rounded-md text-sm font-medium transition-colors duration-200
                      ${isCollapsed ? "justify-center px-2 py-2.5" : "justify-between px-3 py-2.5"}
                      ${isActive
                                                ? "bg-accent/10 text-accent" // Active: Orange tint using --accent
                                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" // Inactive
                                            }
                    `}
                                        title={isCollapsed ? item.name : ""} // Show tooltip on hover if collapsed
                                    >
                                        <div className={`flex items-center ${isCollapsed ? "gap-0" : "gap-3"}`}>
                                            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />

                                            {/* Text Label - Hide if collapsed */}
                                            <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}>
                                                {item.name}
                                            </span>
                                        </div>

                                        
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>


        </aside>
    );
};

export default Sidebar;