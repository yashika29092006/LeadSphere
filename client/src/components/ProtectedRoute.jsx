import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  //Current user
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }
  // Role-based
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
