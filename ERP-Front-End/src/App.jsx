// src/App.jsx


import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import LowStocks from "./pages/LowStocks";
import Category from "./pages/Category";
import PrintBarcode from "./pages/PrintBarcode";

// Placeholder Components for Routes (Testing Only)

// Main
const Dashboard = () => <div className="p-4 text-2xl font-bold">Dashboard Overview</div>;


// Stock
const ManageStock = () => <div className="p-4 text-2xl font-bold">Manage Stock Adjustments</div>;
const PurchaseOrder = () => <div className="p-4 text-2xl font-bold">Purchase Orders</div>;

// Sales
const Sales = () => <div className="p-4 text-2xl font-bold">Sales History</div>;

// Peoples
const Customers = () => <div className="p-4 text-2xl font-bold">Customer List</div>;
const Suppliers = () => <div className="p-4 text-2xl font-bold">Supplier List</div>;


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

          {/* Default redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* --- Main --- */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* --- Inventory --- */}
          <Route path="/products" element={<Products />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/low-stocks" element={<LowStocks />} />
          <Route path="/category" element={<Category />} />
          <Route path="/print-barcode" element={<PrintBarcode />} />

          {/* --- Stock --- */}
          <Route path="/manage-stock" element={<ManageStock />} />
          <Route path="/purchase-order" element={<PurchaseOrder />} />

          {/* --- Sales --- */}
          <Route path="/sales" element={<Sales />} />

          {/* --- Peoples --- */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/suppliers" element={<Suppliers />} />

        </Route>

        {/* Login Page (No Sidebar) */}
        <Route path="/login" element={<div className="flex items-center justify-center h-screen">Login Page</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
