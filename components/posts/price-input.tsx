import { CURRENCIES } from '@/config/currencies.config';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PriceInputProps {
    currency: string;
    price: string;
    onCurrencyPress: () => void;
    onPriceChange: (price: string) => void;
}

export default function PriceInput({
    currency,
    price,
    onCurrencyPress,
    onPriceChange,
}: PriceInputProps) {
    const handlePriceChange = (text: string) => {
        const numericValue = text.replace(/[^\d]/g, '');
        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        onPriceChange(formattedValue);
    };

    return (
        <View style={styles.row}>
            <View style={styles.halfInput}>
                <Text style={styles.fieldLabel}>Moneda *</Text>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={onCurrencyPress}
                >
                    <Text style={styles.dropdownButtonText}>
                        {CURRENCIES.find((c: any) => c.value === currency)?.symbol} {currency}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.halfInput}>
                <Text style={styles.fieldLabel}>Precio *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: 150,000"
                    placeholderTextColor="#cbd5e1"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={handlePriceChange}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5585b5',
        marginBottom: 8,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    dropdownButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        marginBottom: 12,
    },
    dropdownButtonText: {
        fontSize: 14,
        color: '#0f172a',
        fontWeight: '600',
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
});
