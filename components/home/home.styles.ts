import { Platform, StyleSheet } from 'react-native';

const HEADER_HEIGHT = 73; // Altura aproximada del header fijo

export const createHomeStyles = (width: number, hasSidebar: boolean = false) => {
    const isMobile = width <= 1024;

    return StyleSheet.create({
        safeContainer: {
            flex: 1,
            backgroundColor: '#ffffff',
        },
        container: {
            flex: 1,
            width: '100%',
            ...Platform.select({
                web: hasSidebar ? {
                    paddingTop: HEADER_HEIGHT, // Espacio para el header fijo
                } : {},
            }),
        },
        feedContainer: {
            flex: 1,
            width: '100%',
            backgroundColor: '#f9fafb',
        },
    });
};
