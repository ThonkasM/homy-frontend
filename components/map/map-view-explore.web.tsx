import { getFilterButtonColor } from '@/components/map/filter-utils';
import PropertyPreviewCard from '@/components/map/property-preview-card';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface MapViewExploreProps {
    properties?: any[];
    selectedFilters?: { [key: string]: boolean };
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
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    // Deshabilitar POIs (Points of Interest) para un mapa más limpio
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
        {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }],
        },
    ],
};

export default function MapViewExplore({
    properties = [],
    selectedFilters = {},
    style,
}: MapViewExploreProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

    // Obtener ubicación del usuario
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userCoords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(userCoords);
                    setMapCenter(userCoords);
                },
                (error) => {
                    console.error('Error obteniendo ubicación:', error);
                }
            );
        }
    }, []);

    const handleMarkerClick = useCallback((property: any) => {
        setSelectedProperty(property);
    }, []);

    // Filtrar propiedades según los filtros seleccionados
    const filteredProperties = properties.filter((property: any) => {
        const typeUpper = property.propertyType?.toUpperCase();
        return selectedFilters[typeUpper];
    });

    // Función para convertir color hex a Google Maps compatible
    const getMarkerIcon = (propertyType: string) => {
        const color = getFilterButtonColor(propertyType);

        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 1,
        };
    };

    if (loadError) {
        return (
            <View style={[styles.container, style, styles.centerContent]}>
                <ActivityIndicator size="large" color="#5585b5" />
            </View>
        );
    }

    if (!isLoaded) {
        return (
            <View style={[styles.container, style, styles.centerContent]}>
                <ActivityIndicator size="large" color="#5585b5" />
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={13}
                options={mapOptions}
            >
                {/* Marcador de ubicación del usuario */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={{
                            path: 'M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0',
                            fillColor: '#4285F4',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 3,
                            scale: 1,
                        }}
                        title="Tu ubicación"
                    />
                )}

                {/* Marcadores de propiedades filtradas */}
                {filteredProperties.map((property: any) => {
                    const lat = parseFloat(String(property.latitude || property.location?.latitude || 0));
                    const lng = parseFloat(String(property.longitude || property.location?.longitude || 0));

                    if (!lat || !lng) return null;

                    return (
                        <Marker
                            key={property.id}
                            position={{ lat, lng }}
                            onClick={() => handleMarkerClick(property)}
                            icon={getMarkerIcon(property.propertyType)}
                            title={property.title}
                        />
                    );
                })}
            </GoogleMap>

            {/* Property Preview Card */}
            {selectedProperty && (
                <PropertyPreviewCard
                    property={selectedProperty}
                    onClose={() => setSelectedProperty(null)}
                />
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
});
