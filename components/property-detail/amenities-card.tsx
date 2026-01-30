import { PROPERTY_TYPES_CONFIG } from '@/config/property-types.config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AmenitiesCardProps {
    amenities: string[];
    propertyType: string;
}

export default function AmenitiesCard({ amenities, propertyType }: AmenitiesCardProps) {
    if (!amenities || amenities.length === 0) {
        return null;
    }

    return (
        <View style={styles.cardWhite}>
            <Text style={styles.sectionTitle}>Amenidades</Text>
            <View style={styles.amenitiesList}>
                {amenities.map((amenityId: string, index: number) => {
                    const config = PROPERTY_TYPES_CONFIG[propertyType];
                    const amenityConfig = config?.amenities.find((a) => a.id === amenityId);
                    const amenityLabel = amenityConfig?.label || amenityId;

                    return (
                        <View key={index} style={styles.amenityTag}>
                            <MaterialCommunityIcons name="check" size={14} color="#5585b5" />
                            <Text style={styles.amenityText}>{amenityLabel}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardWhite: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#5585b5',
        marginBottom: 12,
        textTransform: 'capitalize',
    },
    amenitiesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    amenityTag: {
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    amenityText: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '500',
    },
});
