import { CURRENCIES } from '@/config/currencies.config';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CurrencyModalProps {
    visible: boolean;
    selectedCurrency: string;
    onSelect: (currency: string) => void;
    onClose: () => void;
}

export default function CurrencyModal({
    visible,
    selectedCurrency,
    onSelect,
    onClose,
}: CurrencyModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.currencyModal}>
                <View style={styles.currencyModalContent}>
                    <View style={styles.currencyModalHeader}>
                        <Text style={styles.currencyModalTitle}>Seleccionar Moneda</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {CURRENCIES.filter((c: any) => c.value === 'BOB' || c.value === 'USD').map((curr: any) => (
                            <TouchableOpacity
                                key={curr.value}
                                style={[
                                    styles.currencyOption,
                                    selectedCurrency === curr.value && styles.currencyOptionActive,
                                ]}
                                onPress={() => {
                                    onSelect(curr.value);
                                    onClose();
                                }}
                            >
                                <View>
                                    <Text style={styles.currencyOptionText}>
                                        {curr.symbol} {curr.value}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                                        {curr.label}
                                    </Text>
                                </View>
                                {selectedCurrency === curr.value && (
                                    <Text style={styles.currencyOptionCheck}>✓</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.currencyModalClose}
                        onPress={onClose}
                    >
                        <Text style={styles.currencyModalCloseText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    currencyModal: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    currencyModalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 32,
        maxHeight: '80%',
    },
    currencyModalHeader: {
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    currencyModalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#5585b5',
    },
    currencyOption: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    currencyOptionText: {
        fontSize: 14,
        color: '#0f172a',
        fontWeight: '500',
    },
    currencyOptionActive: {
        backgroundColor: '#f0f4ff',
    },
    currencyOptionCheck: {
        fontSize: 18,
        color: '#5585b5',
        fontWeight: '700',
    },
    currencyModalClose: {
        marginTop: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
    },
    currencyModalCloseText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748b',
    },
});
