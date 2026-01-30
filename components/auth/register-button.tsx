import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
    termsContainer: {
        marginBottom: 20,
    },
    termsText: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 18,
    },
    termsLink: {
        color: '#3b82f6',
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    registerButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    dividerLine: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 16,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginText: {
        fontSize: 14,
        color: '#64748b',
    },
    loginLink: {
        color: '#3b82f6',
        fontWeight: '700',
        fontSize: 14,
    },
});

interface RegisterButtonProps {
    onPress: () => void;
    isLoading: boolean;
}

export default function RegisterButton({ onPress, isLoading }: RegisterButtonProps) {
    const router = useRouter();

    return (
        <View>
            <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                    Al registrarte, aceptas nuestros{' '}
                    <Text style={styles.termsLink}>Términos y Condiciones</Text> y nuestra{' '}
                    <Text style={styles.termsLink}>Política de Privacidad</Text>
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                activeOpacity={0.8}
                onPress={onPress}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
                )}
            </TouchableOpacity>

            <View style={styles.dividerLine} />

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity disabled={isLoading} onPress={() => router.push('/login')}>
                    <Text style={styles.loginLink}>Inicia sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
