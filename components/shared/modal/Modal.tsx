import type { ReactNode } from "react";
import { XIcon } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-3xl",
};

export default function Modal({
    isOpen, 
    onClose, 
    title, 
    children, 
    size = "md" 
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 max-h-screen">
      <div className={`z-50 bg-white rounded-xl shadow-xl w-full ${sizeMap[size]} relative`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl max-md:text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
