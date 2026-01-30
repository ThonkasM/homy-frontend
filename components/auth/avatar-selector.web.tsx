import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    avatarSection: {
        alignItems: 'center' as any,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    avatarLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#f0f4ff',
        alignItems: 'center' as any,
        justifyContent: 'center' as any,
        borderWidth: 2,
        borderColor: '#3b82f6',
        marginBottom: 12,
        overflow: 'hidden',
    },
    avatarImage: {
        width: 90,
        height: 90,
    },
    selectPhotoBtn: {
        flexDirection: 'row' as any,
        alignItems: 'center' as any,
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#dbeafe',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3b82f6',
    } as any,
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
    } as any,
    removePhotoBtnText: {
        color: '#ef4444',
        fontWeight: '600',
        fontSize: 12,
    },
});

interface AvatarSelectorProps {
    avatarUri: string | null;
    onAvatarChange: (uri: string | null) => void;
}

export default function AvatarSelector({ avatarUri, onAvatarChange }: AvatarSelectorProps) {
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                onAvatarChange(result.assets[0].uri);
            }
        } catch (err) {
            Alert.alert('Error', 'No pudimos acceder a tu galería de fotos');
        }
    };

    return (
        <View style={styles.avatarSection}>
            <Text style={styles.avatarLabel}>Foto de perfil (opcional)</Text>
            <View style={styles.avatarContainer}>
                {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                ) : (
                    <MaterialCommunityIcons name="camera-plus" size={36} color="#3b82f6" />
                )}
            </View>
            <View
                style={[styles.selectPhotoBtn, { cursor: 'pointer' } as any]}
                // @ts-ignore
                onClick={pickImage}
            >
                <MaterialCommunityIcons name="image-plus" size={18} color="#3b82f6" />
                <Text style={styles.selectPhotoBtnText}>
                    {avatarUri ? 'Cambiar foto' : 'Seleccionar foto'}
                </Text>
            </View>
            {avatarUri && (
                <View
                    style={[styles.removePhotoBtn, { cursor: 'pointer' } as any]}
                    // @ts-ignore
                    onClick={() => onAvatarChange(null)}
                >
                    <Text style={styles.removePhotoBtnText}>Eliminar foto</Text>
                </View>
            )}
        </View>
    );
}
