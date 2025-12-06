import { apiService, AuthResponse } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restaurar sesión al montar
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('authToken');
        const savedUser = await AsyncStorage.getItem('authUser');

        if (savedToken) {
          apiService.setToken(savedToken);
          
          // Validar que el token siga siendo válido
          const isValid = await apiService.validateToken(savedToken);
          
          if (isValid && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
          } else {
            // Token inválido, limpiar
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('authUser');
          }
        }
      } catch (err) {
        console.error('Error restaurando sesión:', err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.login({ email, password });

      console.log('Respuesta de login recibida:', JSON.stringify(response, null, 2));

      // Validar que la respuesta tenga el token y usuario
      if (!response || !response.accessToken) {
        throw new Error('Respuesta inválida del servidor: falta accessToken');
      }
      if (!response.user) {
        throw new Error('Respuesta inválida del servidor: falta user');
      }

      // Guardar token y usuario
      await AsyncStorage.setItem('authToken', response.accessToken);
      await AsyncStorage.setItem('authUser', JSON.stringify(response.user));

      // Actualizar estado
      apiService.setToken(response.accessToken);
      setToken(response.accessToken);
      setUser(response.user);
      
      console.log('Login exitoso para:', email);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      console.error('Error en login:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Iniciando registro para:', email);

      const response = await apiService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
      });

      console.log('Respuesta de registro recibida:', JSON.stringify(response, null, 2));

      // Validar que la respuesta tenga el token y usuario
      if (!response || !response.accessToken) {
        throw new Error('Respuesta inválida del servidor: falta accessToken');
      }
      if (!response.user) {
        throw new Error('Respuesta inválida del servidor: falta user');
      }

      console.log('Registro exitoso, guardando token...');
      
      // Guardar token y usuario
      await AsyncStorage.setItem('authToken', response.accessToken);
      await AsyncStorage.setItem('authUser', JSON.stringify(response.user));

      // Actualizar estado
      apiService.setToken(response.accessToken);
      setToken(response.accessToken);
      setUser(response.user);
      
      console.log('Token y usuario guardados. Usuario:', response.user.email);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al registrarse';
      console.error('Error en registro:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Limpiar almacenamiento
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('authUser');

      // Limpiar estado
      apiService.clearToken();
      setToken(null);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
