import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastItem } from '../types';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Sparkles } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  toast: {
    success: (message: string, title?: string, action?: ToastItem['action']) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string, action?: ToastItem['action']) => void;
    warning: (message: string, title?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { isFrench } = useLanguage();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, message, title, action, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      const newToast: ToastItem = { id, type, message, title, action, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (message: string, title?: string, action?: ToastItem['action']) =>
      showToast({ type: 'success', message, title, action }),
    error: (message: string, title?: string) =>
      showToast({ type: 'error', message, title }),
    info: (message: string, title?: string, action?: ToastItem['action']) =>
      showToast({ type: 'info', message, title, action }),
    warning: (message: string, title?: string) =>
      showToast({ type: 'warning', message, title }),
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, toast }}>
      {children}
      {/* Toast Render Container */}
      <div
        id="app-toast-container"
        className="fixed bottom-5 left-5 sm:left-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        dir={isFrench ? 'ltr' : 'rtl'}
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-slideUp ${
              t.type === 'success'
                ? 'bg-[#1A1A1A]/95 text-white border-[#8C7342]/40 shadow-[#8C7342]/10'
                : t.type === 'error'
                ? 'bg-[#2A1515]/95 text-white border-red-500/40 shadow-red-500/10'
                : t.type === 'warning'
                ? 'bg-[#2A2315]/95 text-white border-yellow-500/40 shadow-yellow-500/10'
                : 'bg-[#1A2230]/95 text-white border-blue-500/40 shadow-blue-500/10'
            }`}
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#8C7342]" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
              {t.type === 'info' && <Sparkles className="w-5 h-5 text-blue-400" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {t.title && (
                <h4 className="text-xs font-bold text-[#FAF9F6] tracking-wide mb-0.5">
                  {t.title}
                </h4>
              )}
              <p className="text-xs text-gray-200 leading-relaxed font-medium">
                {t.message}
              </p>
              {t.action && (
                <button
                  onClick={() => {
                    t.action?.onClick();
                    removeToast(t.id);
                  }}
                  className="mt-2 text-[11px] font-bold text-[#8C7342] hover:text-[#b39556] underline flex items-center gap-1"
                >
                  {t.action.label}
                </button>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
