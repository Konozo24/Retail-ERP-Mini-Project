// purchaseData.js 

export const suppliersData = [
    { id: 1, name: "Apex Computers", contact: "apexcomputers@example.com", phone: "+15964712634", country: "Germany" },
    { id: 2, name: "Beats Headphones Inc", contact: "beatsheadphone@example.com", phone: "+16372895190", country: "Japan" },
    { id: 3, name: "Dazzle Shoes Ltd", contact: "dazzleshoes@example.com", phone: "+17589201739", country: "USA" },
    { id: 4, name: "Best Accessories", contact: "bestaccessories@example.com", phone: "+18934092467", country: "Austria" },
    { id: 5, name: "A-Z Store", contact: "a2zstore@example.com", phone: "+12568749035", country: "Turkey" },
    { id: 6, name: "Hatimi Hardwares", contact: "hatimihardware@example.com", phone: "+19054674627", country: "Mexico" },
    // ... add others if needed
];

// --- MOCK PURCHASE ORDER LIST DATA ---
export const purchaseOrdersList = [
    {
        po_id: "PO-2025-0014",
        date: "2025-11-20",
        supplier: suppliersData[0], // Apex Computers
        total_cost: 4500.00,
        items_count: 5,
        status: "Received",
    },
    {
        po_id: "PO-2025-0013",
        date: "2025-11-15",
        supplier: suppliersData[2], // Dazzle Shoes Ltd
        total_cost: 980.50,
        items_count: 3,
        status: "In Transit",
    },
    {
        po_id: "PO-2025-0012",
        date: "2025-11-01",
        supplier: suppliersData[4], // A-Z Store
        total_cost: 120.00,
        items_count: 1,
        status: "Completed",
    },
    {
        po_id: "PO-2025-0011",
        date: "2025-10-25",
        supplier: suppliersData[1], // Beats Headphones Inc
        total_cost: 8900.00,
        items_count: 10,
        status: "Completed",
    },
    {
        po_id: "PO-2025-0010",
        date: "2025-10-10",
        supplier: suppliersData[5], // Hatimi Hardwares
        total_cost: 550.75,
        items_count: 2,
        status: "Pending",
    },
];