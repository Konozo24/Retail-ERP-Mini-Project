export const CATEGORY_DEFAULTS = {
    "Smartphone": "/images/smartphone.jpg",
    "Tablet":     "/images/tablet.jpg",
    "Laptop":     "/images/laptop.jpg",
    "Desktop":    "/images/desktop.jpg",
    "Wearable":   "/images/wearable.jpg",
    "Audio":      "/images/audio.jpg",
};

// Generic fallback image
const DEFAULT_IMAGE = "/images/default.jpg";

// Get image with fallback strategy:
// 1. Use user-uploaded image if available
// 2. Use category default placeholder if available
// 3. Use generic default image
export const getImageUrlByProduct = (row) => {
    if (row.image) {
        return row.image; // User uploaded specific image
    }
    return CATEGORY_DEFAULTS[row.category.name] || DEFAULT_IMAGE;
};

export const getImageUrlByCategory = (categoryName) => {
    return CATEGORY_DEFAULTS[categoryName] || DEFAULT_IMAGE;
};