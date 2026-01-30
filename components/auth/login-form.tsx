import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        paddingHorizontal: 16,
    },
    showPasswordText: {
        color: '#3b82f6',
        fontSize: 13,
        fontWeight: '600',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#3b82f6',
        fontSize: 13,
        fontWeight: '600',
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

    return (
        <View style={styles.formContainer}>
            <Text style={styles.fieldLabel}>EMAIL</Text>
            <TextInput
                style={styles.emailInput}
                placeholder="tu@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={onEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
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
                />
                <TouchableOpacity
                    style={styles.showPasswordBtn}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Text style={styles.showPasswordText}>
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => Alert.alert('Próximamente', 'Función en desarrollo')}
            >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
        </View>
    );
}
