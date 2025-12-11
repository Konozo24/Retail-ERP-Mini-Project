// src/data/mockData.js

export const productsData = [
    {
        id: 1,
        sku: "APL-001",
        name: "iPhone 15 Pro Max",
        image: "https://placehold.co/40/333/fff?text=IP",
        category: "Phone",
        unit_price: "1,199.00",
        stock_qty: 45,
        created_by: { name: "James Kirwin", avatar: "https://i.pravatar.cc/150?u=1" }
    },
    {
        id: 2,
        sku: "APL-002",
        name: "MacBook Air M2",
        image: "https://placehold.co/40/333/fff?text=MB",
        category: "Laptop",
        unit_price: "1,099.00",
        stock_qty: 24,
        created_by: { name: "Francis Chang", avatar: "https://i.pravatar.cc/150?u=2" }
    },
    {
        id: 3,
        sku: "APL-003",
        name: "iPad Pro 12.9-inch",
        image: "https://placehold.co/40/333/fff?text=IPD",
        category: "Tablet",
        unit_price: "1,099.00",
        stock_qty: 15,
        created_by: { name: "Antonio Engle", avatar: "https://i.pravatar.cc/150?u=3" }
    },
    {
        id: 4,
        sku: "APL-004",
        name: "Apple Watch Ultra 2",
        image: "https://placehold.co/40/333/fff?text=WT",
        category: "Wearable",
        unit_price: "799.00",
        stock_qty: 60,
        created_by: { name: "Leo Kelly", avatar: "https://i.pravatar.cc/150?u=4" }
    },
    {
        id: 5,
        sku: "APL-005",
        name: "AirPods Pro (2nd Gen)",
        image: "https://placehold.co/40/333/fff?text=AP",
        category: "Audio",
        unit_price: "249.00",
        stock_qty: 120,
        created_by: { name: "Annette Walker", avatar: "https://i.pravatar.cc/150?u=5" }
    },
    {
        id: 6,
        sku: "APL-006",
        name: "Mac Studio M2 Ultra",
        image: "https://placehold.co/40/333/fff?text=MS",
        category: "Desktop",
        unit_price: "3,999.00",
        stock_qty: 5,
        created_by: { name: "John Weaver", avatar: "https://i.pravatar.cc/150?u=6" }
    },
];

export const suppliersData = [
    {
        id: 1,
        name: "Alpha Supplies Co.",
        phone: "+1 555-214-8890",
        email: "contact@alphasupplies.com",
        address: "120 Market Street, Springfield, IL",
    },
    {
        id: 2,
        name: "GreenLeaf Distributors",
        phone: "+1 555-672-4412",
        email: "info@greenleafdist.com",
        address: "45 Greenway Ave, Portland, OR",
    },
    {
        id: 3,
        name: "Metro Industrial Parts",
        phone: "+1 555-905-3321",
        email: "sales@metroindustrial.com",
        address: "800 Industrial Park Rd, Dallas, TX",
    },
    {
        id: 4,
        name: "BlueWave Electronics",
        phone: "+1 555-448-2219",
        email: "support@bluewaveelectronics.com",
        address: "22 Tech Valley Drive, San Jose, CA",
    },
    {
        id: 5,
        name: "Prime Office Supplies",
        phone: "+1 555-778-0034",
        email: "orders@primeoffice.com",
        address: "310 Madison Blvd, New York, NY",
    },
    {
        id: 6,
        name: "FarmFresh Wholesale",
        phone: "+1 555-220-1187",
        email: "hello@farmfreshwholesale.com",
        address: "560 Country Line Rd, Omaha, NE",
    },
];

export const purchaseOrderItemData = [
    {
        id: 1,
        product: productsData[1],
        quantity: 10,
        unit_cost: 23.45,
        subtotal: 234.50
    },
    {
        id: 2,
        product: productsData[3],
        quantity: 5,
        unit_cost: 67.20,
        subtotal: 336.00
    },
    {
        id: 3,
        product: productsData[0],
        quantity: 12,
        unit_cost: 18.99,
        subtotal: 227.88
    },
    {
        id: 4,
        product: productsData[4],
        quantity: 3,
        unit_cost: 120.00,
        subtotal: 360.00
    },
    {
        id: 5,
        product: productsData[2],
        quantity: 20,
        unit_cost: 9.50,
        subtotal: 190.00
    },
    {
        id: 6,
        product: productsData[5],
        quantity: 7,
        unit_cost: 45.75,
        subtotal: 320.25
    },
];
