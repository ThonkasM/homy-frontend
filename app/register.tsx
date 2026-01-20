import { useAuth } from "@/context/auth-context";
import { uploadService } from "@/services/upload-service";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    textInput: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        marginBottom: 16,
        color: '#0f172a',
        backgroundColor: '#f8fafc',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    inputHalf: {
        flex: 1,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        backgroundColor: '#f8fafc',
        marginBottom: 16,
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
    termsContainer: {
        marginBottom: 20,
    },
    termsText: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 18,
    },
    termsLink: {
        color: '#3b82f6',
        fontWeight: '600',
    },
    registerButton: {
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
    registerButtonLoading: {
        opacity: 0.8,
    },
    registerButtonText: {
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginText: {
        fontSize: 14,
        color: '#64748b',
    },
    loginLink: {
        color: '#3b82f6',
        fontWeight: '700',
        fontSize: 14,
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
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginBottom: 12,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    avatarLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e40af',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f4ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#3b82f6',
        marginBottom: 12,
        overflow: 'hidden',
    },
    avatarImage: {
        width: 100,
        height: 100,
    },
    selectPhotoBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#dbeafe',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    selectPhotoBtnText: {
        color: '#3b82f6',
        fontWeight: '600',
        fontSize: 13,
    },
    removePhotoBtn: {
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#fee2e2',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    removePhotoBtnText: {
        color: '#ef4444',
        fontWeight: '600',
        fontSize: 12,
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setAvatarUri(result.assets[0].uri);
            }
        } catch (err) {
            Alert.alert('Error', 'No pudimos acceder a tu galería de fotos');
        }
    };

    const removeAvatar = () => {
        setAvatarUri(null);
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

        if (!agreeTerms) {
            Alert.alert("Error", "Debes aceptar los términos y condiciones");
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

            // El navegador se encargará de redirigir a home
            console.log('Registro completado, esperando redirección...');
        } catch (err: any) {
            console.error('Error capturado en register.tsx:', err);
            Alert.alert("Error de Registro", error || "No pudimos crear la cuenta. Por favor intenta de nuevo.");
        } finally {
            setUploading(false);
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
                            <Image
                                source={require('@/assets/logos/BigLogo.jpeg')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <Text style={styles.headerTitle}>
                            Crea tu Cuenta
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Publica tus propiedades y conecta con usuarios
                        </Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        {/* Avatar Section */}
                        <View style={styles.avatarSection}>
                            <Text style={styles.avatarLabel}>Foto de Perfil (Opcional)</Text>
                            <View style={styles.avatarContainer}>
                                {avatarUri ? (
                                    <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                                ) : (
                                    <MaterialCommunityIcons name="camera-plus" size={40} color="#3b82f6" />
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={pickImage}
                                disabled={isLoading || uploading}
                                style={styles.selectPhotoBtn}
                            >
                                <MaterialCommunityIcons name="image-plus" size={18} color="#3b82f6" />
                                <Text style={styles.selectPhotoBtnText}>
                                    {avatarUri ? 'Cambiar Foto' : 'Seleccionar Foto'}
                                </Text>
                            </TouchableOpacity>
                            {avatarUri && (
                                <TouchableOpacity
                                    onPress={removeAvatar}
                                    disabled={isLoading || uploading}
                                    style={styles.removePhotoBtn}
                                >
                                    <Text style={styles.removePhotoBtnText}>Eliminar Foto</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Error Message */}
                        {error && (
                            <Text style={styles.errorText}>⚠️ {error}</Text>
                        )}

                        {/* Nombre y Apellido */}
                        <View style={styles.inputRow}>
                            <View style={styles.inputHalf}>
                                <Text style={styles.fieldLabel}>Nombre</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Tu nombre"
                                    placeholderTextColor="#cbd5e1"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    editable={!isLoading}
                                />
                            </View>
                            <View style={styles.inputHalf}>
                                <Text style={styles.fieldLabel}>Apellido</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Tu apellido"
                                    placeholderTextColor="#cbd5e1"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    editable={!isLoading}
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <Text style={styles.fieldLabel}>Correo Electrónico</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="tu@email.com"
                            placeholderTextColor="#cbd5e1"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />

                        {/* Phone Input */}
                        <Text style={styles.fieldLabel}>Teléfono (Opcional)</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="+1 (555) 123-4567"
                            placeholderTextColor="#cbd5e1"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
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
                                autoCapitalize="none"
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

                        {/* Confirm Password Input */}
                        <Text style={styles.fieldLabel}>Confirmar Contraseña</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Confirmar contraseña"
                                placeholderTextColor="#cbd5e1"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                                style={styles.showPasswordBtn}
                            >
                                <Text style={styles.showPasswordText}>
                                    {showConfirmPassword ? "Ocultar" : "Mostrar"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Terms & Conditions */}
                        <View style={styles.termsContainer}>
                            <TouchableOpacity
                                onPress={() => setAgreeTerms(!agreeTerms)}
                                disabled={isLoading}
                                style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}
                            >
                                <Text style={{ fontSize: 20, marginTop: -2 }}>
                                    {agreeTerms ? '☑️' : '☐'}
                                </Text>
                                <Text style={styles.termsText}>
                                    Acepto los{' '}
                                    <Text style={styles.termsLink}>términos y condiciones</Text>
                                    {' '}y la{' '}
                                    <Text style={styles.termsLink}>política de privacidad</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={isLoading}
                            style={[styles.registerButton, isLoading && styles.registerButtonLoading]}
                        >
                            <Text style={styles.registerButtonText}>
                                {isLoading ? "Creando cuenta..." : "CREAR CUENTA"}
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerLine} />

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')} disabled={isLoading}>
                                <Text style={styles.loginLink}>Inicia sesión aquí</Text>
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
