import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MapViewComponentProps {
  properties?: any[];
  markerMode?: 'view' | 'select';
  onLocationSelect?: (latitude: number, longitude: number) => void;
  selectedLocation?: { latitude: number; longitude: number } | null;
  style?: any;
}

export default function MapViewWeb({
  properties = [],
  markerMode = 'view',
  onLocationSelect,
  selectedLocation,
  style
}: MapViewComponentProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.emoji}>🗺️</Text>
      <Text style={styles.title}>En Desarrollo</Text>
      {markerMode === 'view' && (
        <>
          <Text style={styles.subtitle}>Visualización de propiedades en mapa</Text>
          <Text style={styles.description}>
            {properties?.length || 0} propiedad{properties?.length !== 1 ? 'es' : ''} disponible{properties?.length !== 1 ? 's' : ''}
          </Text>
        </>
      )}
      {markerMode === 'select' && (
        <>
          <Text style={styles.subtitle}>Selector de ubicación</Text>
          <Text style={styles.description}>
            Usa la versión móvil para seleccionar ubicaciones en el mapa
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
});
