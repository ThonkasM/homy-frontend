import { formatPriceWithCurrency } from '@/config/currencies.config';
import { SERVER_BASE_URL } from '@/services/api';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PropertyPreviewCardProps {
    property: any;
    onClose: () => void;
}

export default function PropertyPreviewCard({ property, onClose }: PropertyPreviewCardProps) {
    const router = useRouter();

    const buildImageUrl = (imagePath: string | undefined): string => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${SERVER_BASE_URL}${cleanPath}`;
    };

    return (
        <View style={styles.previewCardContainer}>
            <TouchableOpacity
                style={styles.previewCard}
                activeOpacity={0.9}
                onPress={() => router.push(`/property-detail/${property.id}`)}
            >
                {/* Botón cerrar */}
                <TouchableOpacity
                    style={styles.cardCloseButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    <Text style={styles.cardCloseButtonText}>✕</Text>
                </TouchableOpacity>

                {/* Contenedor con imagen y contenido lado a lado */}
                <View style={styles.cardContent}>
                    {/* Imagen pequeña */}
                    <View style={styles.cardImageContainer}>
                        {property.images && property.images.length > 0 && buildImageUrl(property.images[0].url) ? (
                            <Image
                                source={{ uri: buildImageUrl(property.images[0].url) }}
                                style={styles.cardImage}
                            />
                        ) : (
                            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                                <Text style={styles.cardImageEmoji}>🏠</Text>
                            </View>
                        )}
                    </View>

                    {/* Información: título, dirección, precio */}
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle} numberOfLines={2}>
                            {property.title}
                        </Text>
                        <Text style={styles.cardAddress} numberOfLines={1}>
                            📍 {property.address}
                        </Text>
                        <Text style={styles.cardPrice}>
                            {formatPriceWithCurrency(property.price, property.currency || 'BOB')}
                        </Text>
                    </View>
                </View>

                {/* Indicador de más detalles */}
                <Text style={styles.cardHint}>Toca para ver más detalles →</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    previewCardContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        zIndex: 100,
    },
    previewCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    cardCloseButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    cardCloseButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
    },
    cardImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f1f5f9',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardImagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e5e7eb',
    },
    cardImageEmoji: {
        fontSize: 32,
    },
    cardInfo: {
        flex: 1,
        gap: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        lineHeight: 22,
    },
    cardAddress: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: '#10b981',
        marginTop: 4,
    },
    cardHint: {
        fontSize: 11,
        color: '#9ca3af',
        fontStyle: 'italic',
        textAlign: 'right',
        paddingRight: 12,
        paddingBottom: 8,
    },
});
