import { useAuth } from '@/context/auth-context';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        gap: 12,
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    secondaryButton: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#3b82f6',
    },
    secondaryButtonText: {
        color: '#3b82f6',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    guestButton: {
        backgroundColor: '#f1f5f9',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },
    guestButtonText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default function WelcomeButtons() {
    const router = useRouter();
    const { loginAsGuest } = useAuth();

    const handleGuestLogin = async () => {
        try {
            await loginAsGuest();
            // El _layout.tsx se encargará de redirigir automáticamente
        } catch (error) {
            console.error('Error al iniciar como invitado:', error);
        }
    };

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={() => router.push('/login')}
            >
                <Text style={styles.primaryButtonText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={() => router.push('/register')}
            >
                <Text style={styles.secondaryButtonText}>CREAR CUENTA</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.guestButton}
                activeOpacity={0.8}
                onPress={handleGuestLogin}
            >
                <Text style={styles.guestButtonText}>INICIAR COMO INVITADO</Text>
            </TouchableOpacity>
        </View>
    );
}
