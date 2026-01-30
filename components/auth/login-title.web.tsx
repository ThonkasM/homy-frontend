import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    headerSection: {
        maxWidth: 600,
    },
    headerTitle: {
        fontSize: 48,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 16,
        letterSpacing: -1,
        lineHeight: 56,
    },
    headerSubtitle: {
        fontSize: 18,
        color: '#64748b',
        lineHeight: 28,
    },
});

export default function LoginTitle() {
    return (
        <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>¡Bienvenido de vuelta!</Text>
            <Text style={styles.headerSubtitle}>Inicia sesión en tu cuenta para continuar explorando propiedades</Text>
        </View>
    );
}
