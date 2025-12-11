// src/pages/POS.jsx

import React, { useState } from 'react';
import { 
  Search, Bell, Settings, User, ShoppingCart, Truck, Package, 
  Users, ShoppingBag, ArrowUp, X, RefreshCcw, Pause, ChevronRight, 
  Menu, Grid, Heart, Tag, LayoutDashboard, Calculator, Printer, Maximize,
  Headphones, Smartphone, Watch, Laptop, LayoutGrid 
} from 'lucide-react';

// --- MOCK PRODUCT DATA: Apple Products ---
const PRODUCTS = [
  { id: 1, name: "iPhone 16 Pro Max", price: 1199.00, qty: 12, desc: "A18 Bionic", image: 'iphone.jpg', category: 'Mobiles' },
  { id: 2, name: "AirPods Pro (2nd)", price: 249.00, qty: 54, desc: "ANC, MagSafe", image: 'airpods.jpg', category: 'Headset' },
  { id: 3, name: "MacBook Pro 14\"", price: 1999.00, qty: 8, desc: "M3 Pro Chip", image: 'macbook.jpg', category: 'Laptops' },
  { id: 4, name: "Apple Watch Ultra", price: 799.00, qty: 15, desc: "Titanium Case", image: 'watch.jpg', category: 'Watches' },
  { id: 5, name: "iPad Air M2", price: 599.00, qty: 22, desc: "11-inch Display", image: 'ipad.jpg', category: 'Mobiles' },
  { id: 6, name: "HomePod Mini", price: 99.00, qty: 30, desc: "Smart Speaker", image: 'homepod.jpg', category: 'Headset' },
  { id: 7, name: "Mac Studio", price: 1999.00, qty: 4, desc: "M2 Max", image: 'macstudio.jpg', category: 'Computer' },
  { id: 8, name: "Studio Display", price: 1599.00, qty: 6, desc: "5K Retina", image: 'display.jpg', category: 'Computer' },
];

// Helper for placeholder images
const getImageUrl = (text) => 
  `https://via.placeholder.com/150?text=${encodeURIComponent(text)}`;

// --- COMPONENTS ---

const TopBar = () => (
  <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
    {/* Left: Logo & Time */}
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 text-2xl font-bold text-primary">
        <div className="bg-primary/10 p-2 rounded-lg">
          <ShoppingCart size={24} className="text-primary" />
        </div>
        <span>Retail<span className="text-accent text-sm ml-1 font-medium">Flow</span></span>
      </div>
      <div className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-sm">
        09:25:32
      </div>
    </div>

    {/* Center: Dashboard & Dropdown */}
    <div className="flex items-center gap-3">
      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium">
        <LayoutDashboard size={18} /> Dashboard
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium">
        Freshmart <ChevronRight size={16} className="rotate-90" />
      </button>
    </div>

    {/* Right: Icons */}
    <div className="flex items-center gap-3">
      <button className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm">
        <Calculator size={18} />
      </button>
      <button className="w-10 h-10 bg-card border border-border text-muted-foreground rounded-full flex items-center justify-center hover:text-primary hover:border-primary transition-all">
        <Maximize size={18} />
      </button>
      <button className="w-10 h-10 bg-card border border-border text-muted-foreground rounded-full flex items-center justify-center hover:text-primary hover:border-primary transition-all">
        <Settings size={18} />
      </button>
      <div className="ml-2 w-10 h-10 rounded-full bg-muted overflow-hidden border border-border">
        <img src={getImageUrl("Admin")} alt="User" className="w-full h-full object-cover" />
      </div>
    </div>
  </header>
);

const Sidebar = () => {
  const categories = [
    { name: "All", icon: Grid, active: true },
    { name: "Headset", icon: Brain },
    { name: "Mobiles", icon: ShoppingBag },
    { name: "Watches", icon: Tag },
    { name: "Laptops", icon: LayoutDashboard },
  ];

  return (
    <aside className="w-24 bg-card border-r border-border flex flex-col items-center py-4 gap-2 shrink-0 h-full overflow-y-auto">
      {categories.map((cat) => (
        <button 
          key={cat.name}
          className={`w-20 h-20 flex flex-col items-center justify-center gap-2 rounded-xl transition-all ${
            cat.active 
              ? 'bg-primary/5 border border-primary text-primary' 
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <cat.icon size={24} />
          <span className="text-xs font-medium">{cat.name}</span>
        </button>
      ))}
    </aside>
  );
};

const ProductGrid = ({ search, setSearch }) => {
  const filtered = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 bg-background p-6 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, Ming Wei</h1>
          <p className="text-muted-foreground text-sm mt-1">Discover whatever you need easily</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search Product..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-64 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button className="px-4 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity">
            Featured
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 overflow-y-auto pr-2 pb-20">
        {filtered.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/50 transition-all group">
            <div className="aspect-[4/3] bg-muted rounded-lg mb-3 relative overflow-hidden">
              <img src={getImageUrl(product.name)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                {product.qty} Left
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-medium mb-1">{product.category}</div>
            <h3 className="font-bold text-foreground text-lg leading-tight mb-3">{product.name}</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">${product.price}</span>
              <button className="w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-sm">
                <ShoppingBag size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderDetails = () => (
  <aside className="w-[400px] bg-card border-l border-border flex flex-col shrink-0 h-full">
    <div className="p-6 border-b border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Order List</h2>
        <span className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs font-mono">#ORD-0123</span>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-muted-foreground">Customer</span>
          <button className="text-primary hover:underline text-sm font-semibold">Add New</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
            <User size={20} className="text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-foreground">Wesley Adrian</h4>
            <p className="text-xs text-green-600 font-medium">Balance: $120.00</p>
          </div>
        </div>
      </div>
    </div>

    {/* Cart Items */}
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {[
        { name: "iPhone 16 Pro Max", price: 1199.00, qty: 1 },
        { name: "AirPods Pro (2nd)", price: 249.00, qty: 2 },
        { name: "HomePod Mini", price: 99.00, qty: 1 }
      ].map((item, idx) => (
        <div key={idx} className="flex gap-4 group">
          <div className="w-16 h-16 bg-muted rounded-lg shrink-0">
            <img src={getImageUrl(item.name)} className="w-full h-full object-cover rounded-lg" alt="" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
              <span className="font-bold text-primary">${(item.price * item.qty).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">${item.price} / unit</div>
              <div className="flex items-center gap-3 bg-muted rounded-md px-2 py-1">
                <button className="text-muted-foreground hover:text-destructive text-sm font-bold">-</button>
                <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                <button className="text-primary hover:text-primary/80 text-sm font-bold">+</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Footer Total */}
    <div className="bg-muted/30 p-6 border-t border-border">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">$1,796.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (5%)</span>
          <span className="font-semibold">$89.80</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border mt-2">
          <span>Total</span>
          <span className="text-primary">$1,885.80</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="py-3 px-4 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 transition-opacity">
          Hold Order
        </button>
        <button className="py-3 px-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
          Pay Now
        </button>
      </div>
    </div>
  </aside>
);

// --- MAIN LAYOUT ---

const POS = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-foreground">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ProductGrid search={search} setSearch={setSearch} />
        <OrderDetails />
      </div>
    </div>
  );
};

export default POS;