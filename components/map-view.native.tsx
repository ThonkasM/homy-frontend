import { formatPriceWithCurrency } from '@/config/currencies.config';
import { SERVER_BASE_URL } from '@/services/api';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MapViewComponentProps {
  properties?: any[];
  markerMode?: 'view' | 'select';
  onLocationSelect?: (latitude: number, longitude: number) => void;
  selectedLocation?: { latitude: number; longitude: number } | null;
  style?: any;
  selectedFilters?: { [key: string]: boolean };
}

// Componente Mobile - con MapView
function MapViewMobile({
  properties = [],
  markerMode = 'view',
  onLocationSelect,
  selectedLocation,
  style,
  selectedFilters = { HOUSE: true, APARTMENT: true, LAND: true, COMMERCIAL: true }
}: MapViewComponentProps) {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [centerCoordinate, setCenterCoordinate] = useState(
    selectedLocation || { latitude: -17.8, longitude: -63.18 }
  );
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
          // Actualizar el centro del mapa a la ubicación del usuario
          if (mapRef.current && markerMode === 'view') {
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
  }, [markerMode]);


  // Cargar propiedades una sola vez cuando se ingresa al modo 'view'
  useEffect(() => {
    console.log('🗺️ useEffect disparado:', {
      markerMode,
      propertiesLength: properties?.length,
      loadedPropertiesLength: loadedProperties?.length,
    });

    if (markerMode === 'view' && properties && properties.length > 0) {
      // Solo cargar las propiedades una vez
      setLoadedProperties(properties);
      console.log('✅ Propiedades cargadas en el mapa:', properties.length);
    } else if (markerMode === 'select') {
      // En modo select, no cargar propiedades
      setLoadedProperties([]);
    }
  }, [markerMode, properties]);

  const initialRegion = {
    latitude: userLocation?.latitude || (markerMode === 'select' && selectedLocation ? selectedLocation.latitude : -17.8),
    longitude: userLocation?.longitude || (markerMode === 'select' && selectedLocation ? selectedLocation.longitude : -63.18),
    latitudeDelta: markerMode === 'select' ? 0.01 : 0.08,
    longitudeDelta: markerMode === 'select' ? 0.01 : 0.08,
  };

  // Función para obtener el color del marcador según el tipo de propiedad
  const getMarkerColor = (propertyType: string): string => {
    switch (propertyType?.toUpperCase()) {
      case 'HOUSE':
        return '#3b82f6'; // Azul
      case 'APARTMENT':
        return '#10b981'; // Verde
      case 'LAND':
        return '#f59e0b'; // Naranja
      case 'COMMERCIAL':
        return '#8b5cf6'; // Púrpura
      default:
        return '#6366f1'; // Índigo
    }
  };

  // Función para obtener el ícono emoji según el tipo de propiedad
  const getMarkerIcon = (propertyType: string): string => {
    switch (propertyType?.toUpperCase()) {
      case 'HOUSE':
        return '🏠';
      case 'APARTMENT':
        return '🏢';
      case 'LAND':
        return '🏗️';
      case 'COMMERCIAL':
        return '🏪';
      default:
        return '📍';
    }
  };

  const handleMarkerPress = (property: any) => {
    if (markerMode === 'view') {
      console.log('Marcador presionado:', property.title);
      setSelectedProperty(property);
    }
  };

  // Captura las coordenadas del centro y nivel de zoom cuando el usuario mueve el mapa
  const handleRegionChangeComplete = (region: any) => {
    // Calcular zoom nivel basado en latitudeDelta
    // Fórmula aproximada: zoom = log2(360 / latitudeDelta)
    const zoom = Math.round(Math.log2(360 / region.latitudeDelta));
    setZoomLevel(zoom);

    if (markerMode === 'select') {
      setCenterCoordinate({
        latitude: region.latitude,
        longitude: region.longitude,
      });
    }
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
      >
        {/* Marcadores de propiedades (modo 'view') - Cargados una sola vez */}
        {markerMode === 'view' && loadedProperties && loadedProperties
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
            />
          ))}
      </MapView>

      {/* Punto fijo al centro del mapa (solo en modo select) */}
      {markerMode === 'select' && (
        <View style={styles.centerPointContainer}>
          <View style={styles.centerPoint} />
        </View>
      )}

      {/* Botón de confirmación (solo en modo select) */}
      {markerMode === 'select' && (
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
      )}

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

export default function MapViewComponent(props: MapViewComponentProps) {
  console.log('MapViewComponent wrapper received props:', {
    propertiesCount: props.properties?.length,
    hasPropValue: !!props.properties,
    markerMode: props.markerMode,
  });

  return <MapViewMobile {...props} />;
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
  legendContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendPin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 50,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  propertyImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  previewContent: {
    padding: 16,
    gap: 12,
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  viewDetailsButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 12,
    marginBottom: 8,
  },
  viewDetailsButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  contactButton: {
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
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
