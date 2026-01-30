import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
    formContainer: {
        marginBottom: 20,
        width: '100%',
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
        letterSpacing: 0.2,
    },
    emailInput: {
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
    emailInputFocus: {
        borderColor: '#3b82f6',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center' as any,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        marginBottom: 12,
    } as any,
    passwordContainerFocus: {
        borderColor: '#3b82f6',
    },
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
        color: '#3b82f6',
        fontSize: 13,
        fontWeight: '600',
    },
    forgotPassword: {
        alignSelf: 'flex-end' as any,
        marginBottom: 20,
    } as any,
    forgotPasswordText: {
        color: '#3b82f6',
        fontSize: 13,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

interface LoginFormProps {
    email: string;
    password: string;
    onEmailChange: (text: string) => void;
    onPasswordChange: (text: string) => void;
}

export default function LoginForm({ email, password, onEmailChange, onPasswordChange }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    return (
        <View style={styles.formContainer}>
            <Text style={styles.fieldLabel}>Correo electrónico</Text>
            <TextInput
                // @ts-ignore - web-only props
                style={[
                    styles.emailInput,
                    emailFocused && styles.emailInputFocus,
                    { outlineStyle: 'none' } as any,
                ]}
                placeholder="tu@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={onEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
            />

            <Text style={styles.fieldLabel}>Contraseña</Text>
            <View
                style={[
                    styles.passwordContainer,
                    passwordFocused && styles.passwordContainerFocus,
                ]}
            >
                <TextInput
                    style={[styles.passwordInput, { outlineStyle: 'none' } as any]}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={onPasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                />
                <View
                    style={[styles.showPasswordBtn, { cursor: 'pointer' } as any]}
                    // @ts-ignore - web-only props
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <Text style={styles.showPasswordText}>
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                </View>
            </View>

            <View
                style={[styles.forgotPassword, { cursor: 'pointer' } as any]}
                // @ts-ignore - web-only props
                onClick={() => Alert.alert('Próximamente', 'Función en desarrollo')}
            >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </View>
        </View>
    );
}
