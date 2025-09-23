import { createContext, useContext, useState, useEffect } from "react";

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

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
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
      gap: '12px',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 400);
  };

  const getToastStyles = (type) => {
    const baseStyles = {
      padding: '16px 20px',
      borderRadius: '12px',
      color: 'white',
      fontWeight: '500',
      minWidth: '320px',
      maxWidth: '500px',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      pointerEvents: 'auto',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transform: isRemoving 
        ? 'translateY(-20px) scale(0.95)' 
        : isVisible 
          ? 'translateY(0) scale(1)' 
          : 'translateY(-20px) scale(0.95)',
      opacity: isRemoving ? 0 : isVisible ? 1 : 0,
    };

    const typeStyles = {
      success: { 
        backgroundColor: '#10b981',
        backgroundImage: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      },
      error: { 
        backgroundColor: '#ef4444',
        backgroundImage: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      },
      warning: { 
        backgroundColor: '#f59e0b',
        backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      },
      info: { 
        backgroundColor: '#3b82f6',
        backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = (type) => {
    const iconStyle = {
      marginRight: '12px',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
    };

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    return <span style={iconStyle}>{icons[type]}</span>;
  };

  return (
    <div
      style={getToastStyles(toast.type)}
      onClick={handleRemove}
      onMouseEnter={(e) => {
        e.target.style.transform = isRemoving ? 'translateY(-20px) scale(0.95)' : 'translateY(0) scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = isRemoving ? 'translateY(-20px) scale(0.95)' : 'translateY(0) scale(1)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {getIcon(toast.type)}
        <span style={{ fontSize: '14px', lineHeight: '1.4' }}>{toast.message}</span>
      </div>
      <span style={{ 
        marginLeft: '16px', 
        fontSize: '20px', 
        opacity: 0.7,
        transition: 'opacity 0.2s ease',
        padding: '4px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '24px',
        height: '24px'
      }}
      onMouseEnter={(e) => {
        e.target.style.opacity = '1';
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = '0.7';
        e.target.style.backgroundColor = 'transparent';
      }}
      >×</span>
    </div>
  );
};

// Demo Component to test the toast system
const ToastDemo = () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast();

  return (
    <div style={{
      padding: '40px',
      maxWidth: '500px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        <button
          onClick={() => showSuccess('Success! Operation completed.')}
          style={{
            padding: '16px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#059669';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#10b981';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
        >
          Success
        </button>
        
        <button
          onClick={() => showError('Error! Something went wrong.')}
          style={{
            padding: '16px 24px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ef4444';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          }}
        >
          Error
        </button>
        
        <button
          onClick={() => showWarning('Warning! Please be careful.')}
          style={{
            padding: '16px 24px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#d97706';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f59e0b';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
          }}
        >
          Warning
        </button>
        
        <button
          onClick={() => showInfo('Info! Here\'s something useful.')}
          style={{
            padding: '16px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }}
        >
          Info
        </button>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  return (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  );
}