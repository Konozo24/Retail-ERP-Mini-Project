import { ImageOff } from "lucide-react";
import { getImageUrlByProduct } from "../../data/categoryImages";

const ProductNameCell = ({ product }) => (
    <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-md border border-border overflow-hidden shrink-0 bg-muted">
            <img
                src={getImageUrlByProduct(product)}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                    e.currentTarget.classList.add("hidden");
                    e.currentTarget.parentElement?.querySelector(".img-fallback-icon")?.classList.remove("hidden");
                }}
                onLoad={(e) => {
                    e.currentTarget.parentElement?.querySelector(".img-fallback-icon")?.classList.add("hidden");
                }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <ImageOff className="img-fallback-icon w-5 h-5 text-muted-foreground/50 hidden" />
            </div>
        </div>
        <span className="font-medium text-foreground">{product.name}</span>
    </div>
);

export default ProductNameCell;