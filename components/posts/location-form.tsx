import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface LocationFormProps {
    address: string;
    city: string;
    latitude: string;
    longitude: string;
    contactPhone: string;
    showMap: boolean;
    onAddressChange: (address: string) => void;
    onCityChange: (city: string) => void;
    onLatitudeChange: (lat: string) => void;
    onLongitudeChange: (lon: string) => void;
    onPhoneChange: (phone: string) => void;
    onToggleMap: () => void;
    mapComponent?: React.ReactNode;
}

export default function LocationForm({
    address,
    city,
    latitude,
    longitude,
    contactPhone,
    showMap,
    onAddressChange,
    onCityChange,
    onLatitudeChange,
    onLongitudeChange,
    onPhoneChange,
    onToggleMap,
    mapComponent,
}: LocationFormProps) {
    return (
        <>
            <Text style={styles.fieldLabel}>Dirección *</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej: Calle Principal 123, Apt 5"
                value={address}
                onChangeText={onAddressChange}
            />

            <Text style={styles.fieldLabel}>Ciudad *</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej: La Paz"
                value={city}
                onChangeText={onCityChange}
            />

            <TouchableOpacity
                style={styles.mapButton}
                onPress={onToggleMap}
            >
                <Text style={styles.mapButtonText}>
                    {showMap ? '🗺️ Ocultar Mapa' : '🗺️ Seleccionar Ubicación en Mapa'}
                </Text>
            </TouchableOpacity>

            {showMap && mapComponent && (
                <View style={styles.mapContainer}>
                    {mapComponent}
                </View>
            )}

            <View style={styles.row}>
                <View style={[styles.halfInput, { marginBottom: 16 }]}>
                    <Text style={styles.fieldLabel}>Latitud</Text>
                    <TextInput
                        style={[styles.input, showMap && styles.inputReadOnly]}
                        placeholder="Ej: -16.5"
                        keyboardType="decimal-pad"
                        value={latitude}
                        onChangeText={onLatitudeChange}
                        editable={!showMap}
                    />
                </View>

                <View style={[styles.halfInput, { marginBottom: 16 }]}>
                    <Text style={styles.fieldLabel}>Longitud</Text>
                    <TextInput
                        style={[styles.input, showMap && styles.inputReadOnly]}
                        placeholder="Ej: -68.1"
                        keyboardType="decimal-pad"
                        value={longitude}
                        onChangeText={onLongitudeChange}
                        editable={!showMap}
                    />
                </View>
            </View>

            <Text style={styles.fieldLabel}>Teléfono de Contacto</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej: +591 71234567"
                keyboardType="phone-pad"
                value={contactPhone}
                onChangeText={onPhoneChange}
            />
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
    inputReadOnly: {
        backgroundColor: '#e2e8f0',
        color: '#64748b',
        opacity: 0.7,
    },
    mapButton: {
        backgroundColor: '#f0f4ff',
        borderWidth: 1.5,
        borderColor: '#5585b5',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    mapButtonText: {
        color: '#5585b5',
        fontSize: 14,
        fontWeight: '600',
    },
    mapContainer: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#f8fafc',
        height: 350,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
});
