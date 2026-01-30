import { formatPriceWithCurrency } from '@/config/currencies.config';
import { Property } from '@/hooks/use-properties';
import { useSidebarLayout } from '@/hooks/use-sidebar-layout';
import { SERVER_BASE_URL } from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

interface FavoriteCardProps {
    favorite: {
        id: string;
        property: Property;
    };
    onPress: () => void;
    onRemoveFavorite: () => void;
}

export default function FavoriteCard({
    favorite,
    onPress,
    onRemoveFavorite
}: FavoriteCardProps) {
    const { width } = useWindowDimensions();
    const { hasSidebar } = useSidebarLayout();

    // Calcular ancho disponible considerando sidebar
    const availableWidth = hasSidebar ? width - 250 : width;
    const isMobile = availableWidth <= 768;

    const styles = createStyles(isMobile);
    const property = favorite.property;
    const imageUrl = property.images?.[0]?.url;

    const buildImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${SERVER_BASE_URL}${cleanPath}`;
    };

    const fullImageUrl = buildImageUrl(imageUrl);

    return (
        <View style={styles.propertyCard}>
            {/* Imagen */}
            <View style={styles.propertyImageContainer}>
                {fullImageUrl ? (
                    <Image
                        source={{ uri: fullImageUrl }}
                        style={styles.propertyImage}
                        onError={() => {
                            console.error('[FavoriteCard] Image load error:', fullImageUrl);
                        }}
                    />
                ) : (
                    <View style={[styles.propertyImage, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: '#cbd5e1', fontSize: 16 }}>📷</Text>
                    </View>
                )}
            </View>

            {/* Información */}
            <View style={styles.propertyInfo}>
                <TouchableOpacity onPress={onPress}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                        {property.title}
                    </Text>
                    <Text style={styles.propertyPrice}>
                        {formatPriceWithCurrency(property.price, property.currency || 'BOB')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Botón Remover de Favoritos */}
            <TouchableOpacity
                style={styles.propertyOptionsButton}
                onPress={onRemoveFavorite}
            >
                <MaterialCommunityIcons name="heart" size={24} color="#dc2626" />
            </TouchableOpacity>
        </View>
    );
}

const createStyles = (isMobile: boolean) => {
    return StyleSheet.create({
        propertyCard: {
            width: '100%',
            marginVertical: 8,
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: isMobile ? 12 : 16,
            paddingVertical: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 3,
            elevation: 2,
            borderWidth: 1,
            borderColor: '#e5e7eb',
        },
        propertyImageContainer: {
            height: 80,
            width: 80,
            borderRadius: 8,
            marginRight: isMobile ? 12 : 16,
            overflow: 'hidden',
            backgroundColor: '#f1f5f9',
        },
        propertyImage: {
            width: '100%',
            height: '100%',
            backgroundColor: '#f1f5f9',
        },
        propertyInfo: {
            flex: 1,
            justifyContent: 'space-between',
        },
        propertyTitle: {
            fontSize: 15,
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: 6,
        },
        propertyPrice: {
            fontSize: 16,
            fontWeight: '800',
            color: '#5585b5',
        },
        propertyOptionsButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 12,
        },
    });
};
