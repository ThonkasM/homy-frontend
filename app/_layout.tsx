import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import SplashScreen from '@/components/splash-screen';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDeepLinkHandler } from '@/hooks/use-deep-link-handler';

import "./global.css";

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Inicializar manejador de deep links
  useDeepLinkHandler();

  // Controlar navegación basada en autenticación
  useEffect(() => {
    if (!isLoading) {
      console.log('Auth state changed - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
      if (isAuthenticated) {
        console.log('Usuario autenticado, navegando a home...');
        router.replace('/(tabs)/home');
      } else {
        console.log('Usuario no autenticado, navegando a welcome...');
        router.replace('/welcome');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    console.log('Mostrando splash screen...');
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="welcome"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="property-detail/[propertyId]"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
