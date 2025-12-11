// src/pages/POS.jsx

import React, { useState } from 'react';
import '../App.css'; 
import { Search, Bell, Settings, User, ShoppingCart, Truck, Brain, Package, Users, ShoppingBag, ArrowUp, X, RefreshCcw, Pause, ChevronRight, Menu, Grid, Heart, Tag } from 'lucide-react';

// --- MOCK PRODUCT DATA: Apple Products ---
const PRODUCTS = [
  { id: 1, name: "iPhone 16 Pro Max", price: 1199.00, qty: 1, desc: "A18 Bionic, ProMotion display.", image: 'iphone.jpg', category: 'Mobiles' },
  { id: 2, name: "AirPods Pro (2nd Gen)", price: 249.00, qty: 1, desc: "ANC, Adaptive Transparency.", image: 'airpods.jpg', category: 'Headphones' },
  { id: 3, name: "MacBook Pro 14\" M3", price: 1999.00, qty: 1, desc: "M3 Pro chip, 14-inch display.", image: 'macbook.jpg', category: 'Computer' },
  { id: 4, name: "Apple Watch Ultra 3", price: 799.00, qty: 1, desc: "Rugged, massive battery.", image: 'watch.jpg', category: 'Watches' },
  { id: 5, name: "iPad Air M2 (11-inch)", price: 599.00, qty: 1, desc: "M2 chip, lightweight.", image: 'ipad.jpg', category: 'Tablet' },
  { id: 6, name: "HomePod Mini", price: 99.00, qty: 1, desc: "Small, smart speaker.", image: 'homepod.jpg', category: 'Speaker' },
];

const getImageUrl = (fileName) => {
    // This will now show the product name
    const base = 'https://via.placeholder.com/250x150?text=';
    return `${base}${encodeURIComponent(fileName.split('.')[0].replace(/\s/g, '+'))}`;
};

// --- Top Navigation Bar Component (Styled to match the image) ---
const TopBar = () => (
    <header className="top-bar">
        <div className="top-bar-left">
            <div className="top-bar-logo">
                <ShoppingCart size={24} color="#3b82f6" />
                <span>DREAMS</span>
            </div>
            <div className="top-bar-time">
                <span className="time-display">09:25:32</span>
            </div>
        </div>
        
        <div className="top-bar-center">
            <button className="top-bar-button dashboard-btn">
                <Grid size={16} /> Dashboard
            </button>
            <button className="top-bar-button freshmart-btn">Freshmart</button>
        </div>

        <div className="top-bar-controls">
            <span className="control-icon orange-bg"><Heart size={16} color="white" /></span>
            <span className="control-icon orange-bg"><Tag size={16} color="white" /></span>
            <span className="control-icon"><Bell size={20} color="#666" /></span>
            <span className="control-icon"><Settings size={20} color="#666" /></span>
            <span className="control-icon"><User size={20} color="#666" /></span>
        </div>
    </header>
);

// --- Left Order Panel (Sidebar) Component ---
const OrderPanel = () => (
    <div className="order-panel">
        <div className="profile-card">
            <img src={getImageUrl('Wesley Adrian')} alt="Profile" className="profile-img"/>
            <div>
                <p className="welcome-text">Welcome, Wesley Adrian</p>
                <p className="date-text">December 24, 2024</p>
            </div>
        </div>
        
        <ul className="category-list">
            <li className="category-item active"><Truck size={18} /> All</li>
            <li className="category-item"><ArrowUp size={18} /> Headset</li>
            <li className="category-item"><ShoppingBag size={18} /> Shoes</li>
            <li className="category-item"><Menu size={18} /> Mobiles</li>
            <li className="category-item"><Settings size={18} /> Watches</li>
            <li className="category-item"><LayoutDashboard size={18} /> Laptops</li>
        </ul>
    </div>
);

// --- Product Card Component ---
const ProductCard = ({ product }) => (
    <div className="product-card-pos">
        <div className="card-top">
            <img src={getImageUrl(product.name)} alt={product.name} className="product-img-pos" />
            {/* Using the static 64GB / Pro designation for styling */}
        </div>
        <h4>{product.name}</h4>
        <p className="product-desc-pos">{product.desc.split(',')[0]}</p>
        <div className="card-footer-pos">
            <span className="price-pos">${product.price.toFixed(2)}</span>
            <div className="qty-controls">
                 <button className="qty-btn">-</button>
                 <span className="qty-display">{product.qty}</span>
                 <button className="qty-btn">+</button>
            </div>
        </div>
    </div>
);

// --- Order List / Details Panel (Right Sidebar) Component ---
const OrderDetailsPanel = ({ total = 1199.00 }) => (
    <div className="order-details-panel">
        <h3 className="order-list-header">Order List <span className="order-id">#ORD0123</span></h3>
        
        {/* Customer Info */}
        <div className="customer-info-box">
            <User size={18} /> Customer Information <ChevronRight size={18} />
        </div>

        {/* Loyalty Section (Simulated) */}
        <div className="loyalty-box">
            <img src={getImageUrl('James Anderson')} alt="Customer" className="customer-avatar" />
            <div className="loyalty-text">
                <span>James Anderson</span>
                <span className="loyalty-status">Bonus <span className="bonus-amount">148</span> Loyalty <span className="loyalty-amount">$20</span></span>
            </div>
            <button className="apply-btn">Apply</button>
        </div>

        {/* Order Details List */}
        <h4 className="order-details-subheading">Order Details <span>Items: 3</span> <button className="clear-btn-small">Clear all</button></h4>

        {/* MOCK ITEMS (Simulated based on image) */}
        <div className="order-item">
            <span>iPhone 14 64GB</span>
            <div className="item-qty-cost">
                <span className="item-qty">1</span>
                <span className="item-cost">$15800</span>
                <X size={16} className="remove-item" />
            </div>
        </div>
        <div className="order-item">
            <span>Red Nike Angelo</span>
            <div className="item-qty-cost">
                <span className="item-qty">4</span>
                <span className="item-cost">$398</span>
                <X size={16} className="remove-item" />
            </div>
        </div>
        <div className="order-item">
            <span>iPadPad Slim 3i</span>
            <div className="item-qty-cost">
                <span className="item-qty">4</span>
                <span className="item-cost">$3000</span>
                <X size={16} className="remove-item" />
            </div>
        </div>
        
        {/* Discount Box */}
        <div className="discount-box">
            <p>Discount 5%</p>
            <p className="discount-note">For $20 Minimum Purchase, all items</p>
            <X size={16} className="remove-discount" />
        </div>

        {/* Payments Section */}
        <h4 className="payment-header">Payments</h4>
        <div className="payment-line"><span>Subtotal</span><span>$20000.00</span></div>
        <div className="payment-line"><span>Discount</span><span>-$1000.00</span></div>
        <div className="payment-line total"><span>Total</span><span>$19000.00</span></div>

        {/* Footer Control Buttons */}
        <div className="control-buttons-footer">
            <button className="footer-btn hold"><Pause size={20} /> Hold</button>
            <button className="footer-btn void"><X size={20} /> Void</button>
            <button className="footer-btn payment"><ShoppingBag size={20} /> Payment</button>
            <button className="footer-btn view-orders"><Truck size={20} /> View Orders</button>
            <button className="footer-btn reset"><RefreshCcw size={20} /> Reset</button>
            <button className="footer-btn transaction"><Tag size={20} /> Transaction</button>
        </div>
    </div>
);


// --- MAIN APPLICATION COMPONENT ---
const Products = () => {
  const [search, setSearch] = useState("");

  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pos-app-container">
      <TopBar />
      <div className="pos-main-layout">
        <OrderPanel /> {/* Left Category Sidebar */}
        
        <div className="product-grid-main"> {/* Center Content */}
            <div className="product-grid-header">
                <h2>Welcome, Wesley Adrian</h2>
                <div className="search-and-buttons">
                    <div className="main-search-bar">
                        <Search size={18} color="#999" />
                        <input type="text" placeholder="Search Product" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <button className="view-brands-btn">View All Brands</button>
                    <button className="featured-btn">Featured</button>
                </div>
            </div>
            
            <div className="product-grid-catalog">
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            
        </div>
        
        <OrderDetailsPanel /> {/* Right Order Sidebar */}
      </div>
    </div>
  );
};

export default Products;