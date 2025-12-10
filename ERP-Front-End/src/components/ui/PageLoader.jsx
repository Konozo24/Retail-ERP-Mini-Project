import React from "react";
import { ShoppingBag } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px] bg-background/50 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* 1. Animated Logo Icon */}
      <div className="relative mb-4">
        {/* Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-muted border-t-accent animate-spin w-16 h-16"></div>
        
        {/* Static Icon Center */}
        <div className="w-16 h-16 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* 2. Loading Text */}
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-lg font-bold text-foreground">
            Retail<span className="text-accent">Flow</span>
        </h3>
        <p className="text-xs text-muted-foreground animate-pulse">Loading resources...</p>
      </div>
    </div>
  );
};

export default PageLoader;