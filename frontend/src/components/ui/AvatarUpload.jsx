import { X, Camera } from "lucide-react";

const AvatarUpload = ({ value, onChange, onRemove }) => {
    return (
        <div className="flex flex-row items-center gap-6 p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
            <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {value ? (
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Camera className="w-8 h-8 text-gray-300" />
                    )}
                </div>

                {value && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="px-4 py-2 bg-[#F69C3C] hover:bg-[#F69C3C]/90 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors shadow-sm w-fit">
                    Change Image
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={onChange}
                    />
                </label>
                <span className="text-xs text-muted-foreground">
                    JPEG, PNG up to 2 MB
                </span>
            </div>
        </div>
    );
};

export default AvatarUpload;
