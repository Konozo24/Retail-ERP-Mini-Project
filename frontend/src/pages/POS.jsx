import React, { useMemo, useState } from 'react';
import {
    Search, Bell, Settings, User, ShoppingBag,
    Smartphone, Headphones, Watch, Laptop, Package,
    LayoutGrid, ChevronDown, Trash2, Plus, Minus,
    LayoutDashboard, Menu, CreditCard, Banknote, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { useGetProductsPage } from '../api/products.api';
import { useGetCategoriesName } from '../api/categories.api';
import { useGetCustomersPage, useCreateCustomer } from '../api/customers.api';
import { useCreateSalesOrder } from '../api/sales-order.api';
import { getImageUrlByProduct } from '../data/categoryImages';
import EditCustomersModal from '../components/ui/EditCustomersModal';

// --- HELPERS ---
const mapProductToPosItem = (product) => {
    if (!product) return null;
    const rawPrice = product.unitPrice ?? product.unit_price ?? product.price ?? 0;
    const numericPrice = typeof rawPrice === 'number'
        ? rawPrice
        : parseFloat(rawPrice.toString().replace(/,/g, '')) || 0;

    const categoryName = product.category?.name || product.category || 'Others';

    return {
        id: product.id,
        name: product.name,
        price: numericPrice,
        qty: product.stockQty ?? product.stock_qty ?? product.qty ?? 0,
        desc: product.description ?? product.desc ?? '',
        image: product.image || null,
        category: categoryName,
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

            {/* LOGO SECTION - Updated */}
            <div className="flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-primary shrink-0" />
                <span className="text-2xl font-bold text-sidebar-foreground transition-opacity duration-300">
                    Retail<span className="text-accent">Flow</span>
                </span>
            </div>

            {/* Search Bar */}
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
            <div className="h-6 w-px bg-border mx-1" />

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
    const items = [allButton, ...categories.map((cat) => ({ key: cat, label: cat, icon: getCategoryIcon(cat) }))];

    return (
        <aside className="w-24 bg-card border-r border-border flex flex-col items-center py-6 gap-3 shrink-0 h-full z-10">
            {items.map((item) => {
                const isActive = selectedCategory === item.key || (!selectedCategory && item.key === 'All');
                const Icon = item.icon;
                return (
                    <button
                        key={item.key}
                        onClick={() => onSelectCategory(item.key === 'All' ? 'All' : item.key)}
                        className={`flex flex-col items-center justify-center w-20 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                            : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <Icon size={24} className={`mb-1.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                        <span className="text-[10px] font-medium truncate max-w-[4.5rem] tracking-wide">{item.label}</span>
                    </button>
                );
            })}
        </aside>
    );
};

const ProductCard = ({ product, onAddToCart }) => (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer flex flex-col h-full">
        {/* Image Area */}
        <div className="aspect-4/3 bg-muted/50 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center p-4">
            <img
                src={getImageUrlByProduct(product)}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-2 right-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded bg-background/80 backdrop-blur-sm border border-border ${product.qty < 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {product.qty} L
                </span>
            </div>
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1">
            <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">{product.category}</div>
            <h3 className="font-bold text-foreground text-base leading-tight mb-2 line-clamp-2">{product.name}</h3>

            <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-foreground">RM{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.qty === 0}
                    className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center 
               hover:bg-primary/90 transition-colors shadow-sm 
               disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-auto cursor-pointer"
                >
                    <Plus size={16} strokeWidth={3} />
                </button>
            </div>
        </div>
    </div>
);

const ProductGrid = ({ products, search, setSearch, selectedCategory, isLoading, onAddToCart }) => {
    const filtered = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const hasStock = p.qty > 0;
        return matchesSearch && hasStock;
    });

    return (
        <div className="flex-1 bg-background p-6 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex justify-between items-end mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Products</h1>
                    <p className="text-muted-foreground text-sm">Select items to add to order</p>
                </div>

            </div>

            {/* Grid with custom scrollbar */}
            <div className="custom-scrollbar overflow-y-auto pr-2 -mr-2 pb-20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <ShoppingBag size={48} className="mb-4 opacity-20 animate-pulse" />
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
                            {filtered.map((product) => (
                                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                            ))}
                        </div>
                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                <ShoppingBag size={48} className="mb-4 opacity-20" />
                                <p>No products found</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// --- CART / ORDER DETAILS ---

const OrderDetails = ({ cart, selectedCustomer, onSelectCustomer, customers, customerSearch, setCustomerSearch, onUpdateCartQty, onRemoveFromCart, onClearCart }) => {
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('CARD');
    const [submitMsg, setSubmitMsg] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

    // Handle
    const handleAddCustomer = () => {
        setIsAddCustomerOpen(true);
    };

    const { mutateAsync: createSalesOrder } = useCreateSalesOrder();
    const { mutateAsync: createCustomer } = useCreateCustomer();

    const cartItems = cart;
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.cartQty), 0);
    const total = subtotal;

    return (
        <aside className="w-[380px] bg-card border-l border-border flex flex-col shrink-0 h-full shadow-xl shadow-black/5 z-20">
            {/* Header */}
            <div className="p-5 border-b border-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-foreground">Current Order</h2>
                    <button
                        onClick={handleAddCustomer}
                        className="px-3 py-1.5 text-xs font-medium rounded-md border border-border text-foreground hover:bg-muted"
                    >
                        + Add Customer
                    </button>
                    <EditCustomersModal
                        isOpen={isAddCustomerOpen}
                        onClose={() => setIsAddCustomerOpen(false)}
                        title="Add Customer"
                        initialData={null}
                        onSubmit={async (data) => {
                            const payload = {
                                name: data.name?.trim() || `${data.firstName} ${data.lastName}`.trim(),
                                email: data.email,
                                phone: data.phone,
                            };
                            const created = await createCustomer(payload);
                            // Select newly created customer
                            onSelectCustomer(created);
                            setShowCustomerDropdown(false);
                        }}
                    />
                </div>

                {/* Customer Selector */}
                <div className="relative">
                    <div
                        onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                        className="bg-muted/50 rounded-lg p-3 border border-border flex items-center gap-3 cursor-pointer hover:bg-muted transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground">
                            <User size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            {selectedCustomer ? (
                                <>
                                    <h4 className="font-bold text-sm text-foreground truncate">{selectedCustomer.name}</h4>
                                    <p className="text-xs text-primary font-medium">{selectedCustomer.email || 'Customer'}</p>
                                </>
                            ) : (
                                <>
                                    <h4 className="font-bold text-sm text-muted-foreground">Select Customer</h4>
                                    <p className="text-xs text-muted-foreground">Required</p>
                                </>
                            )}
                        </div>
                        <ChevronDown size={16} className={`text-muted-foreground transition-transform ${showCustomerDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown */}
                    {showCustomerDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-30 max-h-[300px] flex flex-col">
                            {/* Search */}
                            <div className="p-3 border-b border-border">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search customers..."
                                        value={customerSearch}
                                        onChange={(e) => setCustomerSearch(e.target.value)}
                                        className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>

                            {/* Customer List */}
                            <div className="overflow-y-auto custom-scrollbar">
                                {customers.length > 0 ? (
                                    customers.map((customer) => (
                                        <button
                                            key={customer.id}
                                            onClick={() => {
                                                onSelectCustomer(customer);
                                                setShowCustomerDropdown(false);
                                                setCustomerSearch('');
                                            }}
                                            className={`w-full px-3 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors text-left ${selectedCustomer?.id === customer.id ? 'bg-muted' : ''
                                                }`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{customer.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{customer.email || customer.phone}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No customers found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 custom-scrollbar overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <ShoppingBag size={48} className="mb-2 opacity-20" />
                        <p className="text-sm">Cart is empty</p>
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3 group">
                            <div className="w-14 h-14 bg-muted rounded-md shrink-0 p-1 border border-border">
                                <img src={getImageUrlByProduct(item)} className="w-full h-full object-cover" alt={item.name} />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                {/* Product name and price - better layout */}
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-medium text-foreground text-sm leading-tight flex-1 min-w-0">{item.name}</h4>
                                    <span className="font-bold text-foreground text-sm whitespace-nowrap shrink-0">RM {(item.price * item.cartQty).toFixed(2)}</span>
                                </div>

                                {/* Unit price and quantity controls */}
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground">RM {item.price.toFixed(2)}</div>

                                    {/* Qty Control */}
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-2 bg-muted rounded-md px-1.5 py-0.5 border border-border">
                                            <button
                                                onClick={() => {
                                                    if (item.cartQty === 1) {
                                                        onRemoveFromCart(item.id);
                                                    } else {
                                                        onUpdateCartQty(item.id, item.cartQty - 1);
                                                    }
                                                }}
                                                className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">{item.cartQty}</span>
                                            <button
                                                onClick={() => onUpdateCartQty(item.id, item.cartQty + 1)}
                                                disabled={item.cartQty >= item.qty}
                                                title={item.cartQty >= item.qty ? `Max stock: ${item.qty}` : ''}
                                                className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        {item.cartQty >= item.qty && (
                                            <span className="text-[10px] text-destructive font-medium">Max stock reached</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer / Payment */}
            <div className="bg-background/50 p-5 border-t border-border">
                <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-bold text-foreground">RM {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-end pt-3 border-t border-border">
                        <span className="text-base font-bold text-foreground">Total</span>
                        <span className="text-2xl font-black text-primary">RM {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                {/* Payment Method Selector */}
                <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Payment Method</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setPaymentMethod('CARD')}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all ${paymentMethod === 'CARD'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-muted/50 text-muted-foreground hover:border-muted-foreground/30'
                                }`}
                        >
                            <CreditCard size={18} />
                            <span className="text-sm font-semibold">Card</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('CASH')}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all ${paymentMethod === 'CASH'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-muted/50 text-muted-foreground hover:border-muted-foreground/30'
                                }`}
                        >
                            <Banknote size={18} />
                            <span className="text-sm font-semibold">Cash</span>
                        </button>
                    </div>
                </div>
                {submitMsg && (
                    <div className={`mb-3 text-xs ${submitMsg.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
                        {submitMsg.text}
                    </div>
                )}

                <button
                    onClick={async () => {
                        setSubmitMsg(null);
                        if (!selectedCustomer) {
                            setSubmitMsg({ type: 'error', text: 'Please select a customer.' });
                            return;
                        }
                        if (!cart || cart.length === 0) {
                            setSubmitMsg({ type: 'error', text: 'Your cart is empty.' });
                            return;
                        }
                        const payload = {
                            customerId: selectedCustomer.id,
                            paymentMethod: paymentMethod,
                            items: cart.map(ci => ({ productId: ci.id, quantity: ci.cartQty }))
                        };
                        try {
                            setSubmitting(true);
                            await createSalesOrder(payload);
                            // small UX delay so spinner is visible
                            await new Promise(r => setTimeout(r, 1000));
                            setSubmitMsg({ type: 'success', text: 'Payment successful. Sales order created.' });
                            console.log(`Sales order created successfully ${JSON.stringify(payload)}`);
                            onClearCart?.();
                        } catch (e) {
                            await new Promise(r => setTimeout(r, 1000));
                            setSubmitMsg({ type: 'error', text: 'Failed to create sales order.' });
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                    disabled={submitting}
                    className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Processing…
                        </>
                    ) : (
                        'Confirm Payment'
                    )}
                </button>
            </div>
        </aside>
    );
};

// --- MAIN LAYOUT ---

const POS = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [customerSearch, setCustomerSearch] = useState('');
    const [debouncedCustomerSearch] = useDebounce(customerSearch, 500);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cart, setCart] = useState([]);
    const pageSize = 100;

    // Cart functions
    const handleAddToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Increase quantity if not exceeding stock
                if (existingItem.cartQty < product.qty) {
                    return prevCart.map(item =>
                        item.id === product.id
                            ? { ...item, cartQty: item.cartQty + 1 }
                            : item
                    );
                }
                return prevCart;
            } else {
                // Add new item with cartQty = 1
                return [...prevCart, { ...product, cartQty: 1 }];
            }
        });
    };

    const handleUpdateCartQty = (productId, newQty) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, cartQty: newQty } : item
            )
        );
    };

    const handleRemoveFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const { data: categoriesData } = useGetCategoriesName();
    const categories = useMemo(() => categoriesData ?? [], [categoriesData]);

    const { data: customersPage } = useGetCustomersPage(debouncedCustomerSearch, 0, 100);
    const customers = useMemo(() => customersPage?.content ?? [], [customersPage]);

    const categoryFilter = selectedCategory === 'All' ? '' : selectedCategory;
    const { data: productsPage, isLoading: isLoadingProducts } = useGetProductsPage(
        debouncedSearch,
        0,
        pageSize,
        categoryFilter
    );

    const products = useMemo(() => {
        const items = productsPage?.content ?? [];
        return items.map(mapProductToPosItem).filter(Boolean);
    }, [productsPage]);

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
                    isLoading={isLoadingProducts}
                    onAddToCart={handleAddToCart}
                />
                <OrderDetails
                    cart={cart}
                    selectedCustomer={selectedCustomer}
                    onSelectCustomer={setSelectedCustomer}
                    customers={customers}
                    customerSearch={customerSearch}
                    setCustomerSearch={setCustomerSearch}
                    onUpdateCartQty={handleUpdateCartQty}
                    onRemoveFromCart={handleRemoveFromCart}
                    onClearCart={() => setCart([])}
                />
            </div>
        </div>
    );
};

export default POS;