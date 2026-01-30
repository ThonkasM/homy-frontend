import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface MapViewPropertyProps {
    selectedLocation?: { latitude: number; longitude: number } | null;
    onLocationSelect?: (latitude: number, longitude: number) => void;
    style?: any;
}

export default function MapViewProperty({
    selectedLocation,
    onLocationSelect,
    style,
}: MapViewPropertyProps) {
    const mapRef = useRef<any>(null);
    const [centerCoordinate, setCenterCoordinate] = useState(
        selectedLocation || { latitude: -17.8, longitude: -63.18 }
    );

    const MapView = require('react-native-maps').default;
    const PROVIDER_GOOGLE = require('react-native-maps').PROVIDER_GOOGLE;

    // Obtener ubicación del usuario
    useEffect(() => {
        const getUserLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const location = await Location.getCurrentPositionAsync({});
                    const userCoords = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    };
                    // Centrar mapa a la ubicación del usuario
                    if (mapRef.current) {
                        mapRef.current.animateToRegion({
                            ...userCoords,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        });
                    }
                }
            } catch (error) {
                console.error('Error obteniendo ubicación:', error);
            }
        };

        getUserLocation();
    }, []);

    const initialRegion = {
        latitude: selectedLocation?.latitude || -17.8,
        longitude: selectedLocation?.longitude || -63.18,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    // Captura las coordenadas del centro cuando el usuario mueve el mapa
    const handleRegionChangeComplete = (region: any) => {
        setCenterCoordinate({
            latitude: region.latitude,
            longitude: region.longitude,
        });
    };

    // Confirma la ubicación seleccionada
    const handleConfirmLocation = () => {
        onLocationSelect?.(centerCoordinate.latitude, centerCoordinate.longitude);
    };

    return (
        <View style={[styles.container, style]}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                zoomControlEnabled={true}
            />

            {/* Punto fijo al centro del mapa */}
            <View style={styles.centerPointContainer}>
                <View style={styles.centerPoint} />
            </View>

            {/* Botón de confirmación */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmLocation}
                >
                    <Text style={styles.confirmButtonText}>
                        ✅ Marcar Ubicación
                    </Text>
                </TouchableOpacity>
                <Text style={styles.coordinatesText}>
                    {centerCoordinate.latitude.toFixed(6)}, {centerCoordinate.longitude.toFixed(6)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    centerPointContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 40,
        height: 40,
        marginTop: -20,
        marginLeft: -20,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    centerPoint: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#3b82f6',
        borderWidth: 3,
        borderColor: '#ffffff',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        gap: 8,
    },
    confirmButton: {
        backgroundColor: '#10b981',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    confirmButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    coordinatesText: {
        fontSize: 12,
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        textAlign: 'center',
        fontFamily: 'monospace',
    },
});
