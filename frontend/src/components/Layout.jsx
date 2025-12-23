import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageLoader from "./ui/PageLoader";

const Layout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(() => {
		const saved = localStorage.getItem("sidebarOpen");
		return saved !== null ? JSON.parse(saved) : true;
	});
	const [isLoading, setIsLoading] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		// Trigger loading when URL changes
		setIsLoading(true);

		// Stop loading after 800ms 
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 800); // 800ms loading duration

		return () => clearTimeout(timer);
	}, [location.pathname]);

	useEffect(() => {
		localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
	}, [sidebarOpen]);


	return (
		<div className="flex h-screen w-full bg-muted/40 relative">

			{/* --- FULL SCREEN LOADER OVERLAY --- 
          - fixed inset-0: Stretches it to cover the whole viewport
          - z-[9999]: Ensures it sits on top of EVERYTHING (Sidebar, Topbar, Modals)
          - bg-background: Solid color so you can't see the page changing behind it
      */}
			{isLoading && (
				<div className="fixed inset-0 z-9999 bg-background flex items-center justify-center">
					<PageLoader />
				</div>
			)}

			{/* --- NORMAL APP LAYOUT --- */}
			{/* We keep this rendered behind the loader so the page is ready when the loader vanishes */}

			<div
				className={`shrink-0 transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-[70px]"
					}`}
			>
				<Sidebar isCollapsed={!sidebarOpen} />
			</div>

			<div className="flex flex-col flex-1 h-full overflow-hidden">

				<Topbar
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
					navigate={navigate}
					currentPath={location.pathname}
				/>

				<main className="flex-1 overflow-y-auto p-6 bg-background">
					{/* Add a subtle fade-in animation to the content once revealed */}
					<div className={!isLoading ? "animate-in fade-in zoom-in-95 duration-500" : ""}>
						<Outlet />
					</div>
				</main>

			</div>
		</div>
	);
};

export default Layout;