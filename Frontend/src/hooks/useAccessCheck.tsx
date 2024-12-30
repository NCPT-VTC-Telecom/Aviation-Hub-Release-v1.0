import { ComponentType, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'store';
import { Navigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

interface ProtectedRouteProps {
  path: string;
  element: ComponentType<any>;
}

export const useAccessCheck = (currentPath: string) => {
  const isLoggedIn = useSelector((state) => state.authSlice.isLoggedIn);
  const [isMenuInitialized, setIsMenuInitialized] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const decryptPermissions = useCallback(() => {
    try {
      const accessPermission = sessionStorage.getItem('accessPermission');
      if (!accessPermission) return null;

      const decrypted = CryptoJS.AES.decrypt(accessPermission, process.env.REACT_APP_SECRET_KEY as string);
      const originalMessage = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(originalMessage);
    } catch (error) {
      console.error('Error decrypting permissions:', error);
      return null;
    }
  }, []);

  const checkAccess = useCallback(() => {
    if (!isLoggedIn) {
      setIsMenuInitialized(true);
      setHasAccess(false);
      return;
    }

    const permissions = decryptPermissions();
    if (!permissions?.level3 || permissions?.level3.length === 0) {
      setTimeout(checkAccess, 100);
      return;
    }

    const levels = currentPath.split('/').filter(Boolean);
    const level2Access = permissions.level2.includes(levels[0]);
    const level3Access = permissions.level3.includes(levels[1]);

    setHasAccess(level2Access && level3Access);
    setIsMenuInitialized(true);
  }, [isLoggedIn, decryptPermissions, currentPath]);

  useEffect(() => {
    setIsMenuInitialized(false);
    checkAccess();
  }, [checkAccess]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsMenuInitialized(false);
      checkAccess();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAccess]);

  return { isMenuInitialized, hasAccess };
};

// Route Guard Component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, element: Component }) => {
  const { isMenuInitialized, hasAccess } = useAccessCheck(path);

  if (!isMenuInitialized) {
    return null;
  }

  return hasAccess ? <Component /> : <Navigate to="/maintenance/404" />;
};
