import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuModalProps {
    visible: boolean;
    onClose: () => void;
    onDrafts: () => void;
    onArchived: () => void;
    onEditProfile: () => void;
    onLogout: () => void;
}

export default function MenuModal({
    visible,
    onClose,
    onDrafts,
    onArchived,
    onEditProfile,
    onLogout,
}: MenuModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.menuModalOverlay}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={styles.menuModalContent}>
                    <Text style={styles.menuModalHeader}>Menú</Text>

                    {/* Borradores */}
                    <TouchableOpacity
                        style={styles.menuOption}
                        onPress={onDrafts}
                    >
                        <MaterialCommunityIcons name="file-document" size={20} color="#f59e0b" />
                        <Text style={styles.menuOptionText}>Borradores</Text>
                    </TouchableOpacity>

                    {/* Archivados */}
                    <TouchableOpacity
                        style={styles.menuOption}
                        onPress={onArchived}
                    >
                        <MaterialCommunityIcons name="archive" size={20} color="#8b5cf6" />
                        <Text style={styles.menuOptionText}>Archivados</Text>
                    </TouchableOpacity>

                    {/* Editar Perfil */}
                    <TouchableOpacity
                        style={styles.menuOption}
                        onPress={onEditProfile}
                    >
                        <MaterialCommunityIcons name="account-edit" size={20} color="#5585b5" />
                        <Text style={styles.menuOptionText}>Editar Perfil</Text>
                    </TouchableOpacity>

                    {/* Cerrar Sesión */}
                    <TouchableOpacity
                        style={[styles.menuOption, styles.menuOptionLogout]}
                        onPress={onLogout}
                    >
                        <MaterialCommunityIcons name="logout" size={20} color="#dc2626" />
                        <Text style={[styles.menuOptionText, styles.menuOptionLogoutText]}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    menuModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    menuModalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
        gap: 0,
    },
    menuModalHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#5585b5',
        marginBottom: 20,
        textAlign: 'center',
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 12,
        marginBottom: 8,
    },
    menuOptionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#475569',
        flex: 1,
    },
    menuOptionLogout: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    menuOptionLogoutText: {
        color: '#dc2626',
        fontWeight: '700',
    },
});
