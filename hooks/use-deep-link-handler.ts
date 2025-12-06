import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

/**
 * Hook para manejar deep links en la app
 * Maneja tanto links cuando la app está abierta como cuando se abre desde cerrado
 * 
 * Ejemplos de deep links:
 * - exp://192.168.1.10:8081/--/property-detail/123 (Desarrollo)
 * - homi://property-detail/123 (Producción)
 */
export function useDeepLinkHandler() {
    const router = useRouter();

    useEffect(() => {
        // Listener para cuando la app ya está abierta y recibe un deep link
        const subscription = Linking.addEventListener('url', ({ url }) => {
            console.log('🔗 Deep link recibido (app abierta):', url);
            handleDeepLink(url, router);
        });

        // Handler para cuando la app se abre desde cerrado con un deep link
        const checkInitialURL = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl != null) {
                console.log('🔗 Deep link recibido (app cerrada):', initialUrl);
                handleDeepLink(initialUrl, router);
            }
        };

        checkInitialURL();

        return () => {
            subscription.remove();
        };
    }, [router]);
}

/**
 * Parsea y navega según el deep link
 * 
 * @param url - URL del deep link completa
 * @param router - Router de expo-router
 */
function handleDeepLink(url: string, router: ReturnType<typeof useRouter>) {
    try {
        // Parsear la URL
        const parsed = Linking.parse(url);
        const { path, hostname } = parsed;

        console.log('📍 URL Parseada:', {
            url,
            path,
            hostname,
            parsed,
        });

        // Extraer el path relevante
        // En desarrollo: exp://192.168.1.10:8081/--/property-detail/123
        // El path es: /--/property-detail/123
        // En producción: homi://property-detail/123
        // El path es: /property-detail/123

        if (!path) {
            console.log('⚠️ No hay path en el deep link');
            return;
        }

        // Limpiar path: remover /-- si existe (es para Expo Go)
        const cleanPath = path.replace(/^\/--\//, '/').replace(/^\//, '');

        console.log('🎯 Path limpio:', cleanPath);

        // Parsear componentes del path
        const pathParts = cleanPath.split('/');
        const screenName = pathParts[0];
        const paramValue = pathParts[1];

        console.log('📋 Componentes:', { screenName, paramValue });

        // Navegar según el screen
        if (screenName === 'property-detail' && paramValue) {
            console.log(`✅ Navegando a propiedad: ${paramValue}`);
            router.push(`/property-detail/${paramValue}`);
        } else {
            console.log('⚠️ Screen desconocido:', screenName);
        }
    } catch (error) {
        console.error('❌ Error manejando deep link:', error);
    }
}
