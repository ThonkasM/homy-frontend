import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    footer: {
        alignItems: 'center',
        paddingBottom: 24,
        marginTop: 20,
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: '500',
    },
});

export default function AuthFooter() {
    return (
        <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 HO-MY. Todos los derechos reservados.</Text>
        </View>
    );
}
