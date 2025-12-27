import { formatPriceWithCurrency } from '@/config/currencies.config';
import { SERVER_BASE_URL } from '@/services/api';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MapViewExploreProps {
    properties?: any[];
    selectedFilters?: { [key: string]: boolean };
    style?: any;
}

// Componente para exploración de propiedades con múltiples marcadores
function MapViewExploreMobile({
    properties = [],
    selectedFilters = { HOUSE: true, APARTMENT: true, LAND: true, COMMERCIAL: true },
    style,
}: MapViewExploreProps) {
    const router = useRouter();
    const mapRef = useRef<any>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [zoomLevel, setZoomLevel] = useState(0);
    const [loadedProperties, setLoadedProperties] = useState<any[]>([]);

    const MapView = require('react-native-maps').default;
    const Marker = require('react-native-maps').Marker;
    const PROVIDER_GOOGLE = require('react-native-maps').PROVIDER_GOOGLE;

    // Función para construir URL de imagen
    const buildImageUrl = (imagePath: string | undefined): string => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${SERVER_BASE_URL}${cleanPath}`;
    };

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
                    setUserLocation(userCoords);
                    // Centrar mapa a la ubicación del usuario
                    if (mapRef.current) {
                        mapRef.current.animateToRegion({
                            ...userCoords,
                            latitudeDelta: 0.008,
                            longitudeDelta: 0.008,
                        });
                    }
                } else {
                    console.log('Permiso de ubicación denegado');
                }
            } catch (error) {
                console.error('Error obteniendo ubicación:', error);
            }
        };

        getUserLocation();
    }, []);

    // Cargar propiedades una sola vez
    useEffect(() => {
        console.log('🗺️ MapViewExplore - Propiedades actualizadas:', {
            propertiesLength: properties?.length,
            loadedPropertiesLength: loadedProperties?.length,
        });

        if (properties && properties.length > 0) {
            setLoadedProperties(properties);
            console.log('✅ Propiedades cargadas en el mapa de exploración:', properties.length);
        }
    }, [properties]);

    const initialRegion = {
        latitude: userLocation?.latitude || -17.8,
        longitude: userLocation?.longitude || -63.18,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
    };

    // Obtener color del marcador según tipo de propiedad
    const getMarkerColor = (propertyType: string): string => {
        switch (propertyType?.toUpperCase()) {
            case 'HOUSE':
                return '#5585b5'; // Azul profundo
            case 'APARTMENT':
                return '#10b981'; // Verde
            case 'LAND':
                return '#f59e0b'; // Naranja
            case 'COMMERCIAL':
                return '#8b5cf6'; // Púrpura
            default:
                return '#5585b5'; // Azul profundo por defecto
        }
    };

    const handleMarkerPress = (property: any) => {
        console.log('Marcador presionado:', property.title);
        setSelectedProperty(property);
    };

    // Captura cambios de región para calcular zoom
    const handleRegionChangeComplete = (region: any) => {
        const zoom = Math.round(Math.log2(360 / region.latitudeDelta));
        setZoomLevel(zoom);
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
            >
                {/* Marcadores de propiedades filtradas */}
                {loadedProperties && loadedProperties
                    .filter((property: any) => selectedFilters[property.propertyType.toUpperCase()])
                    .map((property: any) => (
                        <Marker
                            key={property.id}
                            coordinate={{
                                latitude: parseFloat(String(property.latitude)),
                                longitude: parseFloat(String(property.longitude)),
                            }}
                            pinColor={getMarkerColor(property.propertyType)}
                            onPress={() => handleMarkerPress(property)}
                            tracksViewChanges={false}
                        />
                    ))}
            </MapView>

            {/* Property Preview Card - Bottom Sheet Style */}
            {selectedProperty && (
                <View style={styles.previewCardContainer}>
                    <TouchableOpacity
                        style={styles.previewCard}
                        activeOpacity={0.9}
                        onPress={() => router.push(`/property-detail/${selectedProperty.id}`)}
                    >
                        {/* Botón cerrar */}
                        <TouchableOpacity
                            style={styles.cardCloseButton}
                            onPress={() => setSelectedProperty(null)}
                        >
                            <Text style={styles.cardCloseButtonText}>✕</Text>
                        </TouchableOpacity>

                        {/* Contenedor con imagen y contenido lado a lado */}
                        <View style={styles.cardContent}>
                            {/* Imagen pequeña */}
                            <View style={styles.cardImageContainer}>
                                {selectedProperty.images && selectedProperty.images.length > 0 && buildImageUrl(selectedProperty.images[0].url) ? (
                                    <Image
                                        source={{ uri: buildImageUrl(selectedProperty.images[0].url) }}
                                        style={styles.cardImage}
                                    />
                                ) : (
                                    <View style={[styles.cardImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e5e7eb' }]}>
                                        <Text style={{ fontSize: 32 }}>🏠</Text>
                                    </View>
                                )}
                            </View>

                            {/* Información: título, dirección, precio */}
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle} numberOfLines={2}>
                                    {selectedProperty.title}
                                </Text>
                                <Text style={styles.cardAddress} numberOfLines={1}>
                                    📍 {selectedProperty.address}
                                </Text>
                                <Text style={styles.cardPrice}>
                                    {formatPriceWithCurrency(selectedProperty.price, selectedProperty.currency || 'BOB')}
                                </Text>
                            </View>
                        </View>

                        {/* Indicador de más detalles */}
                        <Text style={styles.cardHint}>Toca para ver más detalles →</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default function MapViewExplore(props: MapViewExploreProps) {
    console.log('MapViewExplore - Props recibidos:', {
        propertiesCount: props.properties?.length,
        selectedFilters: props.selectedFilters,
    });

    return <MapViewExploreMobile {...props} />;
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
    previewCardContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        zIndex: 100,
    },
    previewCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    cardCloseButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    cardCloseButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
    },
    cardImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f1f5f9',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardInfo: {
        flex: 1,
        gap: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        lineHeight: 22,
    },
    cardAddress: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: '#10b981',
        marginTop: 4,
    },
    cardHint: {
        fontSize: 11,
        color: '#9ca3af',
        fontStyle: 'italic',
        textAlign: 'right',
        paddingRight: 12,
        paddingBottom: 8,
    },
});
