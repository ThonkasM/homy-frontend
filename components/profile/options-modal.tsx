import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onEdit: () => void;
    onArchive: () => void;
    onDelete: () => void;
}

export default function OptionsModal({
    visible,
    onClose,
    onEdit,
    onArchive,
    onDelete,
}: OptionsModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalContainer}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.modalContent}>
                    {/* Opción Editar */}
                    <TouchableOpacity
                        style={styles.modalOption}
                        onPress={onEdit}
                    >
                        <MaterialCommunityIcons name="pencil" size={24} color="#5585b5" />
                        <Text style={[styles.modalOptionText, styles.modalOptionEdit]}>Editar</Text>
                    </TouchableOpacity>

                    {/* Opción Archivar */}
                    <TouchableOpacity
                        style={styles.modalOption}
                        onPress={onArchive}
                    >
                        <MaterialCommunityIcons name="archive" size={24} color="#f59e0b" />
                        <Text style={[styles.modalOptionText, styles.modalOptionArchive]}>Archivar</Text>
                    </TouchableOpacity>

                    {/* Opción Eliminar */}
                    <TouchableOpacity
                        style={[styles.modalOption, styles.modalOptionLast]}
                        onPress={onDelete}
                    >
                        <MaterialCommunityIcons name="trash-can" size={24} color="#dc2626" />
                        <Text style={[styles.modalOptionText, styles.modalOptionDelete]}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    modalOption: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalOptionLast: {
        borderBottomWidth: 0,
    },
    modalOptionText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
    modalOptionEdit: {
        color: '#5585b5',
    },
    modalOptionArchive: {
        color: '#f59e0b',
    },
    modalOptionDelete: {
        color: '#dc2626',
    },
});
