// src/pages/Products.jsx

import React, { useState } from 'react';
import '../App.css'; 
import { LayoutDashboard, Package, ShoppingBag, Users, Brain, Search, Truck } from 'lucide-react';

// --- MOCK PRODUCT DATA ---
const PRODUCTS = [
  { id: 1, name: "Mechanical Keyboard", price: 129.99, desc: "A high-performance mechanical keyboard with customizable RGB lighting and programmable macro keys.", image: 'keyboard.jpg' },
  { id: 2, name: "Ergonomic Wireless Mouse", price: 79.99, desc: "An ergonomic mouse designed for comfort and precision, featuring a long-lasting battery and multiple connectivity options.", image: 'mouse.jpg' },
  { id: 3, name: "27\" 4K UHD Monitor", price: 449.99, desc: "A stunning 27-inch 4K monitor with vibrant colors and sharp details, perfect for creative professionals and gamers.", image: 'monitor.jpg' },
  { id: 4, name: "Noise-Cancelling Headphones", price: 149.99, desc: "Immersive sound and superior noise cancellation for an unparalleled listening experience.", image: 'headphones.jpg' },
  { id: 5, name: "1080p HD Webcam", price: 59.99, desc: "Crystal clear video and wide-angle lens for professional video conferencing and streaming.", image: 'webcam.jpg' },
  { id: 6, name: "13\" Ultrabook Laptop", price: 999.99, desc: "Sleek, lightweight, and powerful laptop designed for maximum productivity on the go.", image: 'laptop.jpg' },
];

// --- FAKE IMAGE PLACEHOLDERS ---
const getImageUrl = (fileName) => {
    const base = 'https://via.placeholder.com/250x150?text=';
    return `${base}${encodeURIComponent(fileName.split('.')[0].replace(/\s/g, '+'))}`;
};


// --- SIDEBAR COMPONENT ---
const Sidebar = () => (
  <div className="sidebar">
    <div className="sidebar-logo">
      <Package size={24} color="#3b82f6" />
      <span>RetailFlow</span>
    </div>
    <nav className="sidebar-nav">
      {[{ icon: LayoutDashboard, name: 'Dashboard' },
       { icon: Package, name: 'Products', active: true },
       { icon: Truck, name: 'Inventory' },
       { icon: ShoppingBag, name: 'Orders' },
       { icon: Users, name: 'Customers' },
       { icon: Brain, name: 'Replenishment AI' }
      ].map(item => (
        <a 
          key={item.name} 
          href="#" 
          className={`nav-item ${item.active ? 'active' : ''}`}
        >
          <item.icon size={18} />
          {item.name}
        </a>
      ))}
    </nav>
  </div>
);


// --- MAIN PAGE COMPONENT ---
const Products = () => {
  const [search, setSearch] = useState("");

  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <header className="main-header">
          <h1>Product Catalog</h1>
          <div className="search-bar-container">
            <Search size={18} color="#666" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="product-catalog-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={getImageUrl(product.image)} alt={product.name} />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.desc}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <button className="add-to-cart-btn">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;