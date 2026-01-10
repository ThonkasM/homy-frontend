import { apiService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Modal, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

// Importar el componente de mapa para exploración de propiedades
const MapViewComponent = require('@/components/map-view-explore').default;

export default function MapScreen() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: boolean }>({
    HOUSE: true,
    APARTMENT: true,
    OFFICE: true,
    LAND: true,
    COMMERCIAL: true,
    WAREHOUSE: true,
    ROOM: true,
  });

  const propertyTypes = [
    { type: 'HOUSE', label: 'Casa' },
    { type: 'APARTMENT', label: 'Departamento' },
    { type: 'OFFICE', label: 'Oficina' },
    { type: 'LAND', label: 'Terreno' },
    { type: 'COMMERCIAL', label: 'Comercial' },
    { type: 'WAREHOUSE', label: 'Almacén' },
    { type: 'ROOM', label: 'Habitación' },
  ];

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📍 [MapScreen] Cargando propiedades...');
      // Usar los mismos parámetros que home.tsx para obtener TODAS las propiedades
      const response = await apiService.getProperties({
        page: 1,
        limit: 100, // Obtener más propiedades para el mapa
      });
      const propertiesArray = response?.properties || [];
      console.log('📍 [MapScreen] Propiedades cargadas:', {
        total: propertiesArray.length,
        userIds: propertiesArray.map((p: any) => p.userId || p.ownerId).filter(Boolean),
        sample: propertiesArray[0] ? {
          id: propertiesArray[0].id,
          title: propertiesArray[0].title,
          lat: propertiesArray[0].latitude,
          lon: propertiesArray[0].longitude,
          type: propertiesArray[0].propertyType,
          userId: propertiesArray[0].userId,
          ownerId: propertiesArray[0].ownerId,
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

  // Seleccionar todos los filtros
  const selectAllFilters = () => {
    const allSelected: { [key: string]: boolean } = {};
    propertyTypes.forEach(pt => {
      allSelected[pt.type] = true;
    });
    setSelectedFilters(allSelected);
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    const allCleared: { [key: string]: boolean } = {};
    propertyTypes.forEach(pt => {
      allCleared[pt.type] = false;
    });
    setSelectedFilters(allCleared);
  };

  // Contar filtros activos
  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length;

  // Función para obtener el color del botón según el tipo de propiedad
  const getFilterButtonColor = (propertyType: string): string => {
    switch (propertyType?.toUpperCase()) {
      case 'HOUSE':
        return '#5585b5'; // Azul
      case 'APARTMENT':
        return '#10b981'; // Verde
      case 'OFFICE':
        return '#f97316'; // Naranja
      case 'LAND':
        return '#f59e0b'; // Ámbar
      case 'COMMERCIAL':
        return '#8b5cf6'; // Púrpura
      case 'WAREHOUSE':
        return '#6366f1'; // Índigo
      case 'ROOM':
        return '#ec4899'; // Rosa
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
        {/* Botón para abrir filtros */}
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={20} color="#5585b5" />
            <Text style={styles.filterButtonText}>Filtros</Text>
            {activeFilterCount < propertyTypes.length && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Modal de Filtros */}
        <Modal
          visible={filterModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filtrar por tipo</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#1f2937" />
                </TouchableOpacity>
              </View>

              {/* Lista de filtros */}
              <ScrollView style={styles.filtersList}>
                {propertyTypes.map((pt) => (
                  <TouchableOpacity
                    key={pt.type}
                    style={styles.filterItemContainer}
                    onPress={() => toggleFilter(pt.type)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selectedFilters[pt.type] && {
                          backgroundColor: getFilterButtonColor(pt.type),
                          borderColor: getFilterButtonColor(pt.type),
                        }
                      ]}
                    >
                      {selectedFilters[pt.type] && (
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                      )}
                    </View>
                    <Text style={styles.filterItemLabel}>{pt.label}</Text>
                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: getFilterButtonColor(pt.type) }
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Botones de acción */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={clearAllFilters}
                >
                  <Text style={styles.actionButtonText}>Limpiar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={selectAllFilters}
                >
                  <Text style={styles.actionButtonPrimaryText}>Seleccionar Todo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  filterButtonContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5585b5',
  },
  filterBadge: {
    marginLeft: 'auto',
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  filtersList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  filterItemLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionButtonPrimary: {
    backgroundColor: '#5585b5',
    borderColor: '#5585b5',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  actionButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
