import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
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
});

interface RegisterFormProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    onFirstNameChange: (text: string) => void;
    onLastNameChange: (text: string) => void;
    onEmailChange: (text: string) => void;
    onPasswordChange: (text: string) => void;
    onConfirmPasswordChange: (text: string) => void;
    onPhoneChange: (text: string) => void;
    disabled?: boolean;
}

export default function RegisterForm({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    onFirstNameChange,
    onLastNameChange,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onPhoneChange,
    disabled = false,
}: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <View style={styles.formContainer}>
            <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                    <Text style={styles.fieldLabel}>NOMBRE</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Juan"
                        placeholderTextColor="#94a3b8"
                        value={firstName}
                        onChangeText={onFirstNameChange}
                        autoCapitalize="words"
                        editable={!disabled}
                    />
                </View>
                <View style={styles.inputHalf}>
                    <Text style={styles.fieldLabel}>APELLIDO</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Pérez"
                        placeholderTextColor="#94a3b8"
                        value={lastName}
                        onChangeText={onLastNameChange}
                        autoCapitalize="words"
                        editable={!disabled}
                    />
                </View>
            </View>

            <Text style={styles.fieldLabel}>EMAIL</Text>
            <TextInput
                style={styles.textInput}
                placeholder="tu@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={onEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!disabled}
            />

            <Text style={styles.fieldLabel}>TELÉFONO (OPCIONAL)</Text>
            <TextInput
                style={styles.textInput}
                placeholder="+591 12345678"
                placeholderTextColor="#94a3b8"
                value={phone}
                onChangeText={onPhoneChange}
                keyboardType="phone-pad"
                editable={!disabled}
            />

            <Text style={styles.fieldLabel}>CONTRASEÑA</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={onPasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!disabled}
                />
                <TouchableOpacity
                    style={styles.showPasswordBtn}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={disabled}
                >
                    <Text style={styles.showPasswordText}>
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>CONFIRMAR CONTRASEÑA</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={confirmPassword}
                    onChangeText={onConfirmPasswordChange}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!disabled}
                />
                <TouchableOpacity
                    style={styles.showPasswordBtn}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={disabled}
                >
                    <Text style={styles.showPasswordText}>
                        {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
