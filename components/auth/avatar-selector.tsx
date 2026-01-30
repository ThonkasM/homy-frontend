import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
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
            <Text style={styles.avatarLabel}>FOTO DE PERFIL (OPCIONAL)</Text>
            <View style={styles.avatarContainer}>
                {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                ) : (
                    <MaterialCommunityIcons name="camera-plus" size={40} color="#3b82f6" />
                )}
            </View>
            <TouchableOpacity style={styles.selectPhotoBtn} onPress={pickImage}>
                <MaterialCommunityIcons name="image" size={18} color="#3b82f6" />
                <Text style={styles.selectPhotoBtnText}>
                    {avatarUri ? 'Cambiar foto' : 'Seleccionar foto'}
                </Text>
            </TouchableOpacity>
            {avatarUri && (
                <TouchableOpacity style={styles.removePhotoBtn} onPress={() => onAvatarChange(null)}>
                    <Text style={styles.removePhotoBtnText}>Eliminar foto</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
