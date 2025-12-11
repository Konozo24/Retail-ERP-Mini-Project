import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import LowStocks from "./pages/LowStocks";
import Category from "./pages/Category";
import Suppliers from "./pages/Suppliers";
import CreateSupplier from "./pages/CreateSupplier";
// Placeholder Components for Routes (Testing Only)

// Main
const Dashboard = () => <div className="p-4 text-2xl font-bold">Dashboard Overview</div>;

// Inventory
const PrintBarcode = () => <div className="p-4 text-2xl font-bold">Print Barcodes</div>;

// Stock
const ManageStock = () => <div className="p-4 text-2xl font-bold">Manage Stock Adjustments</div>;
const PurchaseOrder = () => <div className="p-4 text-2xl font-bold">Purchase Orders</div>;

// Sales
const Sales = () => <div className="p-4 text-2xl font-bold">Sales History</div>;

// Peoples
const Customers = () => <div className="p-4 text-2xl font-bold">Customer List</div>;

import { useEffect } from "react";
import { loginAPI, registerAPI, getUserByIdAPI } from "../api/users";
const callApi = async () => {
  try {
    let token;

    // Check if token exists
    const existingToken = localStorage.getItem("token");

    if (existingToken) {
      // Token exists → login
      const loginRes = await loginAPI({
        username: "string",
        rawPassword: "string"
      });
      token = loginRes.access_token;
      console.log("Logged in successfully");
    } else {
      // No token → register
      const registerRes = await registerAPI({
        username: "string",
        rawPassword: "string"
      });
      token = registerRes.access_token;
      localStorage.setItem("token", token);
      console.log("Registered and saved token");
    }

    // Fetch user info
    try {
      const userRes = await getUserByIdAPI(1);
      console.warn("User info:", JSON.stringify(userRes, null, 2));
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }

  } catch (error) {
    console.error("API call failed:", error);
  }
};

function App() {
       useEffect(() => {
        callApi()
    }, [])

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
                    <Route path="/create-supplier" element={<CreateSupplier />} />

                </Route>

                {/* Login Page (No Sidebar) */}
                <Route path="/login" element={<div className="flex items-center justify-center h-screen">Login Page</div>} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;