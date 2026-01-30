import AuthFooter from "@/components/auth/auth-footer";
import LoginButton from "@/components/auth/login-button";
import LoginForm from "@/components/auth/login-form";
import LoginTitle from "@/components/auth/login-title";
import WelcomeLogo from "@/components/auth/welcome-logo";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        minHeight: '100vh' as any,
        display: 'flex' as any,
        flexDirection: 'column' as any,
    },
    mainContent: {
        flex: 1,
        display: 'flex' as any,
    },
    splitLayout: {
        flexDirection: 'row' as any,
        minHeight: '100vh' as any,
        maxWidth: 1440,
        marginHorizontal: 'auto' as any,
        width: '100%',
    },
    leftSection: {
        flex: 1,
        paddingHorizontal: 80,
        paddingVertical: 80,
        display: 'flex' as any,
        justifyContent: 'center' as any,
        alignItems: 'center' as any,
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)' as any,
        position: 'sticky' as any,
        top: 0,
        alignSelf: 'flex-start' as any,
        height: '100vh' as any,
    },
    leftContent: {
        display: 'flex' as any,
        flexDirection: 'column' as any,
        alignItems: 'center' as any,
        gap: 40,
        maxWidth: 600,
    },
    rightSection: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingHorizontal: 80,
        paddingVertical: 80,
        display: 'flex' as any,
        justifyContent: 'center' as any,
        alignItems: 'center' as any,
        borderLeftWidth: 1,
        borderLeftColor: '#e2e8f0',
    },
    formContainer: {
        width: '100%',
        maxWidth: 460,
    },
    footerWrapper: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    footerContent: {
        maxWidth: 1440,
        marginHorizontal: 'auto' as any,
        paddingHorizontal: 80,
        paddingVertical: 24,
    },
});

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            const alertFn = Platform.OS === 'web' ? window.confirm : Alert.alert;
            if (Platform.OS === 'web') {
                window.alert("Por favor completa todos los campos");
            } else {
                Alert.alert("Error", "Por favor completa todos los campos");
            }
            return;
        }

        try {
            clearError();
            console.log('Intentando login desde login.web.tsx con email:', email);
            await login(email, password);
            console.log('Login exitoso, navegando...');
            router.replace('/(tabs)/home');
        } catch (err: any) {
            console.error('Error capturado en login.web.tsx:', err);
            if (Platform.OS === 'web') {
                window.alert(error || "Credenciales incorrectas. Por favor verifica tus datos.");
            } else {
                Alert.alert("Error de Login", error || "Credenciales incorrectas. Por favor verifica tus datos.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Split Content */}
                <View style={styles.mainContent}>
                    <View style={styles.splitLayout}>
                        {/* Left Section - Hero */}
                        <View style={styles.leftSection}>
                            <View style={styles.leftContent}>
                                <WelcomeLogo />
                                <LoginTitle />
                            </View>
                        </View>

                        {/* Right Section - Form */}
                        <View style={styles.rightSection}>
                            <View style={styles.formContainer}>
                                <LoginForm
                                    email={email}
                                    password={password}
                                    onEmailChange={setEmail}
                                    onPasswordChange={setPassword}
                                />
                                <LoginButton onPress={handleLogin} isLoading={isLoading} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footerWrapper}>
                    <View style={styles.footerContent}>
                        <AuthFooter />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
