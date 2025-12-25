import React, { useMemo, useRef, useState } from "react";
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

// Path for quick navigation links
const QUICK_LINKS = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Products", path: "/products" },
    { label: "Create Product", path: "/create-product" },
    { label: "Low Stocks", path: "/low-stocks" },
    { label: "Category", path: "/category" },
    { label: "Print Barcode", path: "/print-barcode" },
    { label: "Manage Stock", path: "/manage-stock" },
    { label: "Purchase Order", path: "/purchase-order" },
    { label: "Purchase Order History", path: "/purchase-order-history" },
    { label: "Sales", path: "/sales" },
    { label: "Customers", path: "/customers" },
    { label: "Suppliers", path: "/suppliers" },
    { label: "POS", path: "/pos" },
    { label: "Settings", path: "/settings" },
];

const Topbar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();

    const searchInputRef = useRef(null);

    const {logout} = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [openSuggestions, setOpenSuggestions] = useState(false);

    const filteredLinks = useMemo(() => {
        if (!searchTerm.trim()) return QUICK_LINKS;
        const q = searchTerm.toLowerCase();
        return QUICK_LINKS.filter(link => link.label.toLowerCase().includes(q));
    }, [searchTerm]);

    const handleNavigate = (path) => {
        navigate(path);
        setSearchTerm("");
        setOpenSuggestions(false);

        searchInputRef.current?.blur();
    };

    const handleSearchKey = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const target = filteredLinks[0];
            if (target) {
                handleNavigate(target.path);
            }
        } else if (e.key === "Escape") {
            setOpenSuggestions(false);
        }
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

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
                        ref={searchInputRef}
                        type="text"
                        placeholder="Type a page: dashboard, purchase order…"
                        className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setOpenSuggestions(true); }}
                        onKeyDown={handleSearchKey}
                        onFocus={() => setOpenSuggestions(true)}
                        onBlur={() => setTimeout(() => setOpenSuggestions(false), 120)}
                    />
                    {openSuggestions && (
                        <div className="absolute mt-1 w-full bg-card border border-border rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
                            {filteredLinks.length === 0 ? (
                                <div className="px-3 py-2 text-xs text-muted-foreground">No matches</div>
                            ) : (
                                filteredLinks.map(link => (
                                    <button
                                        key={link.path}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleNavigate(link.path)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                                    >
                                        {link.label}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
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
                <button
                    onClick={handleFullscreen}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors hidden sm:block"
                >
                    <Maximize className="w-5 h-5" />
                </button>


                {/* Settings */}
                <button
                    onClick={() => navigate("/settings")}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                >
                    <Settings className="w-5 h-5" />
                </button>

                {/* User Profile */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="ml-2 w-9 h-9 rounded-lg overflow-hidden border border-border cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                    >
                        <img
                            src="https://github.com/shadcn.png"
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </button>
                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-md shadow-lg z-30">
                            <button
                                onClick={() => { setProfileOpen(false); logout(); }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;