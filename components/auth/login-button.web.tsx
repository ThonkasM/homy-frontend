import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center' as any,
        marginBottom: 20,
    } as any,
    loginButtonDisabled: {
        backgroundColor: '#94a3b8',
    } as any,
    loginButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row',
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
    signupSection: {
        flexDirection: 'row',
        justifyContent: 'center' as any,
        alignItems: 'center' as any,
        marginTop: 16,
    },
    signupText: {
        color: '#64748b',
        fontSize: 14,
    },
    signupLink: {
        color: '#3b82f6',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    } as any,
});

interface LoginButtonProps {
    onPress: () => void;
    isLoading: boolean;
}

export default function LoginButton({ onPress, isLoading }: LoginButtonProps) {
    const router = useRouter();

    return (
        <View>
            <View
                style={[
                    styles.loginButton,
                    isLoading && styles.loginButtonDisabled,
                    { cursor: isLoading ? 'not-allowed' : 'pointer' } as any
                ]}
                // @ts-ignore - web-only props
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
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                )}
            </View>

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.dividerLine} />
            </View>

            <View style={styles.signupSection}>
                <Text style={styles.signupText}>¿No tienes cuenta? </Text>
                <View
                    style={{ cursor: 'pointer' } as any}
                    // @ts-ignore - web-only props
                    onClick={isLoading ? undefined : () => router.push('/register')}
                >
                    <Text style={[styles.signupLink, isLoading && { opacity: 0.5 }]}>
                        Regístrate aquí
                    </Text>
                </View>
            </View>
        </View>
    );
}
