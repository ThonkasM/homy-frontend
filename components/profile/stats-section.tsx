import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatsSectionProps {
    propertiesCount: number;
    reviewsCount?: number;
    rating?: number;
}

export default function StatsSection({
    propertiesCount,
    reviewsCount = 0,
    rating = 0.0
}: StatsSectionProps) {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>{propertiesCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>{reviewsCount}</Text>
                <Text style={styles.statLabel}>Reseñas</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>{rating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Rating</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#ffffff',
        marginTop: -16,
        marginHorizontal: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#f8f9ff',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e8ecff',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#5585b5',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        textAlign: 'center',
    },
});
