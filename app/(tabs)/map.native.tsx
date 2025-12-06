import { apiService } from '@/services/api';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

// Importar el componente de mapa para exploración de propiedades
const MapViewComponent = require('@/components/map-view-explore').default;

export default function MapScreen() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: boolean }>({
    HOUSE: true,
    APARTMENT: true,
    LAND: true,
    COMMERCIAL: true,
  });

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📍 [MapScreen] Cargando propiedades...');
      const response = await apiService.getProperties();
      const propertiesArray = response?.properties || [];
      console.log('📍 [MapScreen] Propiedades cargadas:', {
        total: propertiesArray.length,
        sample: propertiesArray[0] ? {
          id: propertiesArray[0].id,
          title: propertiesArray[0].title,
          lat: propertiesArray[0].latitude,
          lon: propertiesArray[0].longitude,
          type: propertiesArray[0].propertyType,
        } : null,
      });
      setProperties(propertiesArray);
    } catch (error) {
      console.error('Error cargando propiedades:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recargar propiedades cuando el tab se enfoca
  useFocusEffect(
    useCallback(() => {
      console.log('📍 [MapScreen] Tab enfocado - recargando propiedades');
      loadProperties();
    }, [loadProperties])
  );

  // Toggle filtro de tipos de propiedad
  const toggleFilter = (propertyType: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [propertyType]: !prev[propertyType]
    }));
  };

  // Función para obtener el color del botón según el tipo de propiedad
  const getFilterButtonColor = (propertyType: string): string => {
    switch (propertyType?.toUpperCase()) {
      case 'HOUSE':
        return '#5585b5'; // Azul
      case 'APARTMENT':
        return '#10b981'; // Verde
      case 'LAND':
        return '#f59e0b'; // Naranja
      case 'COMMERCIAL':
        return '#8b5cf6'; // Púrpura
      default:
        return '#5585b5'; // Azul por defecto
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#5585b5" />
        <Text style={{ marginTop: 12, color: '#64748b' }}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(0, 0, 0, 0)" translucent />
      <View style={{ flex: 1 }}>
        {/* Filtro de tipos de propiedad */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilters.HOUSE && {
                ...styles.filterButtonActive,
                backgroundColor: getFilterButtonColor('HOUSE'),
                borderColor: getFilterButtonColor('HOUSE'),
              }
            ]}
            onPress={() => toggleFilter('HOUSE')}
          >
            <Text
              style={[styles.filterButtonText, selectedFilters.HOUSE && styles.filterButtonTextActive]}
              numberOfLines={1}
            >
              Casa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilters.APARTMENT && {
                ...styles.filterButtonActive,
                backgroundColor: getFilterButtonColor('APARTMENT'),
                borderColor: getFilterButtonColor('APARTMENT'),
              }
            ]}
            onPress={() => toggleFilter('APARTMENT')}
          >
            <Text
              style={[styles.filterButtonText, selectedFilters.APARTMENT && styles.filterButtonTextActive]}
              numberOfLines={1}
            >
              Apto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilters.LAND && {
                ...styles.filterButtonActive,
                backgroundColor: getFilterButtonColor('LAND'),
                borderColor: getFilterButtonColor('LAND'),
              }
            ]}
            onPress={() => toggleFilter('LAND')}
          >
            <Text
              style={[styles.filterButtonText, selectedFilters.LAND && styles.filterButtonTextActive]}
              numberOfLines={1}
            >
              Terreno
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilters.COMMERCIAL && {
                ...styles.filterButtonActive,
                backgroundColor: getFilterButtonColor('COMMERCIAL'),
                borderColor: getFilterButtonColor('COMMERCIAL'),
              }
            ]}
            onPress={() => toggleFilter('COMMERCIAL')}
          >
            <Text
              style={[styles.filterButtonText, selectedFilters.COMMERCIAL && styles.filterButtonTextActive]}
              numberOfLines={1}
            >
              Comercial
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mapa */}
        <MapViewComponent
          properties={properties}
          markerMode="view"
          selectedFilters={selectedFilters}
        />
      </View>
    </SafeAreaView>
  );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 12,
    paddingTop: 50,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    // Los colores se aplicarán dinámicamente basados en el tipo
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
