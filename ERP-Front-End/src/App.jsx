// src/App.jsx


import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import the new Context

// Components
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import LowStocks from "./pages/LowStocks";
import Category from "./pages/Category";
import PrintBarcode from "./pages/PrintBarcode";
import POS from "./pages/POS";
import ManageStock from "./Pages/ManageStock";
import EditManageStock from "./Pages/EditManageStock";
import PurchaseOrder from "./Pages/PurchaseOrder";

// --- Placeholder Components ---
import Suppliers from "./pages/Suppliers";
import CreateSupplier from "./pages/CreateSupplier";
// Placeholder Components for Routes (Testing Only)



// Stock

// Sales
const Sales = () => <div className="p-4 text-2xl font-bold">Sales History</div>;


// --- Protection Logic ---
const ProtectedRoute = () => {
  const { user } = useAuth(); // Use the context hook

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// --- Public Route Logic ---
// Redirects to dashboard if user tries to access /login while already logged in
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};



function App() {
  return (
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
              <Route path="/sales" element={<Sales />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/create-supplier" element={<CreateSupplier />} />
            </Route>

            {/* Fullscreen POS (no sidebar/header layout) */}
            <Route path="/pos" element={<POS />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
