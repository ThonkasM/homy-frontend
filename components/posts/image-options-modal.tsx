import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageOptionsModalProps {
    visible: boolean;
    onTakePhoto: () => void;
    onPickFromGallery: () => void;
    onClose: () => void;
}

export default function ImageOptionsModal({
    visible,
    onTakePhoto,
    onPickFromGallery,
    onClose,
}: ImageOptionsModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.imageOptionsModal}>
                <View style={styles.imageOptionsContainer}>
                    <View style={styles.imageOptionsHeader}>
                        <Text style={styles.imageOptionsTitle}>Agregar Contenido</Text>
                        <Text style={styles.imageOptionsSubtitle}>Fotos o videos de tu propiedad</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.imageOptionButton}
                        onPress={() => {
                            onClose();
                            onTakePhoto();
                        }}
                    >
                        <View style={styles.imageOptionIcon}>
                            <MaterialCommunityIcons name="camera" size={20} color="#ffffff" />
                        </View>
                        <Text style={styles.imageOptionText}>Tomar Foto</Text>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#5585b5" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.imageOptionButton}
                        onPress={() => {
                            onClose();
                            onPickFromGallery();
                        }}
                    >
                        <View style={styles.imageOptionIcon}>
                            <MaterialCommunityIcons name="image-multiple" size={20} color="#ffffff" />
                        </View>
                        <Text style={styles.imageOptionText}>Fotos o Videos</Text>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#5585b5" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.imageOptionCancel}
                        onPress={onClose}
                    >
                        <Text style={styles.imageOptionCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    imageOptionsModal: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    imageOptionsContainer: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 32,
    },
    imageOptionsHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    imageOptionsTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#5585b5',
        marginBottom: 4,
    },
    imageOptionsSubtitle: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    imageOptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f0f4ff',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
    },
    imageOptionIcon: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#5585b5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    imageOptionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#5585b5',
    },
    imageOptionCancel: {
        marginTop: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
    },
    imageOptionCancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748b',
    },
});
