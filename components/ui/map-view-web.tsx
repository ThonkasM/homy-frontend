import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MapViewWebProps {
  style?: any;
}

export default function MapViewWeb({ style }: MapViewWebProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.developmentMessageContainer}>
        <Text style={styles.developmentEmoji}>🗺️</Text>
        <Text style={styles.developmentTitle}>En Desarrollo</Text>
        <Text style={styles.developmentText}>
          La funcionalidad de mapa en web está en desarrollo.
        </Text>
        <Text style={styles.developmentSubtext}>
          Usa la aplicación móvil para explorar el mapa interactivo.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  developmentMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  developmentEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  developmentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  developmentText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  developmentSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 21,
  },
});
