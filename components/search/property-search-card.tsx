import { Property } from '@/hooks/use-properties';
import { SERVER_BASE_URL } from '@/services/api';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PropertySearchCardProps {
    property: Property;
    onPress: (propertyId: string) => void;
}

export default function PropertySearchCard({ property, onPress }: PropertySearchCardProps) {
    const buildImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${SERVER_BASE_URL}${cleanPath}`;
    };

    const imageUrl = buildImageUrl(property.images?.[0]?.url);

    return (
        <TouchableOpacity
            style={styles.propertyCard}
            onPress={() => onPress(property.id)}
            activeOpacity={0.8}
        >
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.propertyImage} />
            ) : (
                <View style={[styles.propertyImage, styles.propertyImagePlaceholder]}>
                    <Text style={styles.placeholderEmoji}>🏠</Text>
                </View>
            )}
            <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle} numberOfLines={2}>
                    {property.title}
                </Text>
                <Text style={styles.propertyPrice}>
                    {property.currency || 'BOB'} {property.price.toLocaleString()}
                </Text>
                <Text style={styles.propertyMeta} numberOfLines={1}>
                    📍 {property.city} • {property.address}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    propertyCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    propertyImage: {
        width: 100,
        height: 100,
        backgroundColor: '#f1f5f9',
    },
    propertyImagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderEmoji: {
        fontSize: 32,
    },
    propertyInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    propertyTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    propertyPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#5585b5',
        marginBottom: 4,
    },
    propertyMeta: {
        fontSize: 13,
        color: '#64748b',
    },
});
