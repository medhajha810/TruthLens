import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  theme: 'light',
  notifications: [],
  preferences: {
    topics: [],
    sources: [],
    biasPreference: 'balanced',
    factCheckLevel: 'standard',
    notifications: false,
    language: 'en'
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      };
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    case 'UPDATE_PREFERENCES':
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload } 
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    ...state,
    dispatch,
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    addNotification: (notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    updatePreferences: (preferences) => dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 