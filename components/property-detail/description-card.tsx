import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DescriptionCardProps {
    description: string;
    limit?: number;
    onShowMore: () => void;
}

export default function DescriptionCard({
    description,
    limit = 150,
    onShowMore,
}: DescriptionCardProps) {
    const truncateDescription = (text: string, charLimit: number): { truncated: string; isTruncated: boolean } => {
        if (text.length > charLimit) {
            return {
                truncated: text.substring(0, charLimit).trim() + '...',
                isTruncated: true,
            };
        }
        return {
            truncated: text,
            isTruncated: false,
        };
    };

    const { truncated, isTruncated } = truncateDescription(description, limit);

    return (
        <View style={styles.cardWhite}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.descriptionTruncated}>{truncated}</Text>
            {isTruncated && (
                <TouchableOpacity
                    style={styles.showMoreButton}
                    onPress={onShowMore}
                    activeOpacity={0.7}
                >
                    <Text style={styles.showMoreButtonText}>Mostrar más</Text>
                </TouchableOpacity>
            )}
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
    descriptionTruncated: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
        fontWeight: '400',
    },
    showMoreButton: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#f0f4ff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e7ff',
        alignSelf: 'flex-start',
    },
    showMoreButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5585b5',
    },
});
