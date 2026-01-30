import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    termsContainer: {
        marginBottom: 16,
    },
    termsText: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 18,
        textAlign: 'center' as any,
    },
    termsLink: {
        color: '#3b82f6',
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center' as any,
        marginBottom: 20,
    } as any,
    registerButtonDisabled: {
        backgroundColor: '#94a3b8',
    } as any,
    registerButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row' as any,
        alignItems: 'center' as any,
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#94a3b8',
        fontSize: 13,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row' as any,
        justifyContent: 'center' as any,
        alignItems: 'center' as any,
        marginTop: 16,
    },
    loginText: {
        fontSize: 14,
        color: '#64748b',
    },
    loginLink: {
        color: '#3b82f6',
        fontWeight: '600',
        fontSize: 14,
        textDecorationLine: 'underline',
    } as any,
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

            <View
                style={[
                    styles.registerButton,
                    isLoading && styles.registerButtonDisabled,
                    { cursor: isLoading ? 'not-allowed' : 'pointer' } as any
                ]}
                // @ts-ignore
                onClick={isLoading ? undefined : onPress}
                onMouseEnter={(e: any) => {
                    if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3)';
                    }
                }}
                onMouseLeave={(e: any) => {
                    if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }
                }}
            >
                {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                )}
            </View>

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.dividerLine} />
            </View>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                <View
                    style={{ cursor: 'pointer' } as any}
                    // @ts-ignore
                    onClick={isLoading ? undefined : () => router.push('/login')}
                >
                    <Text style={[styles.loginLink, isLoading && { opacity: 0.5 }]}>
                        Inicia sesión aquí
                    </Text>
                </View>
            </View>
        </View>
    );
}
