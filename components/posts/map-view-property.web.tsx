import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface MapViewPropertyProps {
    selectedLocation?: { latitude: number; longitude: number } | null;
    onLocationSelect?: (latitude: number, longitude: number) => void;
    style?: any;
}

// Coordenadas por defecto (Santa Cruz, Bolivia)
const DEFAULT_CENTER = {
    lat: -17.8,
    lng: -63.18,
};

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }],
        },
    ],
};

export default function MapViewProperty({
    selectedLocation,
    onLocationSelect,
    style,
}: MapViewPropertyProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
        selectedLocation
            ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
            : null
    );
    const [mapCenter, setMapCenter] = useState(
        selectedLocation
            ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
            : DEFAULT_CENTER
    );

    // Obtener ubicación del usuario al cargar
    useEffect(() => {
        if (!selectedLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userCoords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMapCenter(userCoords);
                },
                (error) => {
                    console.error('Error obteniendo ubicación:', error);
                }
            );
        }
    }, [selectedLocation]);

    // Manejar click en el mapa para colocar/mover el marcador
    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setMarkerPosition({ lat, lng });
            onLocationSelect?.(lat, lng);
        }
    };

    // Manejar arrastre del marcador
    const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setMarkerPosition({ lat, lng });
            onLocationSelect?.(lat, lng);
        }
    };

    // Centrar mapa en la ubicación del usuario
    const handleMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userCoords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMapCenter(userCoords);
                    setMarkerPosition(userCoords);
                    onLocationSelect?.(userCoords.lat, userCoords.lng);
                },
                (error) => {
                    console.error('Error obteniendo ubicación:', error);
                    alert('No se pudo obtener tu ubicación. Verifica los permisos del navegador.');
                }
            );
        } else {
            alert('Tu navegador no soporta geolocalización.');
        }
    };

    const markerIcon = {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 1.5,
    };

    if (loadError) {
        return (
            <View style={[styles.container, style, styles.centerContent]}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (!isLoaded) {
        return (
            <View style={[styles.container, style, styles.centerContent]}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={15}
                options={mapOptions}
                onClick={handleMapClick}
            >
                {markerPosition && (
                    <Marker
                        position={markerPosition}
                        draggable={true}
                        onDragEnd={handleMarkerDragEnd}
                        icon={markerIcon}
                    />
                )}
            </GoogleMap>

            {/* Botón de Mi Ubicación */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={handleMyLocation}
                >
                    <Text style={styles.myLocationButtonText}>📍 Mi Ubicación</Text>
                </TouchableOpacity>

                {markerPosition && (
                    <Text style={styles.coordinatesText}>
                        {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                    </Text>
                )}
            </View>

            {/* Instrucciones */}
            {!markerPosition && (
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsText}>
                        👆 Haz click en el mapa para marcar la ubicación
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        gap: 8,
    },
    myLocationButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    myLocationButtonText: {
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
    instructionsContainer: {
        position: 'absolute',
        top: 20,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.95)',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    instructionsText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
