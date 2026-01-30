import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SearchEmptyStateProps {
    type: 'initial' | 'no-results' | 'loading';
    searchQuery?: string;
    activeTab?: 'properties' | 'users';
}

export default function SearchEmptyState({ type, searchQuery, activeTab }: SearchEmptyStateProps) {
    if (type === 'loading') {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Buscando...</Text>
            </View>
        );
    }

    if (type === 'initial') {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="search" size={64} color="#cbd5e1" />
                <Text style={styles.emptyText}>
                    Escribe algo para buscar {activeTab === 'properties' ? 'propiedades' : 'usuarios'}
                </Text>
            </View>
        );
    }

    if (type === 'no-results') {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="sad-outline" size={64} color="#cbd5e1" />
                <Text style={styles.emptyText}>
                    No se encontraron resultados para "{searchQuery}"
                </Text>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 16,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});
