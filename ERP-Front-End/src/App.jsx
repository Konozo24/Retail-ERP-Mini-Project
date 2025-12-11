import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
// import { useAuth } from '../contexts/AuthContext';
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import LowStocks from "./pages/LowStocks";
import Category from "./pages/Category";

// --- 1. Placeholder Components (Kept same as your code) ---
const Dashboard = () => <div className="p-4 text-2xl font-bold">Dashboard Overview</div>;

// Inventory

const PrintBarcode = () => <div className="p-4 text-2xl font-bold">Print Barcodes</div>;

// Stock
const ManageStock = () => <div className="p-4 text-2xl font-bold">Manage Stock Adjustments</div>;
const PurchaseOrder = () => <div className="p-4 text-2xl font-bold">Purchase Orders</div>;

// Sales
const Sales = () => <div className="p-4 text-2xl font-bold">Sales History</div>;

// Peoples
const Suppliers = () => <div className="p-4 text-2xl font-bold">Supplier List</div>;


// --- 2. The Protection Logic ---
// This component wraps your main app. It checks for a token/user.
const ProtectedRoute = () => {
  // In a real app, you might check Redux state or a Context here.
  // For now, we check if a flag exists in localStorage.
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  // If not logged in, redirect to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child routes (The Layout and Dashboard)
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- Public Route: Login --- */}
        {/* Note: If user is ALREADY logged in, we might want to bump them to dashboard */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- Protected Routes --- */}
        {/* Everything inside here requires login */}
        <Route element={<ProtectedRoute />}>
          
          <Route element={<Layout />}>
            {/* Default redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Main */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Inventory */}
            <Route path="/products" element={<Products />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/low-stocks" element={<LowStocks />} />
            <Route path="/category" element={<Category />} />
            <Route path="/print-barcode" element={<PrintBarcode />} />

            {/* Stock */}
            <Route path="/manage-stock" element={<ManageStock />} />
            <Route path="/purchase-order" element={<PurchaseOrder />} />

            {/* Sales */}
            <Route path="/sales" element={<Sales />} />

            {/* Peoples */}
            <Route path="/customers" element={<Customers />} />
            <Route path="/suppliers" element={<Suppliers />} />
          </Route>
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;