import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      }, 3000);

      return [...prev, newToast];
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between min-w-[250px] max-w-sm px-4 py-3 rounded-lg shadow-lg text-gray-800
              ${
                toast.type === "success"
                  ? "bg-green-200"
                  : toast.type === "error"
                  ? "bg-red-200"
                  : "bg-blue-200"
              }`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 font-bold"
              >
                ❌
              </button>
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
