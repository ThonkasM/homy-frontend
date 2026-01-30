import { getFilterButtonColor, PROPERTY_TYPE_FILTERS, PropertyTypeFilter } from '@/components/map/filter-utils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FiltersModalProps {
    visible: boolean;
    selectedFilters: { [key: string]: boolean };
    onClose: () => void;
    onToggleFilter: (type: string) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
}

export default function FiltersModal({
    visible,
    selectedFilters,
    onClose,
    onToggleFilter,
    onSelectAll,
    onClearAll,
}: FiltersModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtrar por tipo</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#1f2937" />
                        </TouchableOpacity>
                    </View>

                    {/* Lista de filtros */}
                    <ScrollView style={styles.filtersList}>
                        {PROPERTY_TYPE_FILTERS.map((pt: PropertyTypeFilter) => (
                            <TouchableOpacity
                                key={pt.type}
                                style={styles.filterItemContainer}
                                onPress={() => onToggleFilter(pt.type)}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        selectedFilters[pt.type] && {
                                            backgroundColor: getFilterButtonColor(pt.type),
                                            borderColor: getFilterButtonColor(pt.type),
                                        }
                                    ]}
                                >
                                    {selectedFilters[pt.type] && (
                                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                                    )}
                                </View>
                                <Text style={styles.filterItemLabel}>{pt.label}</Text>
                                <View
                                    style={[
                                        styles.colorIndicator,
                                        { backgroundColor: getFilterButtonColor(pt.type) }
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Botones de acción */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={onClearAll}
                        >
                            <Text style={styles.actionButtonText}>Limpiar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.actionButtonPrimary]}
                            onPress={onSelectAll}
                        >
                            <Text style={styles.actionButtonPrimaryText}>Seleccionar Todo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
        paddingTop: 0,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
    },
    filtersList: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    filterItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    filterItemLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#1f2937',
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    actionButtonPrimary: {
        backgroundColor: '#5585b5',
        borderColor: '#5585b5',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    actionButtonPrimaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
});
