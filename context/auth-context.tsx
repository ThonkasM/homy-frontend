import { apiService, AuthResponse } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<string>;
  logout: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  updateUser: (updatedUser: AuthResponse['user']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restaurar sesión al montar
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const guestMode = await AsyncStorage.getItem('guestMode');
        if (guestMode === 'true') {
          setIsGuest(true);
          setIsLoading(false);
          return;
        }

        const savedToken = await AsyncStorage.getItem('authToken');
        const savedUser = await AsyncStorage.getItem('authUser');

        if (savedToken) {
          apiService.setToken(savedToken);

          // Validar que el token siga siendo válido
          const isValid = await apiService.validateToken(savedToken);

          if (isValid && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setIsGuest(false); // Desactivar modo invitado
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
      setIsGuest(false); // Desactivar modo invitado

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
  ): Promise<string> => {
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
      setIsGuest(false); // Desactivar modo invitado

      console.log('Token y usuario guardados. Usuario:', response.user.email);

      // Retornar el token para que pueda ser usado para upload de avatar
      return response.accessToken;
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
      await AsyncStorage.removeItem('guestMode');

      // Limpiar estado
      apiService.clearToken();
      setToken(null);
      setUser(null);
      setIsGuest(false);
      setError(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Guardar en storage que es modo invitado
      await AsyncStorage.setItem('guestMode', 'true');

      // Limpiar cualquier sesión anterior
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('authUser');

      // Actualizar estado
      apiService.clearToken();
      setToken(null);
      setUser(null);
      setIsGuest(true);

      console.log('✅ Iniciado como invitado');
    } catch (err) {
      console.error('Error en loginAsGuest:', err);
      setError('Error al iniciar como invitado');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  /**
   * Actualizar datos del usuario en el contexto
   * Se usa cuando se actualiza el avatar o perfil
   */
  const updateUser = async (updatedUser: AuthResponse['user'] | undefined) => {
    try {
      if (!updatedUser) {
        console.error('❌ updateUser recibió undefined');
        throw new Error('updatedUser no puede ser undefined');
      }

      if (!updatedUser.email) {
        console.error('❌ Usuario sin email:', updatedUser);
        throw new Error('El usuario debe tener email');
      }

      setUser(updatedUser);
      const serialized = JSON.stringify(updatedUser);

      if (!serialized || serialized === 'undefined') {
        throw new Error('No se puede serializar el usuario');
      }

      await AsyncStorage.setItem('authUser', serialized);
      console.log('✅ Usuario actualizado en contexto:', updatedUser.email);
    } catch (err) {
      console.error('Error actualizando usuario en contexto:', err);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: (!!token && !!user) || isGuest,
    isGuest,
    login,
    register,
    logout,
    loginAsGuest,
    error,
    clearError,
    updateUser,
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
