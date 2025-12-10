import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";
import PageLoader from "./ui/PageLoader";

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // --- LOADER LOGIC ---
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation(); // Tracks the current URL

    useEffect(() => {
        // 1. Start Loading when URL changes
        setIsLoading(true);

        // 2. Stop Loading after a short delay (e.g., 500ms)
        // This creates that "smooth" transaction feel
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [location.pathname]); // Run this effect whenever the path changes

    return (
        <div className="flex h-screen w-full bg-muted/40">

            <div
                className={`shrink-0 transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-[70px]"
                    }`}
            >
                <Sidebar isCollapsed={!sidebarOpen} />
            </div>

            <div className="flex flex-col flex-1 h-full overflow-hidden">

                <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto p-6 bg-background relative">

                    {/* 3. Conditional Rendering */}
                    {isLoading ? (
                        <PageLoader />
                    ) : (
                        // The <Outlet /> renders the actual page (Dashboard, Products, etc.)
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Outlet />
                        </div>
                    )}

                </main>

            </div>
        </div>
    );
};

export default Layout;