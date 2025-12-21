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

const resolveCategoryImage = (categoryName) => {
    if (!categoryName) return DEFAULT_IMAGE;
    const match = Object.entries(CATEGORY_DEFAULTS)
        .find(([key]) => key.toLowerCase() === categoryName.toLowerCase());
    return match?.[1] || DEFAULT_IMAGE;
};

// Get image with fallback strategy
export const getImageUrlByProduct = (row) => {
    const explicitImage = row?.image;
    if (explicitImage) {
        return explicitImage; // User uploaded specific image
    }

    const categoryName = typeof row?.category === 'string'
        ? row.category
        : row?.category?.name;
    
    return resolveCategoryImage(categoryName);
};

export const getImageUrlByCategory = (categoryName) => {
    return resolveCategoryImage(categoryName);
};