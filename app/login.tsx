import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
        flex: 1,
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
            // El login fue exitoso, el navegador se encargará de redirigir
            // (vamos a manejar esto con un componente protegido)
        } catch (err: any) {
            Alert.alert("Error de Login", error || "No pudimos iniciar sesión. Por favor intenta de nuevo.");
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {/* Top Section - Logo & Brand */}
                    <View style={styles.topSection}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>🏡</Text>
                        </View>
                        <Text style={styles.appName}>Ho-My</Text>
                    </View>

                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <Text style={styles.headerTitle}>
                            Accede a tu Cuenta
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Gestiona tus propiedades y solicitudes
                        </Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        {/* Email Input */}
                        <Text style={styles.fieldLabel}>Correo Electrónico</Text>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="tu@email.com"
                            placeholderTextColor="#cbd5e1"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />

                        {/* Password Input */}
                        <Text style={styles.fieldLabel}>Contraseña</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Contraseña"
                                placeholderTextColor="#cbd5e1"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                style={styles.showPasswordBtn}
                            >
                                <Text style={styles.showPasswordText}>
                                    {showPassword ? "Ocultar" : "Mostrar"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Forgot Password */}
                        <View style={styles.forgotContainer}>
                            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isLoading}
                            style={[styles.loginButton, isLoading && styles.loginButtonLoading]}
                        >
                            <Text style={styles.loginButtonText}>
                                {isLoading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerLine} />

                        {/* Sign Up */}
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>¿No tienes cuenta? </Text>
                            <TouchableOpacity disabled={isLoading} onPress={() => router.push('/register')}>
                                <Text style={styles.signupLink}>Crea una aquí</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>© 2025 Homi. Todos los derechos reservados.</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
