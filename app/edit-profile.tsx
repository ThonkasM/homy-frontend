import { useAuth } from '@/context/auth-context';
import { SERVER_BASE_URL } from '@/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const createStyles = (width: number) => {
    const isWeb = width > 768;
    const maxWidth = isWeb ? 600 : '100%' as any;

    return StyleSheet.create({
        safeContainer: {
            flex: 1,
            backgroundColor: '#ffffff',
        },
        container: {
            flex: 1,
            width: '100%',
            maxWidth: maxWidth as any,
            alignSelf: 'center',
        },
        headerBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            backgroundColor: '#ffffff',
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: '#5585b5',
            marginLeft: 12,
            flex: 1,
        },
        contentContainer: {
            paddingHorizontal: 24,
            paddingVertical: 24,
            gap: 16,
        },
        formGroup: {
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: '#475569',
            marginBottom: 8,
        },
        input: {
            borderWidth: 1,
            borderColor: '#cbd5e1',
            borderRadius: 8,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: '#0f172a',
            backgroundColor: '#f8fafc',
        },
        inputMultiline: {
            borderWidth: 1,
            borderColor: '#cbd5e1',
            borderRadius: 8,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: '#0f172a',
            backgroundColor: '#f8fafc',
            minHeight: 100,
            textAlignVertical: 'top',
        },
        charCount: {
            fontSize: 12,
            color: '#64748b',
            marginTop: 6,
        },
        buttonContainer: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 24,
            marginBottom: 40,
        },
        button: {
            flex: 1,
            paddingVertical: 14,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonSave: {
            backgroundColor: '#5585b5',
        },
        buttonCancel: {
            backgroundColor: '#e2e8f0',
        },
        buttonText: {
            fontSize: 14,
            fontWeight: '600',
        },
        buttonTextSave: {
            color: '#ffffff',
        },
        buttonTextCancel: {
            color: '#64748b',
        },
    });
};

export default function EditProfileScreen() {
    const { width } = useWindowDimensions();
    const styles = createStyles(width);
    const router = useRouter();
    const { user, token, updateUser } = useAuth();

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [updating, setUpdating] = useState(false);

    const handleSaveProfile = async () => {
        try {
            setUpdating(true);

            // Validaciones básicas
            if (!email) {
                Alert.alert('Error', 'El correo es requerido');
                return;
            }

            if (!firstName || !lastName) {
                Alert.alert('Error', 'El nombre y apellido son requeridos');
                return;
            }

            if (!token) {
                throw new Error('No hay sesión activa');
            }

            const response = await fetch(`${SERVER_BASE_URL}/api/auth/profile`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone,
                    bio,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error actualizando perfil');
            }

            const data = await response.json();

            const updatedUser = data.data || data.user || data;
            if (updatedUser && updatedUser.email) {
                await updateUser(updatedUser);
                Alert.alert('Éxito', 'Tu perfil ha sido actualizado');
                router.back();
            }
        } catch (err: any) {
            console.error('Error al actualizar perfil:', err);
            Alert.alert('Error', err.message || 'No pudimos actualizar tu perfil');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Header */}
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="#5585b5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
            </View>

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    {/* Nombre */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tu nombre"
                            placeholderTextColor="#94a3b8"
                            value={firstName}
                            onChangeText={setFirstName}
                            editable={!updating}
                        />
                    </View>

                    {/* Apellido */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Apellido</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tu apellido"
                            placeholderTextColor="#94a3b8"
                            value={lastName}
                            onChangeText={setLastName}
                            editable={!updating}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Correo Electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@email.com"
                            placeholderTextColor="#94a3b8"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            editable={!updating}
                        />
                    </View>

                    {/* Teléfono */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Teléfono</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+591 12345678"
                            placeholderTextColor="#94a3b8"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            editable={!updating}
                        />
                    </View>

                    {/* Bio */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Acerca de mí</Text>
                        <TextInput
                            style={styles.inputMultiline}
                            placeholder="Cuéntanos sobre ti..."
                            placeholderTextColor="#94a3b8"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            maxLength={500}
                            editable={!updating}
                        />
                        <Text style={styles.charCount}>
                            {bio.length}/500
                        </Text>
                    </View>

                    {/* Botones */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonCancel]}
                            onPress={() => router.back()}
                            disabled={updating}
                        >
                            <Text style={[styles.buttonText, styles.buttonTextCancel]}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonSave]}
                            onPress={handleSaveProfile}
                            disabled={updating}
                        >
                            {updating ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text style={[styles.buttonText, styles.buttonTextSave]}>
                                    Guardar Cambios
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
