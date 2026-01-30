import { PropertyTypeConfig } from '@/config/property-types.config';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AmenitiesSelectorProps {
    config: PropertyTypeConfig | null;
    selectedAmenities: string[];
    onToggle: (amenityId: string) => void;
}

export default function AmenitiesSelector({
    config,
    selectedAmenities,
    onToggle,
}: AmenitiesSelectorProps) {
    if (!config || config.amenities.length === 0) {
        return (
            <Text style={{ color: '#64748b' }}>
                Este tipo de propiedad no tiene amenidades disponibles
            </Text>
        );
    }

    return (
        <View style={styles.checkboxContainer}>
            {config.amenities.map((amenity) => (
                <TouchableOpacity
                    key={amenity.id}
                    style={[
                        styles.checkboxItem,
                        selectedAmenities.includes(amenity.id) && styles.checkboxItemActive,
                    ]}
                    onPress={() => onToggle(amenity.id)}
                >
                    <Text
                        style={[
                            styles.checkboxText,
                            selectedAmenities.includes(amenity.id) && styles.checkboxTextActive,
                        ]}
                    >
                        {selectedAmenities.includes(amenity.id) ? '✓' : '○'} {amenity.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    checkboxItem: {
        backgroundColor: '#f0f4ff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
    },
    checkboxItemActive: {
        backgroundColor: '#5585b5',
        borderColor: '#5585b5',
    },
    checkboxText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5585b5',
    },
    checkboxTextActive: {
        color: '#ffffff',
    },
});
