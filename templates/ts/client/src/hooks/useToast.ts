import { useState, useCallback } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  onClose: () => void;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info", duration: number = 5000) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      id,
      message,
      type,
      duration,
      onClose: () => removeToast(id)
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return addToast(message, "success", duration);
  }, [addToast]);

  const error = useCallback((message: string, duration?: number) => {
    return addToast(message, "error", duration);
  }, [addToast]);

  const warning = useCallback((message: string, duration?: number) => {
    return addToast(message, "warning", duration);
  }, [addToast]);

  const info = useCallback((message: string, duration?: number) => {
    return addToast(message, "info", duration);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
}