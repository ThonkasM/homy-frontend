import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    heroSection: {
        marginBottom: 40,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#0f172a',
        lineHeight: 44,
        marginBottom: 16,
    },
    heroSubtitle: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
        marginBottom: 28,
    },
});

export default function WelcomeHero() {
    return (
        <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
                Encuentra tu{'\n'}
                Espacio Perfecto
            </Text>
            <Text style={styles.heroSubtitle}>
                Descubre miles de propiedades disponibles para compra, alquiler o anticrético
            </Text>
        </View>
    );
}
