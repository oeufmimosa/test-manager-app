import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  // Gérer l'état de chargement
  if (isAuthenticated === null) {
    return <div>Chargement...</div>; // Afficher un indicateur de chargement pendant la vérification
  }

  // Vérifier l'authentification et les rôles autorisés
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Si le rôle de l'utilisateur n'est pas autorisé pour cette route
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;
