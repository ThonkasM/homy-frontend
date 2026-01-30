import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import GlobalSidebar from '@/components/navigation/global-sidebar';
import SplashScreen from '@/components/splash-screen';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { FavoritesProvider } from '@/context/favorites-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDeepLinkHandler } from '@/hooks/use-deep-link-handler';
import { useSidebarLayout } from '@/hooks/use-sidebar-layout';

import "./global.css";

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading, user, isGuest } = useAuth();
  const { hasSidebar } = useSidebarLayout();
  const router = useRouter();
  const segments = useSegments();
  const hasNavigated = useRef(false);

  // Inicializar manejador de deep links
  useDeepLinkHandler();

  // Resetear hasNavigated cuando cambia el estado de autenticación
  useEffect(() => {
    hasNavigated.current = false;
  }, [isAuthenticated]);

  // Controlar navegación basada en autenticación (solo al inicio)
  useEffect(() => {
    console.log('[Navigation Effect] isLoading:', isLoading, 'hasNavigated:', hasNavigated.current, 'isAuthenticated:', isAuthenticated, 'segments:', segments);

    if (isLoading) {
      console.log('[Navigation Effect] Esperando... isLoading=true');
      return;
    }

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'property-detail' || segments[0] === 'edit-property' || segments[0] === 'profile' || segments[0] === 'search' || segments[0] === 'drafts' || segments[0] === 'archived' || segments[0] === 'edit-profile';
    const inPublicGroup = segments[0] === 'welcome' || segments[0] === 'login' || segments[0] === 'register';

    console.log('[Navigation Effect] inAuthGroup:', inAuthGroup, 'inPublicGroup:', inPublicGroup);

    // Si está autenticado (usuario real o invitado) y está en pantalla pública
    if (isAuthenticated && inPublicGroup && !hasNavigated.current) {
      console.log('Usuario autenticado en pantalla pública, navegando a home...');
      hasNavigated.current = true;
      router.replace('/(tabs)/home');
    }
    // Si NO está autenticado y está en pantalla protegida
    else if (!isAuthenticated && inAuthGroup && !hasNavigated.current) {
      console.log('Usuario no autenticado en pantalla protegida, navegando a welcome...');
      hasNavigated.current = true;
      router.replace('/welcome');
    }
    // Primera carga: redirigir según estado
    else if (segments.length === 0 && !hasNavigated.current) {
      if (isAuthenticated) {
        console.log('Primera carga - usuario autenticado, navegando a home...');
        router.replace('/(tabs)/home');
      } else {
        console.log('Primera carga - usuario no autenticado, navegando a welcome...');
        router.replace('/welcome');
      }
      hasNavigated.current = true;
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Determinar si mostrar sidebar (solo en pantallas autenticadas)
  const isPublicRoute = segments[0] === 'welcome' || segments[0] === 'login' || segments[0] === 'register';
  const showSidebar = !isPublicRoute && hasSidebar;

  if (isLoading) {
    console.log('Mostrando splash screen...');
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        {showSidebar && <GlobalSidebar />}
        <View style={[styles.content, showSidebar && styles.contentWithSidebar]}>
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
        </View>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <RootLayoutNav />
      </FavoritesProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  contentWithSidebar: {
    ...Platform.select({
      web: {
        marginLeft: 250,
      },
    }),
  },
});
