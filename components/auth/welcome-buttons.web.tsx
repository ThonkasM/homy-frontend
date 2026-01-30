import { useAuth } from '@/context/auth-context';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        maxWidth: 500,
        gap: 16,
        marginTop: 48,
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    primaryButtonHover: {
        backgroundColor: '#2563eb',
        transform: [{ translateY: -2 }],
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#cbd5e1',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    secondaryButtonHover: {
        borderColor: '#3b82f6',
        backgroundColor: '#f0f9ff',
    },
    secondaryButtonText: {
        color: '#475569',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '500',
    },
    guestButton: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    guestButtonText: {
        color: '#64748b',
        fontSize: 15,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default function WelcomeButtons() {
    const router = useRouter();
    const { loginAsGuest } = useAuth();

    const handleGuestLogin = async () => {
        try {
            await loginAsGuest();
        } catch (error) {
            console.error('Error al iniciar como invitado:', error);
        }
    };

    return (
        <View style={styles.buttonContainer}>
            <View
                style={styles.primaryButton}
                // @ts-ignore - web-only props
                onMouseEnter={(e: any) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e: any) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => router.push('/login')}
            >
                <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
            </View>

            <View
                style={styles.secondaryButton}
                // @ts-ignore - web-only props
                onMouseEnter={(e: any) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e: any) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => router.push('/register')}
            >
                <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
            </View>

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.dividerLine} />
            </View>

            <View
                style={styles.guestButton}
                // @ts-ignore - web-only props
                onClick={handleGuestLogin}
            >
                <Text style={styles.guestButtonText}>Continuar como invitado</Text>
            </View>
        </View>
    );
}
