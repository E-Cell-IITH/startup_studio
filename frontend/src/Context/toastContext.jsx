import { createContext, useContext, useState } from "react";

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, duration) => addToast(message, 'success', duration);
  const showError = (message, duration) => addToast(message, 'error', duration);
  const showInfo = (message, duration) => addToast(message, 'info', duration);
  const showWarning = (message, duration) => addToast(message, 'warning', duration);

  return (
    <ToastContext.Provider value={{ 
      toasts, 
      addToast, 
      removeToast, 
      showSuccess, 
      showError, 
      showInfo, 
      showWarning 
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const getToastStyles = (type) => {
    const baseStyles = {
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      minWidth: '300px',
      maxWidth: '400px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    };

    const typeStyles = {
      success: { backgroundColor: '#10b981' },
      error: { backgroundColor: '#ef4444' },
      warning: { backgroundColor: '#f59e0b' },
      info: { backgroundColor: '#3b82f6' }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  return (
    <div 
      style={getToastStyles(toast.type)}
      onClick={() => onRemove(toast.id)}
    >
      <span>{toast.message}</span>
      <span style={{ marginLeft: '12px', fontSize: '18px' }}>×</span>
    </div>
  );
};
