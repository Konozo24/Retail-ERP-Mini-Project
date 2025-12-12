import React from "react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import {
    Search,
    ChevronsLeft,
    ChevronsRight,
    Monitor,
    Maximize,
    Bell,
    Settings,
    Globe,
} from "lucide-react";

const Topbar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();

    const { logout } = useAuth();

    return (
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 gap-4">

            {/* LEFT SECTION: Toggle & Search */}
            <div className="flex items-center gap-4 flex-1">

                {/* Sidebar Toggle Button (Orange) */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-accent hover:bg-accent/90 transition-colors shadow-sm shrink-0"
                >
                    {sidebarOpen ? (
                        <ChevronsLeft className="w-5 h-5 text-white" />
                    ) : (
                        <ChevronsRight className="w-5 h-5 text-white" />
                    )}
                </button>

                {/* Search Bar */}
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* RIGHT SECTION: Actions & Profile */}
            <div className="flex items-center gap-3 sm:gap-4">

                {/* POS Button (Dark Blue) */}
                <button
                    onClick={() => navigate("/pos")}
                    className="hidden sm:flex items-center gap-2 bg-[#0B1E3D] text-white px-4 py-2 rounded-md hover:bg-[#0B1E3D]/90 transition-colors text-sm font-medium"
                >
                    <Monitor className="w-4 h-4" />
                    <span>POS</span>
                </button>


                {/* Fullscreen */}
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors hidden sm:block">
                    <Maximize className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors relative">
                    <Bell className="w-5 h-5" />
                    {/* Notification Dot */}
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
                </button>

                {/* Settings */}
                <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                    <Settings className="w-5 h-5" />
                </button>

                {/* User Profile */}
                <button 
                    onClick={logout}
                    className="ml-2 w-9 h-9 rounded-lg overflow-hidden border border-border cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                >
                    <img
                        src="https://github.com/shadcn.png"
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </button>
            </div>
        </header>
    );
};

export default Topbar;