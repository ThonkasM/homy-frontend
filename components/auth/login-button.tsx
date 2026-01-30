import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
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
        marginHorizontal: 12,
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '600',
    },
    signupSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#64748b',
        fontSize: 14,
    },
    signupLink: {
        color: '#3b82f6',
        fontSize: 14,
        fontWeight: '600',
    },
});

interface LoginButtonProps {
    onPress: () => void;
    isLoading: boolean;
}

export default function LoginButton({ onPress, isLoading }: LoginButtonProps) {
    const router = useRouter();

    return (
        <View>
            <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                activeOpacity={0.8}
                onPress={onPress}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
                )}
            </TouchableOpacity>

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>O</Text>
                <View style={styles.dividerLine} />
            </View>

            <View style={styles.signupSection}>
                <Text style={styles.signupText}>¿No tienes cuenta? </Text>
                <TouchableOpacity disabled={isLoading} onPress={() => router.push('/register')}>
                    <Text style={styles.signupLink}>Regístrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
