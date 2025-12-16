import React, { useMemo, useState } from 'react';
import { 
  Search, Bell, Settings, User, ShoppingCart, Truck, Package, 
  Users, ShoppingBag, ArrowUp, X, RefreshCcw, Pause, ChevronRight, 
  Menu, Grid, Heart, Tag, LayoutDashboard, Calculator, Printer, Maximize,
  Headphones, Smartphone, Watch, Laptop, LayoutGrid, RotateCw, RefreshCw, 
  LayoutList, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../data/mockData';

// --- HELPERS: Map backend data into POS card items ---
const mapProductToPosItem = (product) => {
  if (!product) return null;

  // `unit_price` may be a number or formatted string like "1,099.00"
  const rawPrice = product.unit_price ?? product.price ?? 0;
  const numericPrice =
    typeof rawPrice === 'number'
      ? rawPrice
      : parseFloat(rawPrice.toString().replace(/,/g, '')) || 0;

  return {
    id: product.id,
    name: product.name,
    price: numericPrice,
    qty: product.stock_qty ?? product.qty ?? 0,
    desc: product.description ?? product.desc ?? '',
    image:
      product.image ||
      product.image_url ||
      'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=400&q=80',
    category: product.category || 'Others',
  };
};

const getCategoryIcon = (category) => {
  const name = (category || '').toLowerCase();
  if (name.includes('phone') || name.includes('mobile')) return Smartphone;
  if (name.includes('head') || name.includes('audio') || name.includes('ear'))
    return Headphones;
  if (name.includes('watch') || name.includes('wear')) return Watch;
  if (name.includes('laptop') || name.includes('notebook')) return Laptop;
  if (name.includes('desktop') || name.includes('pc')) return Package;
  return ShoppingBag;
};

// --- COMPONENTS ---

// 🚀 REVISED: New simple header matching the POS screenshot
const SimpleHeader = ({ search, setSearch, onDashboardClick }) => (
  <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
    {/* Left: Logo and Search Bar */}
    <div className="flex items-center gap-6 w-3/4">
      <div className="flex items-center gap-2 text-2xl font-bold text-primary shrink-0">
        <span className="text-3xl font-extrabold text-[#252a4e]">RetailFlow</span>
      </div>
      
      {/* Wide Search Bar from the second image */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Search" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
    </div>

    {/* Right: Icons (Dashboard, Settings, Bell, User) */}
    <div className="flex items-center gap-3">
      {/* Dashboard Button (Prominent) */}
      <button
        onClick={onDashboardClick}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md font-medium text-sm"
      >
        <LayoutDashboard size={20} /> Dashboard
      </button>

      {/* Settings */}
      <button className="w-10 h-10 bg-card border border-border text-muted-foreground rounded-lg flex items-center justify-center hover:text-primary hover:border-primary transition-all">
        <Settings size={18} />
      </button>

      {/* Notification Bell */}
      <button className="w-10 h-10 bg-card border border-border text-muted-foreground rounded-lg flex items-center justify-center hover:text-primary hover:border-primary transition-all relative">
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {/* User Avatar */}
      <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-border cursor-pointer">
        <img src={`https://via.placeholder.com/40/0E7490/FFFFFF?text=W`} alt="User" className="w-full h-full object-cover" />
      </div>
    </div>
  </header>
);

// 🚀 New left category sidebar (matches POS screenshot)
const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  const allButton = {
    key: 'All',
    label: 'All',
    icon: LayoutGrid,
  };

  const items = [
    allButton,
    ...categories.map((cat) => ({
      key: cat,
      label: cat,
      icon: getCategoryIcon(cat),
    })),
  ];

  return (
    <aside className="w-24 bg-card border-r border-border flex flex-col items-center py-4 gap-3 shrink-0 h-full">
      {items.map((item) => {
        const isActive = selectedCategory === item.key || (!selectedCategory && item.key === 'All');
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => onSelectCategory(item.key === 'All' ? 'All' : item.key)}
            className={`flex flex-col items-center justify-center w-20 py-3 rounded-xl border text-xs font-medium transition-all ${
              isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-background text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            <Icon size={20} className="mb-1" />
            <span className="truncate max-w-[4.5rem]">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};


// ❌ REMOVED: Old Sidebar (for comparison)
// const Sidebar = () => { ... }


const ProductGrid = ({ products, search, setSearch, selectedCategory }) => {
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'All' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 bg-background p-6 overflow-hidden flex flex-col">
      {/* Header (now simplified, main search moved to SimpleHeader) */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Point of Sale</h1> {/* Changed title for simplicity */}
          <p className="text-muted-foreground text-sm mt-1">Manage your sales transactions</p>
        </div>
        <div className="flex gap-3">
          {/* Secondary Controls */}
          <button className="px-4 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity">
            View All Brands <ChevronDown size={16} className="inline ml-1" />
          </button>
          <button className="px-4 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
            Featured
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 overflow-y-auto pr-2 pb-20">
        {filtered.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/50 transition-all group cursor-pointer">
            <div className="aspect-[4/3] bg-muted rounded-lg mb-3 relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                {product.qty} Left
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-medium mb-1">{product.category}</div>
            <h3 className="font-bold text-foreground text-lg leading-tight mb-3">{product.name}</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
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


// Simple demo cart: use the first few products from backend
const getCartItemsWithImages = (products) => {
  if (!products || products.length === 0) return [];
  const base = products.slice(0, 3);
  return base.map((p, index) => ({
    ...p,
    qty: index + 1,
  }));
};


const OrderDetails = ({ products }) => (
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
      {getCartItemsWithImages(products).map((item, idx) => (
        <div key={idx} className="flex gap-4 group">
          <div className="w-16 h-16 bg-muted rounded-lg shrink-0 overflow-hidden">
            <img src={item.image} className="w-full h-full object-cover rounded-lg" alt={item.name} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
              <span className="font-bold text-primary">${(item.price * item.qty).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">${item.price.toFixed(2)} / unit</div>
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
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const products = useMemo(() => {
    return productsData.map(mapProductToPosItem).filter(Boolean);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-foreground">
      <SimpleHeader
        search={search}
        setSearch={setSearch}
        onDashboardClick={() => navigate('/dashboard')}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left product category sidebar */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Center product grid */}
        <ProductGrid
          products={products}
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
        />

        {/* Right order details (cart) */}
        <OrderDetails products={products} />
      </div>
    </div>
  );
};

export default POS;