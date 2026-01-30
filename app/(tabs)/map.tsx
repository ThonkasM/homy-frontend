import FilterButton from '@/components/map/filter-button';
import { PROPERTY_TYPE_FILTERS } from '@/components/map/filter-utils';
import FiltersModal from '@/components/map/filters-modal';
import MapViewExplore from '@/components/map/map-view-explore';
import { apiService } from '@/services/api';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface Property {
  id: number;
  title: string;
  propertyType: string;
  operationType: string;
  price: number;
  currency: string;
  latitude?: number;
  longitude?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  city?: string;
  images?: Array<{ id: string; url: string; order: number }>;
  createdAt: string;
  updatedAt: string;
}

export default function MapScreen() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: boolean;
  }>(() => {
    const initialFilters: { [key: string]: boolean } = {};
    PROPERTY_TYPE_FILTERS.forEach((pt) => {
      initialFilters[pt.type] = true;
    });
    return initialFilters;
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProperties({
        page: 1,
        limit: 100,
        status: 'AVAILABLE'
      });

      if (data?.properties) {
        // Normalizar estructura de propiedades
        const propertiesWithLocation = data.properties
          .map((property: any) => ({
            ...property,
            // Normalizar ubicación para que funcione con ambos formatos
            latitude: property.latitude || property.location?.latitude,
            longitude: property.longitude || property.location?.longitude,
          }))
          .filter((property: Property) => property.latitude && property.longitude);

        setProperties(propertiesWithLocation);
      } else {
        console.warn('No properties found in response');
        setProperties([]);
      }
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = useCallback((type: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }, []);

  const selectAllFilters = useCallback(() => {
    const allSelected: { [key: string]: boolean } = {};
    PROPERTY_TYPE_FILTERS.forEach((pt) => {
      allSelected[pt.type] = true;
    });
    setSelectedFilters(allSelected);
  }, []);

  const clearAllFilters = useCallback(() => {
    const allCleared: { [key: string]: boolean } = {};
    PROPERTY_TYPE_FILTERS.forEach((pt) => {
      allCleared[pt.type] = false;
    });
    setSelectedFilters(allCleared);
  }, []);

  const activeFilterCount = Object.values(selectedFilters).filter(
    (value) => value
  ).length;
  const totalFilterCount = PROPERTY_TYPE_FILTERS.length;

  // Filtrar propiedades según filtros seleccionados
  const filteredProperties = properties.filter((property) => {
    return selectedFilters[property.propertyType];
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5585b5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FilterButton
        activeCount={activeFilterCount}
        totalCount={totalFilterCount}
        onPress={() => setFilterModalVisible(true)}
      />

      <MapViewExplore
        properties={filteredProperties}
        selectedFilters={selectedFilters}
      />

      <FiltersModal
        visible={filterModalVisible}
        selectedFilters={selectedFilters}
        onClose={() => setFilterModalVisible(false)}
        onToggleFilter={toggleFilter}
        onSelectAll={selectAllFilters}
        onClearAll={clearAllFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});
