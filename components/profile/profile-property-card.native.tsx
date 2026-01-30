import { formatPriceWithCurrency } from '@/config/currencies.config';
import { Property } from '@/hooks/use-properties';
import { SERVER_BASE_URL } from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PropertyCardProps {
    property: Property;
    onPress: () => void;
    onOptionsPress: () => void;
}

export default function ProfilePropertyCard({
    property,
    onPress,
    onOptionsPress
}: PropertyCardProps) {
    const imageUrl = property.images?.[0]?.url;

    const buildImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${SERVER_BASE_URL}${cleanPath}`;
    };

    const fullImageUrl = buildImageUrl(imageUrl);

    return (
        <TouchableOpacity
            style={styles.propertyCard}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Imagen */}
            <View style={styles.propertyImageContainer}>
                {fullImageUrl ? (
                    <Image
                        source={{ uri: fullImageUrl }}
                        style={styles.propertyImage}
                        onError={(e) => {
                            console.error('[ProfilePropertyCard] Image load error:', {
                                propertyId: property.id,
                                url: fullImageUrl,
                                error: e.nativeEvent.error,
                            });
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
                <Text style={styles.propertyTitle} numberOfLines={1}>
                    {property.title}
                </Text>
                <Text style={styles.propertyPrice}>
                    {formatPriceWithCurrency(property.price, property.currency || 'BOB')}
                </Text>
            </View>

            {/* Botón de opciones */}
            <TouchableOpacity
                style={styles.propertyOptionsButton}
                onPress={(e) => {
                    e.stopPropagation();
                    onOptionsPress();
                }}
            >
                <MaterialCommunityIcons name="dots-vertical" size={24} color="#5585b5" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    propertyCard: {
        width: '100%',
        marginVertical: 8,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
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
        marginRight: 16,
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
