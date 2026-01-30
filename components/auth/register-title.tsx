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

export default function RegisterTitle() {
    return (
        <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Crea tu Cuenta</Text>
            <Text style={styles.headerSubtitle}>Únete y encuentra tu espacio ideal</Text>
        </View>
    );
}
