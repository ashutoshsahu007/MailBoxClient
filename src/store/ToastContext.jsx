import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    setToasts((prev) => {
      // prevent duplicates
      if (prev.some((t) => t.message === message && t.type === type)) {
        return prev;
      }

      const id = Date.now();
      const newToast = { id, message, type };

      // schedule auto-remove
      setTimeout(() => {
        setToasts((curr) => curr.filter((t) => t.id !== id));
      }, 2000);

      return [...prev, newToast];
    });
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`relative flex items-center min-w-[280px] max-w-sm px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium overflow-hidden
          ${
            toast.type === "success"
              ? "bg-green-50 border-green-300 text-green-700"
              : toast.type === "error"
              ? "bg-red-50 border-red-300 text-red-700"
              : "bg-blue-50 border-blue-300 text-blue-700"
          }`}
            >
              {/* Icon + message */}
              <div className="flex items-center space-x-2">
                {toast.type === "success" && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {toast.type === "error" && (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                {toast.type === "info" && (
                  <Info className="w-5 h-5 text-blue-600" />
                )}
                <span>{toast.message}</span>
              </div>

              {/* Progress bar (auto-dismiss indicator) */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 2, ease: "linear" }} // match auto-dismiss duration
                className={`absolute bottom-0 left-0 h-1
            ${
              toast.type === "success"
                ? "bg-green-400"
                : toast.type === "error"
                ? "bg-red-400"
                : "bg-blue-400"
            }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
