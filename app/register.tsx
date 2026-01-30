import AuthFooter from "@/components/auth/auth-footer";
import AvatarSelector from "@/components/auth/avatar-selector";
import LoginHeader from "@/components/auth/login-header";
import RegisterButton from "@/components/auth/register-button";
import RegisterForm from "@/components/auth/register-form";
import RegisterTitle from "@/components/auth/register-title";
import { useAuth } from "@/context/auth-context";
import { uploadService } from "@/services/upload-service";
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
            Alert.alert("Error", "Por favor completa todos los campos obligatorios");
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

        if (password !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        try {
            clearError();
            console.log('Iniciando registro desde pantalla con email:', email);
            const registrationToken = await register(email, password, firstName, lastName, phone || undefined);

            // El registro fue exitoso y el usuario ya está logueado
            // Si el usuario seleccionó un avatar, subirlo ahora
            if (avatarUri && registrationToken) {
                try {
                    setUploading(true);
                    console.log('📤 Subiendo avatar después del registro...');
                    const uploadResponse = await uploadService.uploadAvatar(avatarUri, registrationToken);
                    console.log('✅ Avatar subido exitosamente');

                    // Actualizar el usuario en el contexto con el avatar
                    await updateUser({
                        ...uploadResponse.user,
                        role: 'user',
                        createdAt: new Date().toISOString(),
                    });
                    Alert.alert('Éxito', 'Cuenta creada y avatar subido exitosamente');
                } catch (uploadErr: any) {
                    console.error('⚠️ Error al subir avatar:', uploadErr.message);
                    // No fallamos el registro si la foto falla, pero notificamos al usuario
                    Alert.alert('Registro exitoso', 'Tu cuenta se creó correctamente, pero no pudimos subir tu foto. Puedes intentarlo después desde tu perfil.');
                }
            } else {
                Alert.alert('Éxito', 'Tu cuenta ha sido creada exitosamente');
            }

            // Navegar al home después del registro exitoso
            console.log('Registro completado, navegando a home...');
            router.replace('/(tabs)/home');
        } catch (err: any) {
            console.error('Error capturado en register.tsx:', err);
            Alert.alert("Error de Registro", error || "No pudimos crear la cuenta. Por favor intenta de nuevo.");
        } finally {
            setUploading(false);
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
                        <RegisterTitle />
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
                        <AuthFooter />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
