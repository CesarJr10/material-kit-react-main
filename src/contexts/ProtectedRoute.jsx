import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    
    return <Navigate to="/" replace />;
  }

  // Renderiza los componentes hijos si el usuario está autenticado
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
