import AuthFooter from "@/components/auth/auth-footer";
import AvatarSelector from "@/components/auth/avatar-selector";
import RegisterButton from "@/components/auth/register-button";
import RegisterForm from "@/components/auth/register-form";
import RegisterTitle from "@/components/auth/register-title";
import WelcomeLogo from "@/components/auth/welcome-logo";
import { useAuth } from "@/context/auth-context";
import { uploadService } from "@/services/upload-service";
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
        overflowY: 'auto' as any,
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

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading, error, clearError, updateUser } = useAuth();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            if (Platform.OS === 'web') {
                window.alert("Por favor completa todos los campos obligatorios");
            } else {
                Alert.alert("Error", "Por favor completa todos los campos obligatorios");
            }
            return;
        }

        if (!validateEmail(email)) {
            if (Platform.OS === 'web') {
                window.alert("Por favor ingresa un email válido");
            } else {
                Alert.alert("Error", "Por favor ingresa un email válido");
            }
            return;
        }

        if (password.length < 6) {
            if (Platform.OS === 'web') {
                window.alert("La contraseña debe tener al menos 6 caracteres");
            } else {
                Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
            }
            return;
        }

        if (password !== confirmPassword) {
            if (Platform.OS === 'web') {
                window.alert("Las contraseñas no coinciden");
            } else {
                Alert.alert("Error", "Las contraseñas no coinciden");
            }
            return;
        }

        try {
            clearError();
            console.log('Iniciando registro desde register.web.tsx con email:', email);
            const registrationToken = await register(email, password, firstName, lastName, phone || undefined);

            if (avatarUri && registrationToken) {
                try {
                    setUploading(true);
                    console.log('📤 Subiendo avatar después del registro...');
                    const uploadResponse = await uploadService.uploadAvatar(avatarUri, registrationToken);
                    console.log('✅ Avatar subido exitosamente');

                    await updateUser({
                        ...uploadResponse.user,
                        role: 'user',
                        createdAt: new Date().toISOString(),
                    });

                    if (Platform.OS === 'web') {
                        window.alert('Cuenta creada y avatar subido exitosamente');
                    } else {
                        Alert.alert('Éxito', 'Cuenta creada y avatar subido exitosamente');
                    }
                } catch (uploadErr: any) {
                    console.error('⚠️ Error al subir avatar:', uploadErr.message);
                    if (Platform.OS === 'web') {
                        window.alert('Tu cuenta se creó correctamente, pero no pudimos subir tu foto. Puedes intentarlo después desde tu perfil.');
                    } else {
                        Alert.alert('Registro exitoso', 'Tu cuenta se creó correctamente, pero no pudimos subir tu foto. Puedes intentarlo después desde tu perfil.');
                    }
                }
            } else {
                if (Platform.OS === 'web') {
                    window.alert('Tu cuenta ha sido creada exitosamente');
                } else {
                    Alert.alert('Éxito', 'Tu cuenta ha sido creada exitosamente');
                }
            }

            console.log('Registro completado, navegando a home...');
            router.replace('/(tabs)/home');
        } catch (err: any) {
            console.error('Error capturado en register.web.tsx:', err);
            if (Platform.OS === 'web') {
                window.alert(error || "No pudimos crear la cuenta. Por favor intenta de nuevo.");
            } else {
                Alert.alert("Error de Registro", error || "No pudimos crear la cuenta. Por favor intenta de nuevo.");
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainContent}>
                    <View style={styles.splitLayout}>
                        {/* Left Section - Hero/Welcome */}
                        <View style={styles.leftSection}>
                            <View style={styles.leftContent}>
                                <WelcomeLogo />
                                <RegisterTitle />
                            </View>
                        </View>

                        {/* Right Section - Register Form */}
                        <View style={styles.rightSection}>
                            <View style={styles.formContainer}>
                                <AvatarSelector avatarUri={avatarUri} onAvatarChange={setAvatarUri} />
                                <RegisterForm
                                    firstName={firstName}
                                    lastName={lastName}
                                    email={email}
                                    password={password}
                                    confirmPassword={confirmPassword}
                                    phone={phone}
                                    onFirstNameChange={setFirstName}
                                    onLastNameChange={setLastName}
                                    onEmailChange={setEmail}
                                    onPasswordChange={setPassword}
                                    onConfirmPasswordChange={setConfirmPassword}
                                    onPhoneChange={setPhone}
                                    disabled={isLoading || uploading}
                                />
                                <RegisterButton onPress={handleRegister} isLoading={isLoading || uploading} />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.footerWrapper}>
                    <View style={styles.footerContent}>
                        <AuthFooter />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
