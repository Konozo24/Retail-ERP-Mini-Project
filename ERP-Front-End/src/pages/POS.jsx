import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Receipt,
  MonitorSmartphone,
  Wand2,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { productsData } from "../data/mockData";

const currency = (value) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const POS = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [roundUpEnabled, setRoundUpEnabled] = useState(false);
  const [cashReceived, setCashReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [profileOpen, setProfileOpen] = useState(false);

  const categories = useMemo(
    () => ["All", ...new Set(productsData.map((p) => p.category))],
    []
  );

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const addToCart = (product) => {
    const price = parseFloat(product.unit_price.replace(/,/g, ""));
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price,
          qty: 1,
          sku: product.sku,
          image: product.image,
          category: product.category,
        },
      ];
    });
  };

  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const roundAdjustment = roundUpEnabled
    ? Math.max(0, Math.ceil(totalAmount) - totalAmount)
    : 0;
  const grandTotal = totalAmount + roundAdjustment;
  const cashNumber = parseFloat(cashReceived || 0);
  const changeDue = cashNumber > 0 ? Math.max(0, cashNumber - grandTotal) : 0;

  const handleCompleteSale = () => {
    // Placeholder: integrate API call here using ERD shape (sales_order + sales_order_item)
    // For now, just log the payload.
    const payload = {
      sales: {
        total_amount: grandTotal,
        payment_method: paymentMethod,
        round_adjustment: roundAdjustment,
        cash_received: cashNumber || 0,
        change_due: changeDue,
        created_at: new Date().toISOString(),
      },
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
        unit_price: item.price,
        subtotal: item.price * item.qty,
      })),
    };
    console.log("POS checkout payload", payload);
    alert("Sale completed (demo only). Check console for payload.");
    clearCart();
    setCashReceived("");
    setRoundUpEnabled(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* POS Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-card/90 backdrop-blur border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Fast lane checkout</p>
            <h1 className="text-xl font-semibold">Point of Sale</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden md:flex items-center gap-2 bg-accent/10 text-accent px-3 py-2 rounded-md text-sm hover:bg-accent/20 transition-colors"
            title="Go to dashboard"
          >
            <MonitorSmartphone className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button className="px-3 py-2 text-sm rounded-md border border-border text-foreground/80 hover:bg-muted transition-colors">
            Save Cart
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm">
            New Order
          </button>

          {/* Profile / Sign out */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-inner">
                WA
              </span>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-semibold">Wesley Adrian</span>
                <span className="text-[11px] text-muted-foreground">Cashier</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg p-2">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_400px] gap-4 p-4">
        {/* Category rail */}
        <aside className="bg-card border border-border rounded-2xl shadow-sm p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground mb-2">Categories</h3>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === cat
                    ? "bg-accent/10 text-accent border border-accent/30"
                    : "text-muted-foreground hover:bg-muted border border-transparent"
                }`}
              >
                <span className="truncate">{cat}</span>
                <span className="text-xs text-muted-foreground">
                  {
                    productsData.filter((p) =>
                      cat === "All" ? true : p.category === cat
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Products + filters */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-2xl shadow-sm px-4 py-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search product or scan barcode"
                className="w-full h-11 pl-10 pr-3 rounded-lg border border-input focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-sm bg-background"
              />
            </div>
            <button className="px-3 py-2 rounded-lg bg-accent/10 text-accent text-sm hover:bg-accent/20 flex items-center gap-2 transition-colors">
              <Wand2 className="w-4 h-4" />
              Featured
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-2xl border border-border shadow-sm p-4 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-md transition"
              >
                <div className="h-36 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {product.category}
                  </p>
                  <h3 className="font-semibold leading-snug">{product.name}</h3>
                  <p className="text-lg font-bold text-primary">
                    ${parseFloat(product.unit_price.replace(/,/g, "")).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
                No products found.
              </div>
            )}
          </div>
        </section>

        {/* Order panel */}
        <aside className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Order #{String(Date.now()).slice(-5)}</p>
              <h3 className="font-semibold">Order List</h3>
            </div>
            <button
              onClick={clearCart}
              className="text-sm text-destructive hover:text-destructive/80"
              disabled={!cartItems.length}
            >
              Clear all
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {cartItems.length === 0 && (
              <div className="h-full min-h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                No items yet. Add products to start an order.
              </div>
            )}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-muted rounded-xl p-3 border border-border"
              >
                <div className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="p-2 rounded-md border border-border hover:bg-card"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="p-2 rounded-md border border-border bg-card hover:bg-muted"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-20 text-right font-semibold">
                  {currency(item.price * item.qty)}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Items</span>
              <span className="font-semibold">{totalQty}</span>
            </div>

            <div className="space-y-2 text-sm text-foreground/90">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{currency(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRoundUpEnabled((v) => !v)}
                    className={`px-2 py-1 rounded-md text-xs font-medium border ${
                      roundUpEnabled
                        ? "bg-accent/20 text-accent border-accent/40"
                        : "text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    Round up to whole
                  </button>
                  <span className="text-muted-foreground">
                    {roundUpEnabled ? "On" : "Off"}
                  </span>
                </div>
                <span className="font-semibold">
                  {roundUpEnabled ? currency(roundAdjustment) : currency(0)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{currency(grandTotal)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>E-Wallet</option>
                  <option>Bank Transfer</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Cash Received</label>
                <input
                  type="number"
                  min="0"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                />
              </div>

              <div className="flex justify-between text-sm text-foreground">
                <span>Change</span>
                <span className="font-semibold">{currency(changeDue)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <button className="h-11 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium flex items-center justify-center gap-2">
                <Receipt className="w-4 h-4" />
                Hold
              </button>
              <button className="h-11 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Void
              </button>
              <button
                onClick={handleCompleteSale}
                disabled={!cartItems.length}
                className="col-span-2 h-12 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-semibold flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Complete Sale
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default POS;

