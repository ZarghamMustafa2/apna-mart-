import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { PermissionKey } from '../../../types/admin';
import { ShieldAlert } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionKey;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { isAuthenticated, hasPermission } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="py-20 px-4 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">Access Restricted</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Your current admin role does not have permission to access this section ({requiredPermission}).
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
