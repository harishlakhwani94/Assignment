import { useState, useEffect } from 'react';
import { loginService } from '../services/AuthService';
import { EncryptStorageService } from '../../../app/services/encryptStorageService';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = async () => {
    const token = await EncryptStorageService.getToken();
    setAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    onSuccess?: () => void,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService({ email, password });
      if (response && response.token) {
        await EncryptStorageService.storeToken(response.token);
        setAuthenticated(true);
        if (onSuccess) onSuccess();
      } else {
        setAuthenticated(false);
        setError('Invalid login response');
      }
    } catch (e: any) {
      setAuthenticated(false);
      setError(e.message || 'Login failed');
    }
    setLoading(false);
  };

  const logout = async () => {
    await EncryptStorageService.removeToken();
    setAuthenticated(false);
  };

  return {
    login,
    logout,
    loading,
    error,
    authenticated,
    checkAuth,
  };
};

export default useAuth;
