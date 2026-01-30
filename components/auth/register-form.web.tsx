import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
    formContainer: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
        letterSpacing: 0.2,
    },
    textInput: {
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        marginBottom: 16,
        color: '#0f172a',
        backgroundColor: '#ffffff',
    } as any,
    inputRow: {
        flexDirection: 'row' as any,
        gap: 12,
    },
    inputHalf: {
        flex: 1,
    },
    passwordContainer: {
        flexDirection: 'row' as any,
        alignItems: 'center' as any,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginBottom: 16,
    } as any,
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#0f172a',
    } as any,
    showPasswordBtn: {
        paddingHorizontal: 16,
        paddingVertical: 6,
    } as any,
    showPasswordText: {
        fontSize: 13,
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
                    <Text style={styles.fieldLabel}>Nombre</Text>
                    <TextInput
                        style={[styles.textInput, { outlineStyle: 'none' } as any]}
                        placeholder="Juan"
                        placeholderTextColor="#94a3b8"
                        value={firstName}
                        onChangeText={onFirstNameChange}
                        autoCapitalize="words"
                        editable={!disabled}
                    />
                </View>
                <View style={styles.inputHalf}>
                    <Text style={styles.fieldLabel}>Apellido</Text>
                    <TextInput
                        style={[styles.textInput, { outlineStyle: 'none' } as any]}
                        placeholder="Pérez"
                        placeholderTextColor="#94a3b8"
                        value={lastName}
                        onChangeText={onLastNameChange}
                        autoCapitalize="words"
                        editable={!disabled}
                    />
                </View>
            </View>

            <Text style={styles.fieldLabel}>Correo electrónico</Text>
            <TextInput
                style={[styles.textInput, { outlineStyle: 'none' } as any]}
                placeholder="tu@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={onEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!disabled}
            />

            <Text style={styles.fieldLabel}>Teléfono (opcional)</Text>
            <TextInput
                style={[styles.textInput, { outlineStyle: 'none' } as any]}
                placeholder="+591 12345678"
                placeholderTextColor="#94a3b8"
                value={phone}
                onChangeText={onPhoneChange}
                keyboardType="phone-pad"
                editable={!disabled}
            />

            <Text style={styles.fieldLabel}>Contraseña</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.passwordInput, { outlineStyle: 'none' } as any]}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={onPasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!disabled}
                />
                <View
                    style={[styles.showPasswordBtn, { cursor: 'pointer' } as any]}
                    // @ts-ignore
                    onClick={() => !disabled && setShowPassword(!showPassword)}
                >
                    <Text style={styles.showPasswordText}>
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                </View>
            </View>

            <Text style={styles.fieldLabel}>Confirmar contraseña</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.passwordInput, { outlineStyle: 'none' } as any]}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={confirmPassword}
                    onChangeText={onConfirmPasswordChange}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!disabled}
                />
                <View
                    style={[styles.showPasswordBtn, { cursor: 'pointer' } as any]}
                    // @ts-ignore
                    onClick={() => !disabled && setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Text style={styles.showPasswordText}>
                        {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                </View>
            </View>
        </View>
    );
}
