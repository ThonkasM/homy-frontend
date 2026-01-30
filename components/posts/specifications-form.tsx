import { PropertyTypeConfig } from '@/config/property-types.config';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SpecificationsFormProps {
    config: PropertyTypeConfig | null;
    specifications: Record<string, any>;
    onUpdate: (key: string, value: any) => void;
}

export default function SpecificationsForm({
    config,
    specifications,
    onUpdate,
}: SpecificationsFormProps) {
    if (!config) {
        return <Text style={{ color: '#64748b' }}>Cargando configuración...</Text>;
    }

    return (
        <>
            {config.fields.map((field) => (
                <View key={field.key} style={{ marginBottom: 16 }}>
                    <Text style={styles.fieldLabel}>
                        {field.label}
                        {field.required ? ' *' : ''}
                    </Text>

                    {field.type === 'number' && (
                        <TextInput
                            style={styles.input}
                            placeholder={field.placeholder || `Ej: ${field.min || 0}`}
                            keyboardType="numeric"
                            value={specifications[field.key]?.toString() || ''}
                            onChangeText={(text) => onUpdate(field.key, text ? parseInt(text) : null)}
                        />
                    )}

                    {field.type === 'decimal' && (
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.halfInput, styles.input]}
                                placeholder={field.placeholder || 'Ej: 120.5'}
                                keyboardType="decimal-pad"
                                value={specifications[field.key]?.toString() || ''}
                                onChangeText={(text) => onUpdate(field.key, text ? parseFloat(text) : null)}
                            />
                            {field.unit && (
                                <View style={[styles.halfInput, { justifyContent: 'center', paddingLeft: 8 }]}>
                                    <Text style={styles.fieldLabel}>{field.unit}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {field.type === 'boolean' && (
                        <TouchableOpacity
                            style={[
                                styles.checkboxItem,
                                specifications[field.key] && styles.checkboxItemActive,
                            ]}
                            onPress={() => onUpdate(field.key, !specifications[field.key])}
                        >
                            <Text
                                style={[
                                    styles.checkboxText,
                                    specifications[field.key] && styles.checkboxTextActive,
                                ]}
                            >
                                {specifications[field.key] ? '✓' : '○'} {field.label}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {field.type === 'select' && (
                        <View style={styles.checkboxContainer}>
                            {field.options?.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.checkboxItem,
                                        specifications[field.key] === option.value && styles.checkboxItemActive,
                                    ]}
                                    onPress={() => onUpdate(field.key, option.value)}
                                >
                                    <Text
                                        style={[
                                            styles.checkboxText,
                                            specifications[field.key] === option.value && styles.checkboxTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            ))}
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
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#0f172a',
        backgroundColor: '#f8fafc',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    checkboxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    checkboxItem: {
        backgroundColor: '#f0f4ff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
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
