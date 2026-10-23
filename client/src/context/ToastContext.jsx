import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message, duration };

    setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5 toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (message, title = 'Success') => addToast({ type: 'success', title, message }),
    error: (message, title = 'Error') => addToast({ type: 'error', title, message }),
    info: (message, title = 'Notice') => addToast({ type: 'info', title, message }),
    warning: (message, title = 'Warning') => addToast({ type: 'warning', title, message }),
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100';
      case 'error':
        return 'border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100';
      case 'warning':
        return 'border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100';
      default:
        return 'border-blue-500/30 bg-blue-50/90 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100';
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div 
        aria-live="polite" 
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-up ${getBorderColor(
              t.type
            )}`}
          >
            {getIcon(t.type)}
            <div className="flex-1 text-sm min-w-0">
              {t.title && <div className="font-semibold text-xs uppercase tracking-wider mb-0.5 opacity-90">{t.title}</div>}
              <div className="font-medium text-sm leading-snug break-words">{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-1 -mr-1 -mt-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
