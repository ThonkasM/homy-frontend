import AuthFooter from "@/components/auth/auth-footer";
import LoginButton from "@/components/auth/login-button";
import LoginForm from "@/components/auth/login-form";
import LoginHeader from "@/components/auth/login-header";
import LoginTitle from "@/components/auth/login-title";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    topSection: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 12,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#f0f4ff',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#3b82f6',
    },
    logoText: {
        fontSize: 40,
    },
    logoImage: {
        width: '150%',
        height: '150%',
    },
    appName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e40af',
        marginBottom: 4,
    },
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
    formContainer: {
        marginBottom: 24,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e40af',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    emailInput: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        marginBottom: 20,
        color: '#0f172a',
        backgroundColor: '#f8fafc',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        backgroundColor: '#f8fafc',
        marginBottom: 12,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        color: '#0f172a',
    },
    showPasswordBtn: {
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    showPasswordText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3b82f6',
    },
    forgotContainer: {
        marginBottom: 24,
    },
    forgotText: {
        fontSize: 13,
        color: '#3b82f6',
        fontWeight: '600',
        textAlign: 'right',
    },
    loginButton: {
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
    loginButtonLoading: {
        opacity: 0.8,
    },
    loginButtonText: {
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
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    signupText: {
        fontSize: 14,
        color: '#64748b',
    },
    signupLink: {
        color: '#3b82f6',
        fontWeight: '700',
        fontSize: 14,
    },
    benefitsSection: {
        backgroundColor: '#f0f4ff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    benefitItemLast: {
        marginBottom: 0,
    },
    benefitIcon: {
        fontSize: 18,
        marginRight: 12,
        width: 24,
    },
    benefitText: {
        fontSize: 13,
        color: '#1e40af',
        fontWeight: '500',
        flex: 1,
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 24,
        marginTop: 16,
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: '500',
    },
});

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor completa todos los campos");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Error", "Por favor ingresa un email válido");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            clearError();
            await login(email, password);
            // Login exitoso, navegar al home
            router.replace('/(tabs)/home');
        } catch (err: any) {
            Alert.alert("Error de Login", error || "No pudimos iniciar sesión. Por favor intenta de nuevo.");
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={[styles.scrollContainer, { paddingBottom: 40 }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <LoginHeader />
                        <LoginTitle />
                        <LoginForm
                            email={email}
                            password={password}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                        />
                        <LoginButton onPress={handleLogin} isLoading={isLoading} />
                        <AuthFooter />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
