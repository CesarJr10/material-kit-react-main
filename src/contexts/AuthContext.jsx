import PropTypes from 'prop-types';
import React, { useMemo, useState, useContext, useCallback, createContext} from 'react';

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Creamos el proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Función para iniciar sesión
  const login = (userData) => {
    setUser(userData);
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
  };

  // Envolver logout en useCallback
  const logoutCallback = useCallback(logout, []);

  // Creamos el valor del contexto usando useMemo
  const value = useMemo(() => ({ user, login, logout: logoutCallback }), [user, logoutCallback]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
// Hook personalizado para consumir el contexto de autenticación
export const useAuth = () => 
   useContext(AuthContext);

