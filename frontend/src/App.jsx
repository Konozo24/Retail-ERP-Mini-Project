// src/App.jsx


import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';

// ui
import PageLoader from "./components/ui/PageLoader";

// Components
import Layout from "./components/Layout";
import LoginPage from './pages/LoginPage'
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import LowStocks from "./pages/LowStocks";
import Category from "./pages/Category";
import PrintBarcode from "./pages/PrintBarcode";
import POS from "./pages/POS";
import PurchaseOrderDetails from "./pages/PurchaseOrderDetails";
import ManageStock from "./pages/ManageStock";
import Dashboard from "./pages/Dashboard";
import PurchaseOrder from "./pages/PurchaseOrder";
import Suppliers from "./pages/Suppliers";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";


// --- Protection Logic ---
const ProtectedRoute = () => {
    const { isLoggedIn, isLoading } = useAuth(); // Use the context hook

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-9999 bg-background flex items-center justify-center">
                <PageLoader />
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

// --- Public Route Logic ---
// Redirects to dashboard if user tries to access /login while already logged in
const PublicRoute = ({ children }) => {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return (
             <div className="fixed inset-0 z-9999 bg-background flex items-center justify-center">
                <PageLoader />
            </div>
        );
    }

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>

                        {/* Public Route: Login */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            {/* Admin layout routes */}
                            <Route element={<Layout />}>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/create-product" element={<CreateProduct />} />
                                <Route path="/low-stocks" element={<LowStocks />} />
                                <Route path="/category" element={<Category />} />
                                <Route path="/print-barcode" element={<PrintBarcode />} />
                                <Route path="/manage-stock" element={<ManageStock />} />
                                <Route path="/purchase-order" element={<PurchaseOrder />} />
                                <Route path="/purchase-order-details" element={<PurchaseOrderDetails />} />
                                <Route path="/sales" element={<Sales />} />
                                <Route path="/customers" element={<Customers />} />
                                <Route path="/suppliers" element={<Suppliers />} />
                                <Route path="/settings" element={<Settings />} />
                            </Route>

                            {/* Fullscreen POS (no sidebar/header layout) */}
                            <Route path="/pos" element={<POS />} />
                        </Route>

                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
