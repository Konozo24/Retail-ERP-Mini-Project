import React, { useMemo, useState } from 'react';
import {
    Search, Bell, Settings, User, ShoppingBag, 
    Smartphone, Headphones, Watch, Laptop, Package, 
    LayoutGrid, ChevronDown, Trash2, Plus, Minus,
    LayoutDashboard, Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../data/mockData';

// --- HELPERS ---
const mapProductToPosItem = (product) => {
    if (!product) return null;
    const rawPrice = product.unit_price ?? product.price ?? 0;
    const numericPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(rawPrice.toString().replace(/,/g, '')) || 0;

    return {
        id: product.id,
        name: product.name,
        price: numericPrice,
        qty: product.stock_qty ?? product.qty ?? 0,
        desc: product.description ?? product.desc ?? '',
        image: product.image || product.image_url || 'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=400&q=80',
        category: product.category || 'Others',
    };
};

const getCategoryIcon = (category) => {
    const name = (category || '').toLowerCase();
    if (name.includes('phone') || name.includes('mobile')) return Smartphone;
    if (name.includes('head') || name.includes('audio')) return Headphones;
    if (name.includes('watch') || name.includes('wear')) return Watch;
    if (name.includes('laptop') || name.includes('notebook')) return Laptop;
    if (name.includes('desktop') || name.includes('pc')) return Package;
    return ShoppingBag;
};

// --- COMPONENTS ---

const Header = ({ search, setSearch, onDashboardClick }) => (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 z-20">
        {/* Brand & Search */}
        <div className="flex items-center gap-8 flex-1">
            <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-primary">RetailFlow</span>
            </div>
            
            <div className="relative w-full max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                    type="text"
                    placeholder="Search inventory..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-muted border-none rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
            </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
            <button 
                onClick={onDashboardClick}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="h-6 w-[1px] bg-border mx-1" />
            
            <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-foreground">Admin User</p>
                    <p className="text-xs text-muted-foreground">Point of Sale</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                    A
                </div>
            </div>
        </div>
    </header>
);

// Sidebar - Structure kept as requested, style updated to theme
const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
    const allButton = { key: 'All', label: 'All', icon: LayoutGrid };
    const items = [allButton, ...categories.map((cat) => ({
        key: cat, label: cat, icon: getCategoryIcon(cat),
    }))];

    return (
        <aside className="w-24 bg-card border-r border-border flex flex-col items-center py-6 gap-3 shrink-0 h-full z-10">
            {items.map((item) => {
                const isActive = selectedCategory === item.key || (!selectedCategory && item.key === 'All');
                const Icon = item.icon;
                return (
                    <button
                        key={item.key}
                        onClick={() => onSelectCategory(item.key === 'All' ? 'All' : item.key)}
                        className={`flex flex-col items-center justify-center w-20 py-3 rounded-xl transition-all duration-200 group ${
                            isActive
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                    >
                        <Icon size={24} className={`mb-1.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                        <span className="text-[10px] font-medium truncate max-w-[4.5rem] tracking-wide">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </aside>
    );
};

const ProductCard = ({ product }) => (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer flex flex-col h-full">
        {/* Image Area */}
        <div className="aspect-[4/3] bg-muted/50 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center p-4">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
            />
            <div className="absolute top-2 right-2">
                 <span className={`text-[10px] font-bold px-2 py-1 rounded bg-background/80 backdrop-blur-sm border border-border ${product.qty < 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {product.qty}L
                </span>
            </div>
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1">
            <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">{product.category}</div>
            <h3 className="font-bold text-foreground text-base leading-tight mb-2 line-clamp-2">{product.name}</h3>
            
            <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-foreground">${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <button className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus size={16} strokeWidth={3} />
                </button>
            </div>
        </div>
    </div>
);

const ProductGrid = ({ products, search, setSearch, selectedCategory }) => {
    const filtered = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !selectedCategory || selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex-1 bg-background p-6 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex justify-between items-end mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Products</h1>
                    <p className="text-muted-foreground text-sm">Select items to add to order</p>
                </div>
                <button className="px-4 py-2 bg-card border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors flex items-center gap-2">
                    Filter <ChevronDown size={14} />
                </button>
            </div>

            {/* Grid with custom scrollbar */}
            <div className="custom-scrollbar overflow-y-auto pr-2 -mr-2 pb-20">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <ShoppingBag size={48} className="mb-4 opacity-20" />
                        <p>No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CART / ORDER DETAILS ---

const OrderDetails = ({ products }) => {
    // Mock cart data
    const cartItems = products.slice(0, 3).map((p, i) => ({ ...p, qty: i + 1 }));
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const total = subtotal; // Tax removed as requested

    return (
        <aside className="w-[380px] bg-card border-l border-border flex flex-col shrink-0 h-full shadow-xl shadow-black/5 z-20">
            {/* Header */}
            <div className="p-5 border-b border-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-foreground">Current Order</h2>
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-mono">#ORD-0123</span>
                </div>
                
                {/* Customer Selector */}
                <div className="bg-muted/50 rounded-lg p-3 border border-border flex items-center gap-3 cursor-pointer hover:bg-muted transition-colors">
                    <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground">
                        <User size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-foreground truncate">Wesley Adrian</h4>
                        <p className="text-xs text-primary font-medium">Member</p>
                    </div>
                    <ChevronDown size={16} className="text-muted-foreground" />
                </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 custom-scrollbar overflow-y-auto p-5 space-y-4">
                {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 group">
                        <div className="w-14 h-14 bg-muted rounded-md shrink-0 p-1 border border-border">
                            <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-foreground text-sm truncate pr-2">{item.name}</h4>
                                <span className="font-bold text-foreground text-sm">${(item.price * item.qty).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-xs text-muted-foreground">${item.price.toLocaleString()} ea</div>
                                
                                {/* Qty Control */}
                                <div className="flex items-center gap-2 bg-muted rounded-md px-1.5 py-0.5 border border-border">
                                    <button className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                                        <Minus size={12} />
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                                    <button className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                                        <Plus size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Payment */}
            <div className="bg-background/50 p-5 border-t border-border">
                <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-bold text-foreground">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="flex justify-between items-end pt-3 border-t border-border">
                        <span className="text-base font-bold text-foreground">Total</span>
                        <span className="text-2xl font-black text-primary">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <button className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm">
                    Confirm Payment
                </button>
            </div>
        </aside>
    );
};

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
        <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-foreground selection:bg-primary/20">
            <Header
                search={search}
                setSearch={setSearch}
                onDashboardClick={() => navigate('/dashboard')}
            />
            <div className="flex flex-1 overflow-hidden">
                <CategorySidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
                <ProductGrid
                    products={products}
                    search={search}
                    setSearch={setSearch}
                    selectedCategory={selectedCategory}
                />
                <OrderDetails products={products} />
            </div>
        </div>
    );
};

export default POS;