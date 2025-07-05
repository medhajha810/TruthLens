import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type: 'info',
      title: 'Update',
      message: 'New information available',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simulate real-time notifications
  useEffect(() => {
    const notificationTypes = [
      {
        type: 'info',
        title: 'New Articles',
        message: '15 new articles have been analyzed',
        icon: Info
      },
      {
        type: 'success',
        title: 'Fact Check Complete',
        message: 'Claim verification completed successfully',
        icon: CheckCircle
      },
      {
        type: 'warning',
        title: 'Bias Detected',
        message: 'Potential bias detected in recent articles',
        icon: AlertTriangle
      }
    ];

    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        addNotification({
          ...randomNotification,
          duration: 4000
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                className={`max-w-sm w-full p-4 rounded-lg border shadow-lg ${getColor(notification.type)}`}
              >
                <div className="flex items-start">
                  <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}; 