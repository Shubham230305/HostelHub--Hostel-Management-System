import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';

import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedAuth = sessionStorage.getItem('hostelhub_auth');
      return savedAuth ? JSON.parse(savedAuth) : null;
    } catch {
      sessionStorage.removeItem('hostelhub_auth');
      return null;
    }
  });

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    const authData = response.data;

    sessionStorage.setItem(
      'hostelhub_auth',
      JSON.stringify(authData)
    );

    setUser(authData);

    return authData;
  }, []);

  const setAuthData = useCallback((authData) => {
    sessionStorage.setItem(
      'hostelhub_auth',
      JSON.stringify(authData)
    );

    setUser(authData);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('hostelhub_auth');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.accessToken),
      login,
      logout,
      setAuthData,
    }),
    [user, login, logout, setAuthData]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}