import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    headerSection: {
        marginBottom: 28,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 8,
        lineHeight: 36,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
});

export default function LoginTitle() {
    return (
        <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>¡Bienvenido de vuelta!</Text>
            <Text style={styles.headerSubtitle}>Inicia sesión para continuar</Text>
        </View>
    );
}
