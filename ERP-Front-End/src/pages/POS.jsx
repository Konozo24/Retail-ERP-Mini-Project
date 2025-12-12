import React, { useState } from 'react';
import { 
  Search, Bell, Settings, User, ShoppingCart, Truck, Package, 
  Users, ShoppingBag, ArrowUp, X, RefreshCcw, Pause, ChevronRight, 
  Menu, Grid, Heart, Tag, LayoutDashboard, Calculator, Printer, Maximize,
  Headphones, Smartphone, Watch, Laptop, LayoutGrid, RotateCw, RefreshCw, 
  LayoutList, ChevronDown
} from 'lucide-react';

// --- MOCK PRODUCT DATA: Apple Products ---
const PRODUCTS = [
  // 🚀 UPDATED: Using specific placeholder URLs for visibility
  { id: 1, name: "iPhone 16 Pro Max", price: 1199.00, qty: 12, desc: "A18 Bionic", 
    image: 'https://images.unsplash.com/photo-1591337676757-9d7e6c38210e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjEyMzJ8MHwxfHNlYXJjaHwxNXx8aXBob25lfGVufDB8fHx8MTcwMjIxMDYwN3ww&ixlib=rb-4.0.3&q=80&w=400', 
    category: 'Mobiles' 
},
  { id: 2, name: "AirPods Pro (2nd)", price: 249.00, qty: 54, desc: "ANC, MagSafe", 
    image: 'https://images.unsplash.com/photo-1620898510842-ad06b3fa2d7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjEyMzJ8MHwxfHNlYXJjaHwxMHx8YWlycG9kc3xlbnwwfHx8fDE3MDIyMTA2NTR8MA&ixlib=rb-4.0.3&q=80&w=400', 
    category: 'Headset' 
},
  { id: 3, name: "MacBook Pro 14\"", price: 1999.00, qty: 8, desc: "M3 Pro Chip", 
    image: 'https://images.unsplash.com/photo-1541801842426-38101a1d95f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjEyMzJ8MHwxfHNlYXJjaHw3fHxtYWNib29rfGVufDB8fHx8MTcwMjIxMDY5MHww&ixlib=rb-4.0.3&q=80&w=400', 
    category: 'Laptops' 
},
  { id: 4, name: "Apple Watch Ultra", price: 799.00, qty: 15, desc: "Titanium Case", 
    image: 'https://images.unsplash.com/photo-1601002360810-61d07c080036?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjEyMzJ8MHwxfHNlYXJjaHwxMnx8YXBwbGUlMjB3YXRjaHxlbnwwfHx8fDE3MDIyMTA3NjF8MA&ixlib=rb-4.0.3&q=80&w=400', 
    category: 'Watches' 
},
  { id: 5, name: "iPad Air M2", price: 599.00, qty: 22, desc: "11-inch Display", 
    image: 'https://images.unsplash.com/photo-1623910702845-f0cc754db149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjEyMzJ8MHwxfHNlYXJjaHw1fHxpcGFkfGVufDB8fHx8MTcwMjIxMDc4NHww&ixlib=rb-4.0.3&q=80&w=400', 
    category: 'Mobiles' 
},
  { id: 6, name: "HomePod Mini", price: 99.00, qty: 30, desc: "Smart Speaker", 
    image: 'https://images.unsplash.com/photo-1634567227546-34a17951a822?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjEyMzJ8MHwxfHNlYXJjaHwxMHx8aG9tZXBvZHxlbnwwfHx8fDE3MDIyMTA4MTh8MA&ixlib=rb-4.0.3&q=80&w=400', 
    category: 'Headset' 
},
  { id: 7, name: "Mac Studio", price: 1999.00, qty: 4, desc: "M2 Max", 
    image: 'https://images.unsplash.com/photo-1614742512140-5232773d4d44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjEyMzJ8MHwxfHNlYXJjaHwzfHxtYWMlMjBzdHVkaW98ZW58MHx8fHwxNzAyMjEwODM3fDA&ixlib=rb-4.0.3&q=80&w=400', 
    category: 'Computer' 
},
  { id: 8, name: "Studio Display", price: 1599.00, qty: 6, desc: "5K Retina", 
    image: 'https://images.unsplash.com/photo-1667086053303-34e2c8172968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjEyMzJ8MHwxfHNlYXJjaHw3fHxhcHBsZSUyMGRpc3BsYXl8ZW58MHx8fHwxNzAyMjEwODU0fDA&ixlib=rb-4.0.3&q=80&w=400', 
    category: 'Computer' 
},
];

// --- COMPONENTS ---

// 🚀 REVISED: New simple header matching the "Sales History" (second) image
const SimpleHeader = ({ search, setSearch }) => (
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

    {/* Right: Icons (POS, Settings, Bell, User) */}
    <div className="flex items-center gap-3">
      
      {/* POS Button (Prominent) */}
      <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md font-medium text-sm">
        <ShoppingCart size={20} /> POS
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

// 🚀 REVISED: New wider sidebar matching the "Sales History" (second) image
const WideSidebar = () => {
  const sections = [
    { 
      title: "MAIN", 
      items: [
        { name: "Dashboard", icon: LayoutDashboard, active: false, path: "/dashboard" },
      ]
    },
    { 
      title: "INVENTORY", 
      items: [
        { name: "Products", icon: Package, active: false, path: "/products" },
        { name: "Create Product", icon: ShoppingBag, active: false, path: "/products/create" },
        { name: "Low Stocks", icon: ArrowUp, active: false, path: "/low-stocks" },
        { name: "Category", icon: LayoutList, active: false, path: "/category" },
        { name: "Print Barcode", icon: Printer, active: false, path: "/barcode" },
      ]
    },
    { 
      title: "STOCK", 
      items: [
        { name: "Manage Stock", icon: RefreshCw, active: false, path: "/manage-stock" },
        { name: "Purchase Order", icon: Truck, active: false, path: "/purchase-order" },
      ]
    },
    { 
      title: "SALES", 
      items: [
        { name: "Sales History", icon: ShoppingCart, active: true, path: "/sales" }, // Active for POS context
      ]
    },
    { 
      title: "PEOPLES", 
      items: [
        { name: "Customers", icon: Users, active: false, path: "/customers" },
      ]
    },
  ];

  return (
    <aside className="w-60 bg-card border-r border-border flex flex-col shrink-0 h-full overflow-y-auto pt-4 pb-8">
      {sections.map((section) => (
        <div key={section.title} className="px-4 mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 ml-4 mt-2">{section.title}</h3>
          <nav className="space-y-1">
            {section.items.map((item) => (
              <a 
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'text-foreground hover:bg-muted font-medium'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      ))}
    </aside>
  );
};


// ❌ REMOVED: Old Sidebar (for comparison)
// const Sidebar = () => { ... }


const ProductGrid = ({ search, setSearch }) => {
  const filtered = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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


const getCartItemsWithImages = () => {
    const cartItems = [
        { id: 1, qty: 1 },
        { id: 2, qty: 2 },
        { id: 6, qty: 1 }
    ];

    return cartItems.map(cartItem => {
        const productData = PRODUCTS.find(p => p.id === cartItem.id);
        if (productData) {
            return {
                ...productData,
                qty: cartItem.qty
            };
        }
        return null; 
    }).filter(item => item !== null);
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
      {getCartItemsWithImages().map((item, idx) => (
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
  const [search, setSearch] = useState("");

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-foreground">
      <SimpleHeader search={search} setSearch={setSearch} /> {/* 1. New Simple Header */}
      <div className="flex flex-1 overflow-hidden">
        <WideSidebar /> {/* 2. New Wide Sidebar */}
        <ProductGrid search={search} setSearch={setSearch} /> 
        <OrderDetails />
      </div>
    </div>
  );
};

export default POS;