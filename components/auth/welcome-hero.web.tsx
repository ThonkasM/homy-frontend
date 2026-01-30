import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    heroSection: {
        maxWidth: 600,
    },
    heroTitle: {
        fontSize: 56,
        fontWeight: '800',
        color: '#0f172a',
        lineHeight: 64,
        marginBottom: 24,
        letterSpacing: -1,
    },
    heroSubtitle: {
        fontSize: 20,
        color: '#64748b',
        lineHeight: 32,
        fontWeight: '400',
    },
});

export default function WelcomeHero() {
    return (
        <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
                Encuentra tu Espacio Perfecto
            </Text>
            <Text style={styles.heroSubtitle}>
                Descubre miles de propiedades disponibles para compra, alquiler o anticrético. Tu próximo hogar está a solo un clic de distancia.
            </Text>
        </View>
    );
}
