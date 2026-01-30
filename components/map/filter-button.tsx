import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FilterButtonProps {
    activeCount: number;
    totalCount: number;
    onPress: () => void;
}

export default function FilterButton({
    activeCount,
    totalCount,
    onPress,
}: FilterButtonProps) {
    const showBadge = activeCount < totalCount;

    return (
        <View style={styles.filterButtonContainer}>
            <TouchableOpacity
                style={styles.filterButton}
                onPress={onPress}
            >
                <Ionicons name="filter" size={20} color="#5585b5" />
                <Text style={styles.filterButtonText}>Filtros</Text>
                {showBadge && (
                    <View style={styles.filterBadge}>
                        <Text style={styles.filterBadgeText}>{activeCount}</Text>
                    </View>
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
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        gap: 8,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5585b5',
    },
    filterBadge: {
        marginLeft: 'auto',
        backgroundColor: '#ef4444',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterBadgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
});
