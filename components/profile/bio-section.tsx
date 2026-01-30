import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BioSectionProps {
    bio?: string;
}

export default function BioSection({ bio }: BioSectionProps) {
    return (
        <View style={styles.bioCardSection}>
            <Text style={styles.bioLabel}>Acerca de mí</Text>
            <Text style={bio ? styles.bioText : styles.emptyBioText}>
                {bio || 'Cuéntanos sobre ti añadiendo una biografía desde el menú'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bioCardSection: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    bioLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5585b5',
        marginBottom: 8,
    },
    bioText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
        fontWeight: '400',
    },
    emptyBioText: {
        fontSize: 15,
        color: '#94a3b8',
        fontStyle: 'italic',
    },
});
