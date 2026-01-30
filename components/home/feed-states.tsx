import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingState() {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5585b5" />
            <Text style={styles.loadingText}>Cargando propiedades...</Text>
        </View>
    );
}

export function EmptyState() {
    return (
        <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 64 }}>🏠</Text>
            <Text style={styles.emptyText}>No hay propiedades disponibles</Text>
        </View>
    );
}

export function ErrorMessage({ message }: { message: string }) {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {message}</Text>
        </View>
    );
}

interface LoadingFooterProps {
    loading: boolean;
    hasMore: boolean;
    totalItems: number;
}

export function LoadingFooter({ loading, hasMore, totalItems }: LoadingFooterProps) {
    if (loading) {
        return (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#5585b5" />
            </View>
        );
    }

    if (!hasMore && totalItems > 0) {
        return (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <Text style={{ color: '#94a3b8', fontSize: 14 }}>No hay más propiedades</Text>
            </View>
        );
    }

    return <View style={{ height: 20 }} />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    loadingText: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 16,
        fontWeight: '500',
    },
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
    },
    errorContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
        padding: 14,
        backgroundColor: '#fee2e2',
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
    },
    errorText: {
        fontSize: 14,
        color: '#991b1b',
        fontWeight: '500',
    },
});
