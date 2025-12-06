// Configuración de Deep Links para desarrollo local
// Este archivo configura cómo la app maneja los deep links
// Ejemplos de deep links:
// - homi://property/prop-001
// - homi://property-detail/prop-001

import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export const linking = {
    prefixes: [prefix, 'homi://', 'exp://'],
    config: {
        screens: {
            // Ruta de detail de propiedad
            'property-detail/[propertyId]': 'property/:propertyId',
            // Fallback
            '*': '*',
        },
    },
};

// Función helper para generar deep links en desarrollo
export const generateDeepLink = (route: string, params?: Record<string, string>) => {
    let url = `homi://${route}`;

    if (params) {
        const queryString = Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        url += `?${queryString}`;
    }

    return url;
};

// Ejemplos de uso:
// generateDeepLink('property/prop-001')
// generateDeepLink('property/:propertyId', { propertyId: 'prop-001' })
