import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DescriptionModalProps {
    visible: boolean;
    description: string;
    onClose: () => void;
}

export default function DescriptionModal({
    visible,
    description,
    onClose,
}: DescriptionModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <View style={styles.descriptionModalHeader}>
                    <Text style={styles.descriptionModalTitle}>Descripción Completa</Text>
                    <TouchableOpacity
                        style={styles.descriptionModalCloseButton}
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 16 }}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                >
                    <Text style={styles.descriptionModalText}>{description}</Text>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    descriptionModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    descriptionModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#5585b5',
    },
    descriptionModalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    descriptionModalText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 26,
        fontWeight: '400',
        paddingBottom: 24,
    },
});
