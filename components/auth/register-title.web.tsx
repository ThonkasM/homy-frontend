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

export default function RegisterTitle() {
    return (
        <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Crea tu Cuenta</Text>
            <Text style={styles.headerSubtitle}>Únete a nuestra plataforma y descubre miles de propiedades que se ajustan a tus necesidades</Text>
        </View>
    );
}
