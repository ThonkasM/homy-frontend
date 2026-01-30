import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface OperationType {
    label: string;
    value: string;
}

interface OperationTypeSelectorProps {
    selectedType: string;
    onTypeChange: (type: string) => void;
}

const OPERATION_TYPES: OperationType[] = [
    { label: 'Venta', value: 'SALE' },
    { label: 'Alquiler Temporal', value: 'RENT_TEMPORARY' },
    { label: 'Alquiler Permanente', value: 'RENT_PERMANENT' },
    { label: 'Anticrético', value: 'ANTICRETICO' },
];

export default function OperationTypeSelector({
    selectedType,
    onTypeChange,
}: OperationTypeSelectorProps) {
    return (
        <>
            <Text style={styles.fieldLabel}>Tipo de Operación</Text>
            <ScrollView horizontal style={{ marginBottom: 16 }} showsHorizontalScrollIndicator={false}>
                {OPERATION_TYPES.map((type) => (
                    <TouchableOpacity
                        key={type.value}
                        style={[styles.checkboxItem, selectedType === type.value && styles.checkboxItemActive]}
                        onPress={() => onTypeChange(type.value)}
                    >
                        <Text
                            style={[styles.checkboxText, selectedType === type.value && styles.checkboxTextActive]}
                        >
                            {type.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    fieldLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5585b5',
        marginBottom: 8,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    checkboxItem: {
        backgroundColor: '#f0f4ff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        marginRight: 8,
    },
    checkboxItemActive: {
        backgroundColor: '#5585b5',
        borderColor: '#5585b5',
    },
    checkboxText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5585b5',
    },
    checkboxTextActive: {
        color: '#ffffff',
    },
});
