import { getFilterButtonColor } from '@/components/map/filter-utils';
import PropertyPreviewCard from '@/components/map/property-preview-card';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface MapViewExploreProps {
    properties?: any[];
    selectedFilters?: { [key: string]: boolean };
    style?: any;
}

export default function MapViewExplore({
    properties = [],
    selectedFilters = {},
    style,
}: MapViewExploreProps) {
    const mapRef = useRef<any>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);

    const MapView = require('react-native-maps').default;
    const Marker = require('react-native-maps').Marker;
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
                    setUserLocation(userCoords);

                    // Centrar mapa a la ubicación del usuario
                    if (mapRef.current) {
                        mapRef.current.animateToRegion({
                            ...userCoords,
                            latitudeDelta: 0.08,
                            longitudeDelta: 0.08,
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error('Error obteniendo ubicación:', error);
            }
        };

        getUserLocation();
    }, []);

    const initialRegion = {
        latitude: userLocation?.latitude || -17.8,
        longitude: userLocation?.longitude || -63.18,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
    };

    const handleMarkerPress = (property: any) => {
        setSelectedProperty(property);
    };

    // Filtrar propiedades según los filtros seleccionados
    const filteredProperties = properties.filter((property: any) => {
        const typeUpper = property.propertyType?.toUpperCase();
        return selectedFilters[typeUpper];
    });

    return (
        <View style={[styles.container, style]}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                zoomControlEnabled={true}
            >
                {/* Marcadores de propiedades filtradas */}
                {filteredProperties.map((property: any) => {
                    // Validar que tenga coordenadas válidas
                    const lat = parseFloat(String(property.latitude || property.location?.latitude || 0));
                    const lon = parseFloat(String(property.longitude || property.location?.longitude || 0));

                    if (!lat || !lon) return null;

                    return (
                        <Marker
                            key={property.id}
                            coordinate={{
                                latitude: lat,
                                longitude: lon,
                            }}
                            pinColor={getFilterButtonColor(property.propertyType)}
                            onPress={() => handleMarkerPress(property)}
                            tracksViewChanges={false}
                        />
                    );
                })}
            </MapView>

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
    map: {
        width: '100%',
        height: '100%',
    },
});
