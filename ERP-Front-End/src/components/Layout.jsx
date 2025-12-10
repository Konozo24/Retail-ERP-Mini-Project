import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";

const Layout = () => {
    // State: true = Full Width (256px), false = Mini Icon Mode (70px)
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-full bg-muted/40">

            {/* Sidebar Wrapper 
          - Controls the width of the sidebar container in the layout flow 
      */}
            <div
                className={`shrink-0 transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-[70px]"
                    }`}
            >
                <Sidebar isCollapsed={!sidebarOpen} />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">

                <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto p-6 bg-background">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default Layout;