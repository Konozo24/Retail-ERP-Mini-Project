import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: "bg-white border-green-500",
    error: "bg-white border-destructive",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-destructive" />,
  };

  return (
    <div className={`fixed top-4 right-4 z-[110] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 animate-in slide-in-from-right-5 duration-300 ${bgColors[type]}`}>
      {icons[type]}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{type === "success" ? "Success" : "Error"}</span>
        <span className="text-xs text-muted-foreground">{message}</span>
      </div>
      <button onClick={onClose} className="ml-4 text-muted-foreground hover:text-foreground">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;