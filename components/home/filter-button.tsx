import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilterButtonProps {
    onPress: () => void;
    hasActiveFilters: boolean;
}

export default function FilterButton({ onPress, hasActiveFilters }: FilterButtonProps) {
    return (
        <View style={styles.filterButtonContainer}>
            <TouchableOpacity
                style={styles.filterButton}
                onPress={onPress}
            >
                <Ionicons name="filter" size={20} color="#5585b5" />
                <Text style={styles.filterButtonText}>Filtros</Text>
                {hasActiveFilters && (
                    <View style={styles.filterBadge} />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    filterButtonContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    filterButton: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#5585b5',
        gap: 8,
        shadowColor: '#5585b5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    filterButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#5585b5',
        letterSpacing: 0.3,
    },
    filterBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        backgroundColor: '#ef4444',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
});
